const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 所有学生 ===');
  const students = await prisma.student.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  });
  console.log(JSON.stringify(students, null, 2));

  console.log('\n=== AtCoder ABC47x 比赛 ===');
  const contests = await prisma.contest.findMany({
    where: { name: { contains: 'ABC47' } },
    select: { id: true, name: true, platform: true, date: true, type: true, totalScore: true },
    orderBy: { name: 'asc' },
  });
  console.log(JSON.stringify(contests, null, 2));

  console.log('\n=== CSP 相关比赛 ===');
  const csp = await prisma.contest.findMany({
    where: { name: { contains: 'CSP' } },
    select: { id: true, name: true, platform: true, date: true, type: true, totalScore: true },
    orderBy: { date: 'desc' },
    take: 15,
  });
  console.log(JSON.stringify(csp, null, 2));

  console.log('\n=== CSP 初赛成绩样本（看小数分数怎么处理）===');
  const cspResults = await prisma.studentContestResult.findMany({
    where: { contest: { name: { contains: '初赛' } } },
    include: { student: { select: { name: true } }, contest: { select: { name: true, date: true } } },
    orderBy: { contest: { date: 'desc' } },
    take: 20,
  });
  console.log(JSON.stringify(cspResults, null, 2));

  await prisma.$disconnect();
}
main();
