const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 验证 ABC475 成绩 ===');
  const results = await prisma.studentContestResult.findMany({
    where: { contest: { name: 'AtCoder ABC475' } },
    include: {
      student: { select: { name: true } },
      contest: { select: { name: true, date: true } },
    },
  });
  console.log(JSON.stringify(results, null, 2));
  await prisma.$disconnect();
}
main();
