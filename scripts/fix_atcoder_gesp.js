const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== 1. 更新党皓天 AtCoder ABC465 记录 ===");
  
  // 查找党皓天 ABC465 记录
  const dangHaotian = await prisma.student.findFirst({
    where: { name: "党皓天" }
  });
  
  const abc465 = await prisma.contest.findFirst({
    where: { name: "AtCoder ABC465" }
  });
  
  if (dangHaotian && abc465) {
    const result = await prisma.studentContestResult.findFirst({
      where: { studentId: dangHaotian.id, contestId: abc465.id }
    });
    
    if (result) {
      await prisma.studentContestResult.update({
        where: { id: result.id },
        data: {
          score: 1000,
          rank: 3086,
          notes: "账号：solitaire，总分2600，未开启Rank排名"
        }
      });
      console.log("  Updated: 党皓天 ABC465 - score: 1000, rank: 3086, notes updated");
    } else {
      console.log("  Record not found");
    }
  }
  
  console.log("\n=== 2. 将 GESP 比赛平台改为 CCF ===");
  
  const gespContests = await prisma.contest.findMany({
    where: { name: { startsWith: "GESP" } }
  });
  
  for (const c of gespContests) {
    await prisma.contest.update({
      where: { id: c.id },
      data: { platform: "CCF" }
    });
    console.log("  Updated:", c.name, "platform: GESP -> CCF");
  }
  
  console.log("\n=== 验证结果 ===");
  
  // 验证 AtCoder
  const verifyAtcoder = await prisma.studentContestResult.findFirst({
    where: { studentId: dangHaotian?.id },
    include: { contest: true },
    orderBy: { createdAt: "desc" }
  });
  if (verifyAtcoder) {
    console.log("AtCoder:", verifyAtcoder.contest.name, "score:", verifyAtcoder.score, "rank:", verifyAtcoder.rank);
  }
  
  // 验证 GESP
  const verifyGesp = await prisma.contest.findMany({
    where: { name: { startsWith: "GESP" } }
  });
  verifyGesp.forEach(c => console.log("GESP:", c.name, "platform:", c.platform));
  
  await prisma.$disconnect();
  console.log("\nDone");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
