const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 撤销 2025-08-08 比赛数据更新 ===\n');

  // 1. 删除党皓天 ABC468 成绩
  const dhtResult = await prisma.studentContestResult.findFirst({
    where: {
      student: { name: '党皓天' },
      contest: { name: 'AtCoder ABC468', date: '2026-07' },
    },
  });
  if (dhtResult) {
    await prisma.studentContestResult.delete({ where: { id: dhtResult.id } });
    console.log('✅ 删除党皓天 AtCoder ABC468 成绩');
  }

  // 2. 恢复张赫桐 ABC468 成绩为旧值（300/2500）
  const zhtResult = await prisma.studentContestResult.findFirst({
    where: {
      student: { name: '张赫桐' },
      contest: { name: 'AtCoder ABC468', date: '2026-07' },
    },
  });
  if (zhtResult) {
    await prisma.studentContestResult.update({
      where: { id: zhtResult.id },
      data: {
        score: 300,
        rank: 8243,
        atcoderRank: 59022,
        atcoderRating: 130,
        notes: '账号: soft_sweet505',
      },
    });
    console.log('✅ 恢复张赫桐 AtCoder ABC468 成绩为旧值');
  }

  // 3. 删除 YACS月赛7月乙组成绩
  const yacs乙组 = await prisma.contest.findFirst({
    where: { name: 'YACS月赛乙组', platform: 'YACS', date: '2026-07' },
  });
  if (yacs乙组) {
    const deleted乙组 = await prisma.studentContestResult.deleteMany({
      where: { contestId: yacs乙组.id },
    });
    console.log(`✅ 删除 YACS月赛7月乙组 ${deleted乙组.count} 条成绩`);
  }

  // 4. 删除 YACS月赛7月甲组成绩
  const yacs甲组 = await prisma.contest.findFirst({
    where: { name: 'YACS月赛甲组', platform: 'YACS', date: '2026-07' },
  });
  if (yacs甲组) {
    const deleted甲组 = await prisma.studentContestResult.deleteMany({
      where: { contestId: yacs甲组.id },
    });
    console.log(`✅ 删除 YACS月赛7月甲组 ${deleted甲组.count} 条成绩`);
  }

  // 5. 删除 YACS月赛7月比赛
  if (yacs乙组) {
    await prisma.contest.delete({ where: { id: yacs乙组.id } });
    console.log('✅ 删除 YACS月赛7月乙组比赛');
  }
  if (yacs甲组) {
    await prisma.contest.delete({ where: { id: yacs甲组.id } });
    console.log('✅ 删除 YACS月赛7月甲组比赛');
  }

  console.log('\n=== 撤销完成 ===');
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
