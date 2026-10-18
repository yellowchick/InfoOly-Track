const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({
    select: { id: true, name: true, displayName: true }
  });
  console.log('=== Students ===');
  students.forEach(s => console.log(s.name, '-', s.displayName));

  const contests = await prisma.contest.findMany({
    where: { name: { contains: 'CSP' } },
    select: { id: true, name: true, platform: true, date: true, type: true }
  });
  console.log('\n=== CSP Contests ===');
  contests.forEach(c => console.log(c.name, '|', c.platform, '|', c.date, '|', c.type));

  const noi = await prisma.contest.findMany({
    where: { name: { contains: 'NOI' } },
    select: { id: true, name: true, platform: true, date: true, type: true }
  });
  console.log('\n=== NOI Contests ===');
  noi.forEach(c => console.log(c.name, '|', c.platform, '|', c.date, '|', c.type));

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
