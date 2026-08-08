const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
};

async function main() {
  console.log('=== 更新比赛成绩（2026年8月8日） ===\n');

  // 1. AtCoder ABC468
  let abc468 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC468', date: '2026-07' },
  });

  if (!abc468) {
    abc468 = await prisma.contest.create({
      data: { name: 'AtCoder ABC468', platform: 'AtCoder', date: '2026-07', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC468');
  } else {
    console.log('📋 已有比赛: AtCoder ABC468');
  }

  // 1.1 马天成 - 更新已有成绩
  const mtcResult = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['马天成'], contestId: abc468.id },
  });
  if (mtcResult) {
    await prisma.studentContestResult.update({
      where: { id: mtcResult.id },
      data: {
        score: 1475,
        rank: 1184,
        atcoderRank: 8743,
        atcoderRating: 1297,
        notes: '账号: Tiancheng',
      },
    });
    console.log('🔄 马天成: 更新 AtCoder ABC468 为 1475/2550, 排名1184, Rank 8743, Rating 1297');
  } else {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['马天成'],
        contestId: abc468.id,
        score: 1475,
        rank: 1184,
        atcoderRank: 8743,
        atcoderRating: 1297,
        notes: '账号: Tiancheng',
      },
    });
    console.log('✅ 马天成: 创建 AtCoder ABC468 1475/2550, 排名1184, Rank 8743, Rating 1297');
  }

  // 1.2 党皓天 - 创建新成绩
  const dhtResult = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['党皓天'], contestId: abc468.id },
  });
  if (!dhtResult) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['党皓天'],
        contestId: abc468.id,
        score: 1475,
        rank: 1310,
        atcoderRank: 26812,
        atcoderRating: 667,
        notes: '账号: solitaire',
      },
    });
    console.log('✅ 党皓天: 创建 AtCoder ABC468 1475/2550, 排名1310, Rank 26812, Rating 667');
  } else {
    console.log('📋 党皓天: 已有 AtCoder ABC468 成绩');
  }

  // 1.3 张赫桐 - 更新已有成绩
  const zhtResult = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['张赫桐'], contestId: abc468.id },
  });
  if (zhtResult) {
    await prisma.studentContestResult.update({
      where: { id: zhtResult.id },
      data: {
        score: 300,
        rank: 9079,
        atcoderRank: null,
        atcoderRating: null,
        notes: '账号: solitaire，20:00以后才进入比赛，成绩不计入总排名',
      },
    });
    console.log('🔄 张赫桐: 更新 AtCoder ABC468 为 300/2550, 排名9079（不计入总排名）');
  } else {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['张赫桐'],
        contestId: abc468.id,
        score: 300,
        rank: 9079,
        notes: '账号: solitaire，20:00以后才进入比赛，成绩不计入总排名',
      },
    });
    console.log('✅ 张赫桐: 创建 AtCoder ABC468 300/2550, 排名9079（不计入总排名）');
  }

  // 2. YACS月赛7月乙组
  let yacs乙组 = await prisma.contest.findFirst({
    where: { name: 'YACS月赛乙组', platform: 'YACS', date: '2026-07' },
  });
  if (!yacs乙组) {
    yacs乙组 = await prisma.contest.create({
      data: { name: 'YACS月赛乙组', platform: 'YACS', date: '2026-07', type: 'online', description: '乙组总分400', totalScore: 400 },
    });
    console.log('✅ 创建比赛: YACS月赛7月乙组');
  } else {
    console.log('📋 已有比赛: YACS月赛7月乙组');
  }

  const 乙组成绩 = [
    { name: '马天成', score: 310 },
    { name: '党皓天', score: 200 },
    { name: '陆臻', score: 170 },
    { name: '张赫桐', score: 135 },
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
          notes: 'YACS月赛7月乙组',
        },
      });
      console.log(`✅ ${r.name}: YACS月赛7月乙组 ${r.score}/400`);
    } else {
      console.log(`📋 ${r.name}已有 YACS月赛7月乙组成绩`);
    }
  }

  // 3. YACS月赛7月甲组
  let yacs甲组 = await prisma.contest.findFirst({
    where: { name: 'YACS月赛甲组', platform: 'YACS', date: '2026-07' },
  });
  if (!yacs甲组) {
    yacs甲组 = await prisma.contest.create({
      data: { name: 'YACS月赛甲组', platform: 'YACS', date: '2026-07', type: 'online', description: '甲组总分300', totalScore: 300 },
    });
    console.log('✅ 创建比赛: YACS月赛7月甲组');
  } else {
    console.log('📋 已有比赛: YACS月赛7月甲组');
  }

  const 甲组成绩 = [
    { name: '马天成', score: 165 },
    { name: '党皓天', score: 230 },
    { name: '陆臻', score: 100 },
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
          notes: 'YACS月赛7月甲组',
        },
      });
      console.log(`✅ ${r.name}: YACS月赛7月甲组 ${r.score}/300`);
    } else {
      console.log(`📋 ${r.name}已有 YACS月赛7月甲组成绩`);
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
