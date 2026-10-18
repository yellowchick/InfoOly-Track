const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 验证 2026-09 / 2026-10 新录入比赛 ===');
  const contests = await prisma.contest.findMany({
    where: {
      OR: [
        { name: { contains: 'ABC476' } },
        { name: { contains: 'ABC477' } },
        { name: { contains: 'ABC478' } },
        { name: { contains: 'ABC480' } },
        { name: { contains: 'CSP-S 初赛' } },
      ],
    },
    include: {
      results: {
        include: { student: { select: { name: true } } },
      },
    },
    orderBy: { date: 'asc' },
  });

  for (const c of contests) {
    console.log(`\n📅 ${c.name} (${c.date}) [${c.platform}]`);
    if (c.description) console.log(`   说明: ${c.description}`);
    for (const r of c.results) {
      const parts = [`${r.student.name}: ${r.score}分`];
      if (r.rank) parts.push(`排名${r.rank}`);
      if (r.atcoderRank) parts.push(`Rank ${r.atcoderRank}`);
      if (r.atcoderRating) parts.push(`Rating ${r.atcoderRating}`);
      console.log(`   - ${parts.join(', ')}${r.notes ? ' | ' + r.notes : ''}`);
    }
  }

  await prisma.$disconnect();
}
main();
