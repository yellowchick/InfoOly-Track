const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 验证任务板更新 ===');
  const mtc = await prisma.task.findMany({
    where: { student: { name: '马天成' }, title: { contains: 'TR12' } },
    select: { title: true, status: true }
  });
  console.log('马天成 TR12 任务:', mtc);

  const dhtTasks = await prisma.task.findMany({
    where: { student: { name: '党皓天' }, title: { contains: 'TR14' } },
    select: { title: true, status: true }
  });
  console.log('党皓天 TR14 任务:', dhtTasks);

  console.log('\n=== 验证比赛成绩更新 ===');
  const dht = await prisma.studentContestResult.findFirst({
    where: { student: { name: '党皓天' }, contest: { name: 'AtCoder ABC473' } },
    select: { score: true, rank: true, atcoderRank: true, atcoderRating: true, notes: true }
  });
  console.log('党皓天 ABC473:', dht);

  await prisma.$disconnect();
}
main();
