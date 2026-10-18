const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function archiveAugustSchedules() {
  console.log('--- 归档 8 月训练安排 ---');
  const august = await prisma.schedule.findMany({
    where: { isActive: true },
  });
  for (const s of august) {
    await prisma.schedule.update({ where: { id: s.id }, data: { isActive: false } });
    console.log(`  📦 归档: ${s.day} ${s.startTime}~${s.endTime}`);
  }
  if (august.length === 0) console.log('  （无需要归档的8月安排）');
}

async function createOctoberSchedules() {
  console.log('\n--- 创建 10 月训练安排 ---');
  const october = [
    { day: '10.16', startTime: '18:30', endTime: '21:00' },
    { day: '10.23', startTime: '18:30', endTime: '21:00' },
    { day: '10.30', startTime: '18:30', endTime: '21:00' },
    { day: '10.18', startTime: '9:00', endTime: '12:00' },
    { day: '10.25', startTime: '9:00', endTime: '12:00' },
  ];
  for (const item of october) {
    const existing = await prisma.schedule.findFirst({
      where: { day: item.day, startTime: item.startTime, endTime: item.endTime },
    });
    if (existing) {
      if (!existing.isActive) {
        await prisma.schedule.update({ where: { id: existing.id }, data: { isActive: true } });
        console.log(`  ✅ 重新激活: ${item.day} ${item.startTime}~${item.endTime}`);
      } else {
        console.log(`  📋 已存在: ${item.day} ${item.startTime}~${item.endTime}`);
      }
    } else {
      await prisma.schedule.create({
        data: { ...item, isActive: true },
      });
      console.log(`  ✅ 新建: ${item.day} ${item.startTime}~${item.endTime}`);
    }
  }
}

async function createNews() {
  console.log('\n--- 发布最新资讯 ---');
  const title = '10月资讯：CSP初赛完结 & 成绩预期';
  const content = `### 资讯更新

- 考虑到学生们都是初三的状况，gesp报名自行决定
- csp初赛完结，四位同学皆过，csp复赛时间10.31
- 10月中旬对成绩预期
  - 张赫桐
    - csp-s 120+
    - csp-j 230+
  - 马天成
    - csp-s 250+
  - 党皓天
    - csp-s 250+
  - 陆臻
    - csp-s 180+`;

  const existing = await prisma.announcement.findFirst({ where: { title } });
  if (existing) {
    await prisma.announcement.update({
      where: { id: existing.id },
      data: { content, date: '2026-10', isPublic: true },
    });
    console.log(`  ✅ 资讯已更新: ${title}`);
  } else {
    await prisma.announcement.create({
      data: { title, content, category: 'summary', date: '2026-10', isPublic: true },
    });
    console.log(`  ✅ 资讯已发布: ${title}`);
  }
}

async function main() {
  console.log('========================================');
  console.log('  更新训练安排 + 资讯（2026-10-18）');
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  await archiveAugustSchedules();
  await createOctoberSchedules();
  await createNews();

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
