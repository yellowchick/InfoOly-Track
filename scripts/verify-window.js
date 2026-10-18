// 验证陆臻 abc476/abc477 的 AC 提交是否都在比赛时间窗口内
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, timeout: 30000 });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  // 1. 获取 abc476 / abc477 的官方结束时间
  for (const cid of ['abc476', 'abc477']) {
    const res = await fetch(`https://atcoder.jp/contests/${cid}/results`, { headers: { 'User-Agent': UA }, timeout: 60000 });
    const html = await res.text();
    const m = html.match(/"EndTime":"([^"]+)"/);
    console.log(`${cid} EndTime: ${m ? m[1] : '未找到'}`);
  }

  // 2. 陆臻在这两场比赛的所有 AC 提交时间
  const subs = await fetchJson('https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=Remielle&from_second=1787000000');
  for (const cid of ['abc476', 'abc477']) {
    const acByProblem = new Map();
    for (const s of subs) {
      if (s.contest_id !== cid || s.result !== 'AC') continue;
      const t = new Date(s.epoch_second * 1000).toISOString();
      if (!acByProblem.has(s.problem_id) || s.epoch_second < acByProblem.get(s.problem_id).epoch) {
        acByProblem.set(s.problem_id, { epoch: s.epoch_second, time: t, point: s.point });
      }
    }
    console.log(`\n${cid} 陆臻各题最早 AC:`);
    let total = 0;
    for (const [pid, v] of [...acByProblem.entries()].sort()) {
      console.log(`  ${pid}: +${v.point} @ ${v.time}`);
      total += v.point;
    }
    console.log(`  合计: ${total}`);
  }
}
main().catch(e => { console.error(e); process.exit(1); });
