// 一次性清理：删除 ABC480 马天成 0 分记录（赛后练习误判）
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const contest = await prisma.contest.findFirst({ where: { name: 'AtCoder ABC480', date: '2026-10' } });
  if (!contest) { console.log('比赛不存在'); return; }
  const result = await prisma.studentContestResult.findFirst({
    where: { student: { name: '马天成' }, contestId: contest.id },
  });
  if (!result) { console.log('成绩记录不存在'); return; }
  await prisma.studentContestResult.delete({ where: { id: result.id } });
  console.log(`✅ 已删除: 马天成 ABC480 score=${result.score} 的误录记录`);
  await prisma.$disconnect();
}
main();
