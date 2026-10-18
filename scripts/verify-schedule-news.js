const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 验证：当前生效的训练安排（isActive=true）===');
  const active = await prisma.schedule.findMany({
    where: { isActive: true },
    orderBy: { day: 'asc' },
  });
  console.log(JSON.stringify(active, null, 2));

  console.log('\n=== 验证：已归档安排数量 ===');
  const archived = await prisma.schedule.count({ where: { isActive: false } });
  console.log(`已归档: ${archived} 条`);

  console.log('\n=== 验证：最新资讯（前2条）===');
  const news = await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 2,
    select: { title: true, category: true, date: true, createdAt: true },
  });
  console.log(JSON.stringify(news, null, 2));

  await prisma.$disconnect();
}
main();
