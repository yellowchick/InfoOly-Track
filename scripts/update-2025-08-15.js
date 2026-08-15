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

  // 党皓天：贪心练习 noip05 已完成
  const dhtTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['党皓天'] },
  });
  for (const task of dhtTasks) {
    if (task.title.includes('贪心练习 NOIP05') || task.title.includes('贪心练习 noip05')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 党皓天: ${task.title} -> completed`);
      } else {
        console.log(`📋 党皓天: ${task.title} 已是 completed`);
      }
    }
  }

  // 马天成：多个任务已完成
  const mtcTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['马天成'] },
  });
  const mtcTargets = ['分块进阶', 'TR04', '2622', '2621', '按位贪心 2461', '贪心练习 NOIP05', '贪心练习 noip05', '莫队进阶题 TR19'];
  for (const task of mtcTasks) {
    for (const target of mtcTargets) {
      if (task.title.includes(target)) {
        if (task.status !== 'completed') {
          await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
          console.log(`✅ 马天成: ${task.title} -> completed`);
        } else {
          console.log(`📋 马天成: ${task.title} 已是 completed`);
        }
      }
    }
  }
}

async function updateContests() {
  console.log('\n=== 更新比赛成绩 ===\n');

  // 创建 AtCoder ABC470
  let abc470 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC470', date: '2026-08' },
  });

  if (!abc470) {
    abc470 = await prisma.contest.create({
      data: { name: 'AtCoder ABC470', platform: 'AtCoder', date: '2026-08', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC470 (2026-08)');
  } else {
    console.log('📋 已有比赛: AtCoder ABC470');
  }

  const results = [
    {
      name: '马天成',
      score: 1000,
      rank: 1639,
      atcoderRank: 8408,
      atcoderRating: 1315,
      notes: '账号: Tiancheng',
    },
    {
      name: '党皓天',
      score: 700,
      rank: 3766,
      atcoderRank: 24324,
      atcoderRating: 735,
      notes: '账号: solitaire',
    },
    {
      name: '张赫桐',
      score: 700,
      rank: 4647,
      atcoderRank: null,
      atcoderRating: null,
      notes: '账号: zhanghetong，Rank总排名未开启',
    },
    {
      name: '陆臻',
      score: 700,
      rank: 4699,
      atcoderRank: 71903,
      atcoderRating: 65,
      notes: '账号: Remielle',
    },
  ];

  for (const r of results) {
    const existing = await prisma.studentContestResult.findFirst({
      where: {
        studentId: STUDENTS[r.name],
        contestId: abc470.id,
      },
    });

    if (!existing) {
      await prisma.studentContestResult.create({
        data: {
          studentId: STUDENTS[r.name],
          contestId: abc470.id,
          score: r.score,
          rank: r.rank,
          atcoderRank: r.atcoderRank,
          atcoderRating: r.atcoderRating,
          notes: r.notes,
        },
      });
      console.log(`✅ ${r.name}: AtCoder ABC470 ${r.score}/2550, 排名${r.rank}`);
    } else {
      console.log(`📋 ${r.name}已有 AtCoder ABC470 成绩`);
    }
  }
}

async function main() {
  console.log('========================================');
  console.log('  更新任务板 + 比赛成绩（2026-08-15）');
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
