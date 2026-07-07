const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. 先删除所有 GESP 比赛的成绩（外键约束）
  const allGespContests = await prisma.contest.findMany({
    where: { name: { startsWith: "GESP" } },
  });
  
  const gespIds = allGespContests.map(c => c.id);
  
  console.log("=== GESP contests to delete:", gespIds.length, "===");
  for (const c of allGespContests) {
    console.log("  -", c.id, c.name, c.date);
  }
  
  if (gespIds.length === 0) {
    console.log("No GESP contests found.");
    await prisma.$disconnect();
    return;
  }
  
  // 删除成绩
  const deletedResults = await prisma.studentContestResult.deleteMany({
    where: { contestId: { in: gespIds } },
  });
  console.log("Deleted contest results:", deletedResults.count);
  
  // 删除比赛
  const deletedContests = await prisma.contest.deleteMany({
    where: { id: { in: gespIds } },
  });
  console.log("Deleted contests:", deletedContests.count);
  
  console.log("\n=== GESP data cleared ===");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
