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

  const mtcTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['马天成'] },
  });

  const targets = ['网络流', '博弈论', 'Bitset+莫队', 'DP陷阱题'];
  for (const task of mtcTasks) {
    for (const target of targets) {
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

  // 1. AtCoder ABC471
  let abc471 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC471', date: '2026-08' },
  });
  if (!abc471) {
    abc471 = await prisma.contest.create({
      data: { name: 'AtCoder ABC471', platform: 'AtCoder', date: '2026-08', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC471 (2026-08)');
  } else {
    console.log('📋 已有比赛: AtCoder ABC471');
  }

  const abc471Results = [
    { name: '马天成', score: 1450, rank: 3348, atcoderRank: null, atcoderRating: null, notes: '账号: Tiancheng' },
    { name: '党皓天', score: 1450, rank: 2761, atcoderRank: 20962, atcoderRating: 831, notes: '账号: solitaire' },
    { name: '陆臻', score: 1450, rank: 3032, atcoderRank: null, atcoderRating: null, notes: '账号: Remielle，忘记报名，比赛开始才进入，不计入积分' },
  ];

  for (const r of abc471Results) {
    const existing = await prisma.studentContestResult.findFirst({
      where: { studentId: STUDENTS[r.name], contestId: abc471.id },
    });
    if (!existing) {
      await prisma.studentContestResult.create({
        data: { studentId: STUDENTS[r.name], contestId: abc471.id, score: r.score, rank: r.rank, atcoderRank: r.atcoderRank, atcoderRating: r.atcoderRating, notes: r.notes },
      });
      console.log(`✅ ${r.name}: ABC471 ${r.score}/2550, 排名${r.rank}`);
    } else {
      console.log(`📋 ${r.name}已有 ABC471 成绩`);
    }
  }

  // 2. AtCoder ARC227
  let arc227 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ARC227', date: '2026-08' },
  });
  if (!arc227) {
    arc227 = await prisma.contest.create({
      data: { name: 'AtCoder ARC227', platform: 'AtCoder', date: '2026-08', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ARC227 (2026-08)');
  } else {
    console.log('📋 已有比赛: AtCoder ARC227');
  }

  const arc227Result = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['马天成'], contestId: arc227.id },
  });
  if (!arc227Result) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['马天成'],
        contestId: arc227.id,
        score: 1600,
        rank: 308,
        atcoderRank: 6517,
        atcoderRating: 1440,
        notes: '账号: Tiancheng',
      },
    });
    console.log('✅ 马天成: ARC227 1600/3800, 排名308, Rank 6517, Rating 1440');
  } else {
    console.log('📋 马天成已有 ARC227 成绩');
  }
}

async function main() {
  console.log('========================================');
  console.log('  更新任务板 + 比赛成绩（2026-08-17）');
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
