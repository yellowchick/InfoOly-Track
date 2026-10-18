const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
};

// 通用：查找或创建比赛
async function getOrCreateContest(name, date, platform, type, extra = {}) {
  let contest = await prisma.contest.findFirst({ where: { name, date } });
  if (!contest) {
    contest = await prisma.contest.create({
      data: { name, platform, date, type, ...extra },
    });
    console.log(`✅ 创建比赛: ${name} (${date})`);
  } else {
    console.log(`📋 已有比赛: ${name} (${date})`);
  }
  return contest;
}

// 通用：创建或更新成绩
async function upsertResult(studentName, contestId, data) {
  const existing = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS[studentName], contestId },
  });
  if (!existing) {
    await prisma.studentContestResult.create({
      data: { studentId: STUDENTS[studentName], contestId, ...data },
    });
    console.log(`  ✅ ${studentName}: 新成绩`, JSON.stringify(data));
  } else {
    await prisma.studentContestResult.update({
      where: { id: existing.id },
      data,
    });
    console.log(`  ✅ ${studentName}: 成绩已更新`, JSON.stringify(data));
  }
}

async function main() {
  console.log('========================================');
  console.log('  更新 2026-09 / 2026-10 比赛数据（2026-10-18）');
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  // ========== 九月比赛更新 ==========
  console.log('\n--- 九月比赛更新 ---');

  // AtCoder ABC476 (2026-09)
  const abc476 = await getOrCreateContest('AtCoder ABC476', '2026-09', 'AtCoder', 'online');
  await upsertResult('陆臻', abc476.id, {
    score: 600, rank: 5778, atcoderRating: 342,
    notes: '账号: Remielle',
  });

  // AtCoder ABC477 (2026-09)
  const abc477 = await getOrCreateContest('AtCoder ABC477', '2026-09', 'AtCoder', 'online');
  await upsertResult('党皓天', abc477.id, {
    score: 1450, rank: 1645, atcoderRank: 13078, atcoderRating: 1151,
    notes: '账号: solitaire',
  });
  await upsertResult('马天成', abc477.id, {
    score: 1000, rank: 2903, atcoderRank: 6736, atcoderRating: 1431,
    notes: '账号: Tiancheng',
  });
  await upsertResult('陆臻', abc477.id, {
    score: 600, rank: 5455, atcoderRating: 401,
    notes: '账号: Remielle',
  });

  // 2026 CSP-S 初赛 (2026-09, 分数线57)
  const cspsPre = await getOrCreateContest('CSP-S 初赛', '2026-09', 'CCF', 'offline', {
    description: '分数线: 57',
  });
  await upsertResult('马天成', cspsPre.id, { score: 79, notes: '过线 (+22)' });
  // 党皓天 66.5 分：schema score 为 Int，存 66 并在 notes 标注实际分数
  await upsertResult('党皓天', cspsPre.id, { score: 66, notes: '实际得分: 66.5，过线 (+9.5)' });
  await upsertResult('张赫桐', cspsPre.id, { score: 64, notes: '过线 (+7)' });
  await upsertResult('陆臻', cspsPre.id, { score: 57, notes: '压线过线 (+0)' });

  // ========== 十月比赛更新 ==========
  console.log('\n--- 十月比赛更新 ---');

  // AtCoder ABC478 (2026-10)
  const abc478 = await getOrCreateContest('AtCoder ABC478', '2026-10', 'AtCoder', 'online');
  await upsertResult('陆臻', abc478.id, {
    score: 1000, rank: 5455, atcoderRank: 33580, atcoderRating: 401,
    notes: '账号: Remielle',
  });

  // AtCoder ABC480 (2026-10)
  const abc480 = await getOrCreateContest('AtCoder ABC480', '2026-10', 'AtCoder', 'online');
  await upsertResult('党皓天', abc480.id, {
    score: 1450, rank: 4196, atcoderRating: 500,
    notes: '账号: solitaire',
  });

  console.log('\n========================================');
  console.log('  所有更新完成！');
  console.log('========================================');

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
