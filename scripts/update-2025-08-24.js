const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
};

async function updateTasks() {
  console.log('\n=== 更新任务板 ===\n');

  // 党皓天：csps2024真题
  const dhtTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['党皓天'] },
  });
  for (const task of dhtTasks) {
    if (task.title.includes('csps2024真题') || task.title.includes('cspstr14')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 党皓天: ${task.title} -> completed`);
      } else {
        console.log(`📋 党皓天: ${task.title} 已是 completed`);
      }
    }
  }

  // 马天成：cspstr14
  const mtcTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['马天成'] },
  });
  for (const task of mtcTasks) {
    if (task.title.includes('CSPSTR14')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 马天成: ${task.title} -> completed`);
      } else {
        console.log(`📋 马天成: ${task.title} 已是 completed`);
      }
    }
  }
}

async function updateContests() {
  console.log('\n=== 更新比赛成绩 ===\n');

  // AtCoder ABC472
  let abc472 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC472', date: '2026-08' },
  });
  if (!abc472) {
    abc472 = await prisma.contest.create({
      data: { name: 'AtCoder ABC472', platform: 'AtCoder', date: '2026-08', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC472 (2026-08)');
  } else {
    console.log('📋 已有比赛: AtCoder ABC472');
  }

  const results = [
    {
      name: '马天成',
      score: 2575,
      rank: 274,
      atcoderRank: 4953,
      atcoderRating: 1572,
      notes: '账号: Tiancheng，AI介入，本次比赛不做经验累积，自觉性已批评',
    },
    {
      name: '党皓天',
      score: 1975,
      rank: 893,
      atcoderRank: 14954,
      atcoderRating: 1021,
      notes: '账号: solitaire',
    },
    {
      name: '陆臻',
      score: 1975,
      rank: 927,
      atcoderRank: 28664,
      atcoderRating: 623,
      notes: '账号: Remielle',
    },
    {
      name: '张赫桐',
      score: 1000,
      rank: 4741,
      atcoderRank: 72285,
      atcoderRating: 63,
      notes: '账号: zhanghetong',
    },
  ];

  for (const r of results) {
    const existing = await prisma.studentContestResult.findFirst({
      where: { studentId: STUDENTS[r.name], contestId: abc472.id },
    });
    if (!existing) {
      await prisma.studentContestResult.create({
        data: {
          studentId: STUDENTS[r.name],
          contestId: abc472.id,
          score: r.score,
          rank: r.rank,
          atcoderRank: r.atcoderRank,
          atcoderRating: r.atcoderRating,
          notes: r.notes,
        },
      });
      console.log(`✅ ${r.name}: ABC472 ${r.score}/2575, 排名${r.rank}`);
    } else {
      console.log(`📋 ${r.name}已有 ABC472 成绩`);
    }
  }
}

async function main() {
  console.log('========================================');
  console.log('  更新任务板 + 比赛成绩（2026-08-24）');
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
