const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 学生ID映射
const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
  '梁芮棠': 'cmrg6e2rv0000107d2yiuvyir',
};

async function main() {
  console.log('=== 更新7月比赛成绩 ===\n');

  // 1. AtCoder ABC466 - 梁芮棠
  const abc466 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC466', date: '2026-07' },
  });

  if (abc466) {
    const existing = await prisma.studentContestResult.findFirst({
      where: { studentId: STUDENTS['梁芮棠'], contestId: abc466.id },
    });

    if (!existing) {
      await prisma.studentContestResult.create({
        data: {
          studentId: STUDENTS['梁芮棠'],
          contestId: abc466.id,
          score: 100,
          rank: 10488,
          atcoderRank: 62416,
          atcoderRating: 107,
          notes: '账号: soft_sweet505',
        },
      });
      console.log('✅ 梁芮棠: AtCoder ABC466 得分 100/2550, 排名 10488, Rank 62416, Rating 107');
    } else {
      console.log('📋 梁芮棠已有 AtCoder ABC466 成绩');
    }
  }

  // 2. YACS月赛6月乙组
  const yacs乙组 = await prisma.contest.findFirst({
    where: { name: 'YACS月赛乙组', date: '2026-06' },
  });

  if (yacs乙组) {
    const 乙组成绩 = [
      { name: '马天成', score: 295 },
      { name: '党皓天', score: 200 },
      { name: '陆臻', score: 300 },
      { name: '张赫桐', score: 195 },
    ];

    for (const r of 乙组成绩) {
      const existing = await prisma.studentContestResult.findFirst({
        where: { studentId: STUDENTS[r.name], contestId: yacs乙组.id },
      });

      if (!existing) {
        await prisma.studentContestResult.create({
          data: {
            studentId: STUDENTS[r.name],
            contestId: yacs乙组.id,
            score: r.score,
            notes: 'YACS月赛6月乙组',
          },
        });
        console.log(`✅ ${r.name}: YACS月赛乙组 ${r.score}/400`);
      } else {
        console.log(`📋 ${r.name}已有 YACS月赛乙组成绩`);
      }
    }
  }

  // 3. YACS月赛6月甲组
  const yacs甲组 = await prisma.contest.findFirst({
    where: { name: 'YACS月赛甲组', date: '2026-06' },
  });

  if (yacs甲组) {
    const 甲组成绩 = [
      { name: '马天成', score: 110 },
      { name: '党皓天', score: 120 },
      { name: '陆臻', score: 125 },
    ];

    for (const r of 甲组成绩) {
      const existing = await prisma.studentContestResult.findFirst({
        where: { studentId: STUDENTS[r.name], contestId: yacs甲组.id },
      });

      if (!existing) {
        await prisma.studentContestResult.create({
          data: {
            studentId: STUDENTS[r.name],
            contestId: yacs甲组.id,
            score: r.score,
            notes: 'YACS月赛6月甲组',
          },
        });
        console.log(`✅ ${r.name}: YACS月赛甲组 ${r.score}/300`);
      } else {
        console.log(`📋 ${r.name}已有 YACS月赛甲组成绩`);
      }
    }
  }

  console.log('\n=== 完成 ===');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
