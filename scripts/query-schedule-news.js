const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 现有训练安排（含已归档）===');
  const schedules = await prisma.schedule.findMany({
    orderBy: { day: 'asc' },
  });
  console.log(JSON.stringify(schedules, null, 2));

  console.log('\n=== 最近5条资讯 ===');
  const news = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, title: true, category: true, date: true, isPublic: true, createdAt: true, content: true },
  });
  console.log(JSON.stringify(news, null, 2));

  await prisma.$disconnect();
}
main();
