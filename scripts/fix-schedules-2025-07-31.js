const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 修复训练安排 ===\n');

  // 将所有7月的训练安排设为 inactive
  const julySchedules = await prisma.schedule.findMany({
    where: { day: { startsWith: '7.' } },
  });

  for (const s of julySchedules) {
    if (s.isActive) {
      await prisma.schedule.update({
        where: { id: s.id },
        data: { isActive: false },
      });
      console.log(`✅ 归档: ${s.day} ${s.startTime}-${s.endTime}`);
    } else {
      console.log(`📋 已归档: ${s.day} ${s.startTime}-${s.endTime}`);
    }
  }

  // 确认8月的安排都是 active
  const augustSchedules = await prisma.schedule.findMany({
    where: { day: { startsWith: '8.' } },
  });

  for (const s of augustSchedules) {
    if (!s.isActive) {
      await prisma.schedule.update({
        where: { id: s.id },
        data: { isActive: true },
      });
      console.log(`✅ 激活: ${s.day} ${s.startTime}-${s.endTime}`);
    } else {
      console.log(`📋 已激活: ${s.day} ${s.startTime}-${s.endTime}`);
    }
  }

  console.log('\n=== 完成 ===');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
