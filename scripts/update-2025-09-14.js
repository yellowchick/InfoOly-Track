const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
};

async function main() {
  console.log('========================================');
  console.log('  更新 AtCoder ABC475 成绩（2026-09-14）');
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  // 查找或创建比赛
  let abc475 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC475', date: '2026-09' },
  });
  if (!abc475) {
    abc475 = await prisma.contest.create({
      data: { name: 'AtCoder ABC475', platform: 'AtCoder', date: '2026-09', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC475 (2026-09)');
  } else {
    console.log('📋 已有比赛: AtCoder ABC475 (id: ' + abc475.id + ')');
  }

  // 马天成成绩
  const mtcExisting = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['马天成'], contestId: abc475.id },
  });
  if (!mtcExisting) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['马天成'],
        contestId: abc475.id,
        score: 1000,
        rank: 2441,
        atcoderRank: 6097,
        atcoderRating: 1474,
        notes: '账号: Tiancheng',
      },
    });
    console.log('✅ 马天成: ABC475 1000/2575, 排名2441, Rank 6097, Rating 1474');
  } else {
    await prisma.studentContestResult.update({
      where: { id: mtcExisting.id },
      data: { score: 1000, rank: 2441, atcoderRank: 6097, atcoderRating: 1474, notes: '账号: Tiancheng' },
    });
    console.log('✅ 马天成: ABC475 成绩已更新');
  }

  // 党皓天成绩
  const dhtExisting = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['党皓天'], contestId: abc475.id },
  });
  if (!dhtExisting) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['党皓天'],
        contestId: abc475.id,
        score: 1475,
        rank: 981,
        atcoderRank: 13078,
        atcoderRating: 1103,
        notes: '账号: solitaire',
      },
    });
    console.log('✅ 党皓天: ABC475 1475/2575, 排名981, Rank 13078, Rating 1103');
  } else {
    await prisma.studentContestResult.update({
      where: { id: dhtExisting.id },
      data: { score: 1475, rank: 981, atcoderRank: 13078, atcoderRating: 1103, notes: '账号: solitaire' },
    });
    console.log('✅ 党皓天: ABC475 成绩已更新');
  }

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
