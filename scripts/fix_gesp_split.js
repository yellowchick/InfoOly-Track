const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1. 查找所有 GESP 比赛
  const allContests = await prisma.contest.findMany({
    include: { results: { include: { student: true } } },
    orderBy: { date: "asc" },
  });

  const gespContests = allContests.filter((c) =>
    c.name.toLowerCase().includes("gesp")
  );

  console.log("=== Found GESP contests:", gespContests.length, "===");

  for (const contest of gespContests) {
    console.log("\nProcessing contest:", contest.name, "|", contest.date);
    console.log("Results count:", contest.results.length);

    // 按 award 等级分组
    const byLevel = new Map();
    for (const r of contest.results) {
      const level = r.award || "未知";
      if (!byLevel.has(level)) byLevel.set(level, []);
      byLevel.get(level).push(r);
    }

    console.log("Levels found:", Array.from(byLevel.keys()));

    // 为每个等级创建新比赛
    for (const [level, results] of byLevel) {
      const newName = `GESP ${level}`;
      console.log(`  Creating: ${newName} (${results.length} results)`);

      // 检查是否已存在同名比赛
      const existing = await prisma.contest.findFirst({
        where: { name: newName, date: contest.date },
      });

      let newContestId;
      if (existing) {
        newContestId = existing.id;
        console.log(`    Already exists: ${newName} (id=${newContestId})`);
      } else {
        const newContest = await prisma.contest.create({
          data: {
            name: newName,
            date: contest.date,
            type: contest.type,
            platform: contest.platform,
            description: contest.description,
            totalScore: contest.totalScore,
            timeLimit: contest.timeLimit,
            isTeam: contest.isTeam,
          },
        });
        newContestId = newContest.id;
        console.log(`    Created: ${newName} (id=${newContestId})`);
      }

      // 更新成绩关联到新比赛
      for (const r of results) {
        const existingResult = await prisma.studentContestResult.findFirst({
          where: { studentId: r.studentId, contestId: newContestId },
        });

        if (existingResult) {
          console.log(`      SKIP: ${r.student.name} already has result in ${newName}`);
        } else {
          await prisma.studentContestResult.create({
            data: {
              studentId: r.studentId,
              contestId: newContestId,
              award: r.award,
              score: r.score,
              rank: r.rank,
              notes: r.notes,
            },
          });
          console.log(`      MOVED: ${r.student.name} -> ${newName}`);
        }

        // 删除旧关联
        await prisma.studentContestResult.delete({
          where: { id: r.id },
        });
      }
    }

    // 删除原始 GESP 比赛
    console.log(`  Deleting original contest: ${contest.name}`);
    await prisma.contest.delete({ where: { id: contest.id } });
  }

  console.log("\n=== GESP split complete ===");

  // 验证
  const verify = await prisma.contest.findMany({
    where: { name: { startsWith: "GESP" } },
    include: { results: { include: { student: true } } },
    orderBy: { date: "asc" },
  });
  console.log("\n=== After fix ===");
  for (const c of verify) {
    console.log(c.name, "|", c.date, "| results:", c.results.length);
    for (const r of c.results) {
      console.log("  ->", r.student.name, "| award:", r.award);
    }
  }

  await prisma.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
