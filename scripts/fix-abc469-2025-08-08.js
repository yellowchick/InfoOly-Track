const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
};

async function main() {
  console.log('=== 回滚 ABC468 + 创建 ABC469 ===\n');

  // 1. 回滚 ABC468
  console.log('--- 1. 回滚 ABC468 ---');
  const abc468 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC468', date: '2026-07' },
  });

  if (abc468) {
    // 1.1 马天成恢复为原始数据
    const mtcResult = await prisma.studentContestResult.findFirst({
      where: { studentId: STUDENTS['马天成'], contestId: abc468.id },
    });
    if (mtcResult) {
      await prisma.studentContestResult.update({
        where: { id: mtcResult.id },
        data: {
          score: 1450,
          rank: null,
          atcoderRank: 10775,
          atcoderRating: 1200,
          notes: '账号: Tiancheng，为了新账号重回原账号巅峰，使用AI完成了6、7题',
        },
      });
      console.log('🔄 马天成: ABC468 恢复为 1450, Rank 10775, Rating 1200');
    }

    // 1.2 删除党皓天 ABC468
    const dhtResult = await prisma.studentContestResult.findFirst({
      where: { studentId: STUDENTS['党皓天'], contestId: abc468.id },
    });
    if (dhtResult) {
      await prisma.studentContestResult.delete({ where: { id: dhtResult.id } });
      console.log('✅ 删除党皓天 ABC468 成绩');
    }

    // 1.3 删除张赫桐 ABC468（错误数据，梁芮棠已有此记录）
    const zhtResult = await prisma.studentContestResult.findFirst({
      where: { studentId: STUDENTS['张赫桐'], contestId: abc468.id },
    });
    if (zhtResult) {
      await prisma.studentContestResult.delete({ where: { id: zhtResult.id } });
      console.log('✅ 删除张赫桐 ABC468 成绩（错误数据）');
    }
  }

  // 2. 创建 ABC469（8月比赛）
  console.log('\n--- 2. 创建 ABC469 ---');
  let abc469 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC469', date: '2026-08' },
  });

  if (!abc469) {
    abc469 = await prisma.contest.create({
      data: { name: 'AtCoder ABC469', platform: 'AtCoder', date: '2026-08', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC469 (2026-08)');
  } else {
    console.log('📋 已有比赛: AtCoder ABC469');
  }

  // 2.1 马天成
  const mtc469 = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['马天成'], contestId: abc469.id },
  });
  if (!mtc469) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['马天成'],
        contestId: abc469.id,
        score: 1475,
        rank: 1184,
        atcoderRank: 8743,
        atcoderRating: 1297,
        notes: '账号: Tiancheng',
      },
    });
    console.log('✅ 马天成: ABC469 1475/2550, 排名1184, Rank 8743, Rating 1297');
  } else {
    console.log('📋 马天成已有 ABC469 成绩');
  }

  // 2.2 党皓天
  const dht469 = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['党皓天'], contestId: abc469.id },
  });
  if (!dht469) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['党皓天'],
        contestId: abc469.id,
        score: 1475,
        rank: 1310,
        atcoderRank: 26812,
        atcoderRating: 667,
        notes: '账号: solitaire',
      },
    });
    console.log('✅ 党皓天: ABC469 1475/2550, 排名1310, Rank 26812, Rating 667');
  } else {
    console.log('📋 党皓天已有 ABC469 成绩');
  }

  // 2.3 张赫桐
  const zht469 = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['张赫桐'], contestId: abc469.id },
  });
  if (!zht469) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['张赫桐'],
        contestId: abc469.id,
        score: 300,
        rank: 9079,
        atcoderRank: null,
        atcoderRating: null,
        notes: '账号: solitaire，20:00以后才进入比赛，成绩不计入总排名',
      },
    });
    console.log('✅ 张赫桐: ABC469 300/2550, 排名9079（不计入总排名）');
  } else {
    console.log('📋 张赫桐已有 ABC469 成绩');
  }

  // 3. YACS月赛7月（保持不变，已正确录入）
  console.log('\n--- 3. YACS月赛7月（保持不变）---');
  console.log('📋 YACS月赛7月乙组和甲组成绩保持当前状态');

  console.log('\n=== 完成 ===');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
