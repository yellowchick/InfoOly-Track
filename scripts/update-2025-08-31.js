const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
};

async function updateTasks() {
  console.log('\n=== 更新任务板 ===\n');

  // 马天成：TR12
  const mtcTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['马天成'] },
  });
  for (const task of mtcTasks) {
    if (task.title.includes('TR12')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 马天成: ${task.title} -> completed`);
      } else {
        console.log(`📋 马天成: ${task.title} 已是 completed`);
      }
    }
  }

  // 党皓天：TR14
  const dhtTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['党皓天'] },
  });
  for (const task of dhtTasks) {
    if (task.title.includes('TR14')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 党皓天: ${task.title} -> completed`);
      } else {
        console.log(`📋 党皓天: ${task.title} 已是 completed`);
      }
    }
  }
}

async function updateContests() {
  console.log('\n=== 更新比赛成绩 ===\n');

  // AtCoder ABC473
  let abc473 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC473', date: '2026-08' },
  });
  if (!abc473) {
    abc473 = await prisma.contest.create({
      data: { name: 'AtCoder ABC473', platform: 'AtCoder', date: '2026-08', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC473 (2026-08)');
  } else {
    console.log('📋 已有比赛: AtCoder ABC473');
  }

  const existing = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['党皓天'], contestId: abc473.id },
  });
  if (!existing) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['党皓天'],
        contestId: abc473.id,
        score: 1975,
        rank: 1494,
        atcoderRank: 12903,
        atcoderRating: 1106,
        notes: '账号: solitaire',
      },
    });
    console.log('✅ 党皓天: ABC473 1975/2575, 排名1494, Rank 12903, Rating 1106');
  } else {
    console.log('📋 党皓天已有 ABC473 成绩');
  }
}

async function main() {
  console.log('========================================');
  console.log('  更新任务板 + 比赛成绩（2026-08-31）');
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  await updateTasks();
  await updateContests();

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
