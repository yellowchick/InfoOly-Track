const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const allContests = await prisma.contest.findMany({
    include: { results: { include: { student: true } } },
    orderBy: { date: "asc" }
  });
  const gespContests = allContests.filter(c => c.name.toLowerCase().includes("gesp"));
  console.log("=== GESP CONTESTS ===");
  for (const c of gespContests) {
    console.log(c.id, "|", c.name, "|", c.date, "|", c.platform, "| results:", c.results.length);
    for (const r of c.results) {
      console.log("  ->", r.student.name, "| award:", r.award, "| score:", r.score, "| rank:", r.rank);
    }
  }
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
