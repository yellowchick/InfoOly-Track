const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 检查数据状态 ===\n');

  // 1. 检查训练安排
  const schedules = await prisma.schedule.findMany({ orderBy: { day: 'asc' } });
  console.log('=== 所有训练安排 ===');
  schedules.forEach(s => console.log(s.id.substring(0,8), s.day, s.startTime, s.endTime, 'isActive:', s.isActive));

  // 2. 检查最新资讯内容
  const ann = await prisma.announcement.findFirst({
    where: { title: '7月总结 & 8月计划' },
  });
  if (ann) {
    console.log('\n=== 最新资讯内容长度 ===');
    console.log('标题:', ann.title);
    console.log('内容长度:', ann.content.length);
    console.log('内容前200字符:', ann.content.substring(0, 200));
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
