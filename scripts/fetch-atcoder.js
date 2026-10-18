/**
 * AtCoder ABC 比赛成绩自动抓取脚本
 *
 * 原理：
 *   1. 通过 AtCoder Problems API（kenkoooo.com）查询绑定学生的提交记录，检测参赛情况并累加 AC 分数
 *   2. 爬取 AtCoder 官网比赛成绩页（内嵌 JSON），获取排名、Rating、Rank 总排名
 *   3. 幂等写入数据库：比赛/成绩已存在则跳过（--update 可强制更新）
 *
 * 用法：
 *   node scripts/fetch-atcoder.js                # 正常模式，补录最近窗口内缺失的成绩
 *   node scripts/fetch-atcoder.js --dry-run      # 只打印，不写数据库
 *   node scripts/fetch-atcoder.js --update       # 已存在的成绩也更新（如补 AtCoderRank 实时值）
 *   node scripts/fetch-atcoder.js --back 12      # 回扫12场（默认8）
 *   node scripts/fetch-atcoder.js --contest abc477  # 只处理指定比赛
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const UPDATE = args.includes('--update');
const backIdx = args.indexOf('--back');
const BACK = backIdx !== -1 ? (parseInt(args[backIdx + 1], 10) || 8) : 8;
const CONTEST_ONLY = args.includes('--contest') ? args[args.indexOf('--contest') + 1].toLowerCase() : null;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const KENKOOOO = 'https://kenkoooo.com/atcoder/atcoder-api/v3';

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(url, opts = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, timeout: 30000, ...opts });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(2000 * (i + 1));
    }
  }
}

async function fetchText(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA }, timeout: 60000 });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i === retries - 1) throw e;
      await sleep(2000 * (i + 1));
    }
  }
}

// 从官网成绩页 HTML 中提取内嵌的 results JSON 数组
function parseResultsHtml(html) {
  const varIdx = html.indexOf('var results');
  if (varIdx === -1) return null;
  const arrStart = html.indexOf('[', html.indexOf('=', varIdx));
  if (arrStart === -1) return null;
  let depth = 0, inStr = false, esc = false, end = -1;
  for (let i = arrStart; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) return null;
  try { return JSON.parse(html.slice(arrStart, end + 1)); } catch { return null; }
}

// 确定基准 abc 编号：取数据库已有比赛 + 学生提交记录中的最大值
async function detectBaseNumber(students) {
  let base = 0;
  const contestNames = await prisma.contest.findMany({
    where: { name: { startsWith: 'AtCoder ABC' } },
    select: { name: true },
  });
  for (const c of contestNames) {
    const m = c.name.match(/ABC(\d+)/i);
    if (m) base = Math.max(base, parseInt(m[1], 10));
  }
  const now = Math.floor(Date.now() / 1000);
  for (const s of students) {
    if (!s.atcoderId) continue;
    const subs = await fetchJson(`${KENKOOOO}/user/submissions?user=${encodeURIComponent(s.atcoderId)}&from_second=${now - 90 * 86400}`);
    if (subs) {
      for (const sub of subs) {
        const m = sub.contest_id && sub.contest_id.match(/^abc(\d+)$/i);
        if (m) base = Math.max(base, parseInt(m[1], 10));
      }
    }
    await sleep(800);
  }
  return base;
}

async function main() {
  console.log('========================================');
  console.log(`  AtCoder ABC 成绩自动抓取 ${DRY_RUN ? '[DRY-RUN] ' : ''}${UPDATE ? '[UPDATE] ' : ''}`);
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  const students = await prisma.student.findMany({
    where: { atcoderId: { not: null } },
    select: { id: true, name: true, atcoderId: true },
  });
  if (students.length === 0) {
    console.log('⚠️ 没有绑定 atcoderId 的学生，请先运行回填脚本');
    await prisma.$disconnect();
    return;
  }
  console.log(`\n已绑定账号的学生（${students.length}人）:`);
  students.forEach(s => console.log(`  - ${s.name} → ${s.atcoderId}`));

  // 候选比赛列表
  let contestIds = [];
  if (CONTEST_ONLY) {
    contestIds = [CONTEST_ONLY];
  } else {
    const base = await detectBaseNumber(students);
    console.log(`\n基准 ABC 编号: abc${base}，回扫 ${BACK} 场`);
    for (let n = Math.max(1, base - BACK); n <= base + 2; n++) {
      contestIds.push(`abc${n}`);
    }
  }

  // 第一步：按学生查询提交记录，检测参赛情况 + 计算得分
  console.log('\n--- 步骤1: 查询学生提交记录 ---');
  const participations = new Map(); // contestId -> Map<studentId, {score, submissions}>
  const nowSec = Math.floor(Date.now() / 1000);

  for (const s of students) {
    const subs = await fetchJson(`${KENKOOOO}/user/submissions?user=${encodeURIComponent(s.atcoderId)}&from_second=${nowSec - (BACK + 5) * 7 * 86400}`);
    if (!subs) { console.log(`  ⚠️ ${s.name}: 提交记录查询失败`); continue; }

    const byContest = new Map();
    for (const sub of subs) {
      const m = sub.contest_id && sub.contest_id.match(/^abc(\d+)$/i);
      if (!m) continue;
      if (!byContest.has(sub.contest_id)) byContest.set(sub.contest_id, new Map());
      const probs = byContest.get(sub.contest_id);
      // ABC 非部分分：每题取最高 AC 分数
      if (sub.result === 'AC') {
        probs.set(sub.problem_id, Math.max(probs.get(sub.problem_id) || 0, sub.point));
      }
    }
    for (const [cid, probs] of byContest) {
      const score = Math.round([...probs.values()].reduce((a, b) => a + b, 0));
      if (!participations.has(cid)) participations.set(cid, new Map());
      participations.get(cid).set(s.id, { student: s, score, acCount: probs.size });
    }
    console.log(`  ✅ ${s.name}: ${byContest.size} 场 ABC 有提交`);
    await sleep(800);
  }

  const targetContests = CONTEST_ONLY
    ? [...participations.keys()]
    : contestIds.filter(cid => participations.has(cid));

  if (targetContests.length === 0) {
    console.log('\n📭 窗口期内没有学生参赛的 ABC 比赛');
    await prisma.$disconnect();
    return;
  }
  console.log(`\n需处理比赛（有学生参赛）: ${targetContests.join(', ')}`);

  // 第二步：逐场爬官网成绩页，补排名/Rating，写入数据库
  console.log('\n--- 步骤2: 抓取官网排名并入库 ---');
  for (const cid of targetContests) {
    const results = participations.get(cid);
    console.log(`\n🏁 ${cid}:`);

    const html = await fetchText(`https://atcoder.jp/contests/${cid}/results`);
    if (!html) { console.log('  ⚠️ 官网成绩页不存在，跳过'); continue; }
    const standings = parseResultsHtml(html);
    if (!standings) { console.log('  ⚠️ 官网 JSON 解析失败，跳过'); continue; }

    const endTime = standings[0]?.EndTime ? new Date(standings[0].EndTime) : null;
    if (endTime && endTime.getTime() > Date.now()) {
      console.log(`  ⏳ 比赛尚未结束 (${endTime.toISOString()})，跳过`);
      continue;
    }
    const month = endTime ? `${endTime.getFullYear()}-${String(endTime.getMonth() + 1).padStart(2, '0')}` : null;

    // 建立用户名索引
    const byHandle = new Map();
    for (const r of standings) byHandle.set(r.UserScreenName.toLowerCase(), r);

    // 查找或创建比赛记录
    const contestName = `AtCoder ABC${cid.replace('abc', '')}`;
    let contest = await prisma.contest.findFirst({ where: { name: contestName, date: month || '' } });
    if (!contest && !DRY_RUN) {
      contest = await prisma.contest.create({
        data: { name: contestName, platform: 'AtCoder', date: month || '', type: 'online' },
      });
      console.log(`  ✅ 创建比赛记录: ${contestName} (${month})`);
    } else if (!contest) {
      console.log(`  [DRY-RUN] 将创建比赛: ${contestName} (${month})`);
    } else {
      console.log(`  📋 比赛已存在: ${contestName} (${month})`);
    }
    const contestId = contest ? contest.id : '(dry-run)';

    for (const [, p] of results) {
      const official = byHandle.get(p.student.atcoderId.toLowerCase());
      const rank = official ? official.Place : null;
      const atcoderRank = official ? official.AtCoderRank : null;
      const rating = official ? official.NewRating : null;
      const isRated = official ? official.IsRated : null;

      const existing = contest.id ? await prisma.studentContestResult.findFirst({
        where: { studentId: p.student.id, contestId: contest.id },
      }) : null;

      const dataStr = `得分${p.score}(${p.acCount}题)` + (rank ? `, 排名${rank}` : '') + (rating != null ? `, Rating ${rating}` : '') + (atcoderRank ? `, Rank ${atcoderRank}` : '') + (isRated === false ? ' [unrated]' : '');

      if (existing && !UPDATE) {
        console.log(`  📋 ${p.student.name}: 已有成绩（${dataStr}），跳过`);
        continue;
      }

      const data = {
        score: p.score,
        rank,
        atcoderRank,
        atcoderRating: rating,
        notes: `账号: ${p.student.atcoderId}`,
      };

      if (DRY_RUN) {
        console.log(`  [DRY-RUN] ${existing ? '更新' : '新建'} ${p.student.name}: ${dataStr}`);
      } else if (existing) {
        await prisma.studentContestResult.update({ where: { id: existing.id }, data });
        console.log(`  ✅ ${p.student.name}: 成绩已更新 ${dataStr}`);
      } else {
        await prisma.studentContestResult.create({
          data: { studentId: p.student.id, contestId: contestId, ...data },
        });
        console.log(`  ✅ ${p.student.name}: 成绩已录入 ${dataStr}`);
      }
    }
    await sleep(2000); // 限速，避免对官网造成压力
  }

  console.log('\n========================================');
  console.log('  抓取完成！');
  console.log('========================================');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
