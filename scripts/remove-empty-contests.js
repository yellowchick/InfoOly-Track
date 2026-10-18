// 删除没有任何学生成绩关联的比赛记录（空比赛）
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const emptyContests = await prisma.contest.findMany({
    where: { results: { none: {} } },
    select: { id: true, name: true, date: true },
    orderBy: { date: 'asc' },
  });

  console.log(`找到 ${emptyContests.length} 场无成绩比赛:`);
  for (const c of emptyContests) {
    console.log(`  - ${c.name} (${c.date})`);
  }

  if (emptyContests.length === 0) {
    console.log('没有需要删除的记录');
    await prisma.$disconnect();
    return;
  }

  // 安全确认：全部是 AtCoder ABC 比赛才批量删，其他平台列出来提示
  const nonABC = emptyContests.filter(c => !c.name.startsWith('AtCoder ABC'));
  if (nonABC.length > 0) {
    console.log('\n⚠️ 以下非ABC比赛也无数值，请确认是否删除:');
    nonABC.forEach(c => console.log(`  - ${c.name} (${c.date})`));
  }

  const toDelete = emptyContests.filter(c => c.name.startsWith('AtCoder ABC'));
  for (const c of toDelete) {
    await prisma.contest.delete({ where: { id: c.id } });
  }
  console.log(`\n✅ 已删除 ${toDelete.length} 场空ABC比赛`);

  const remaining = await prisma.contest.count();
  console.log(`数据库现存比赛总数: ${remaining}`);
  await prisma.$disconnect();
}
main();
