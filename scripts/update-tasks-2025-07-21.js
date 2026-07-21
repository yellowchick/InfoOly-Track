const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 更新任务状态 ===\n');

  const updates = [
    // 张赫桐
    { student: '张赫桐', titleMatch: '贪心练习 NOIP01', newTitle: 'NOIP01' },
    { student: '张赫桐', titleMatch: 'yacs五月乙组' },
    { student: '张赫桐', titleMatch: '2560' },
    { student: '张赫桐', titleMatch: 'CSPSTR01' },
    // 马天成
    { student: '马天成', titleMatch: 'Dp特殊练习 CSPSTR29' },
  ];

  let updated = 0;
  let notFound = [];

  for (const u of updates) {
    const student = await prisma.student.findFirst({
      where: { name: u.student },
    });

    if (!student) {
      console.log(`❌ 未找到学生: ${u.student}`);
      continue;
    }

    const task = await prisma.task.findFirst({
      where: {
        studentId: student.id,
        title: { contains: u.titleMatch },
      },
    });

    if (!task) {
      notFound.push(`${u.student}: ${u.titleMatch}`);
      continue;
    }

    if (task.status === 'completed') {
      console.log(`📋 ${u.student}: ${task.title} 已是 completed`);
    } else {
      await prisma.task.update({
        where: { id: task.id },
        data: { status: 'completed' },
      });
      console.log(`✅ ${u.student}: ${task.title} -> completed`);
      updated++;
    }
  }

  console.log(`\n=== 完成 ===`);
  console.log(`更新: ${updated} 个任务`);

  if (notFound.length > 0) {
    console.log(`\n⚠️ 未找到的任务（数据库中不存在）:`);
    notFound.forEach(x => console.log(`  - ${x}`));
  }

  // 党皓天 GESP02/GESP03 说明
  console.log(`\n⚠️ 党皓天: GESP02 / GESP03`);
  console.log(`  数据库中 GESP 任务为分组形式：GESP01~05、GESP06~10、GESP11~13`);
  console.log(`  没有单独的 GESP02 / GESP03 任务条目，无法单独标记完成`);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
