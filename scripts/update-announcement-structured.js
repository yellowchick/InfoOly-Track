const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== 更新家校专栏为结构化数据 ===");

  // 删除旧的
  const old = await prisma.announcement.findFirst({
    where: { title: "2026年6月~7月家校专栏" }
  });
  if (old) {
    await prisma.announcement.delete({ where: { id: old.id } });
    console.log("Deleted old");
  }

  // 结构化内容
  const structuredContent = JSON.stringify({
    summary: "本月四位学生各有特点：马天成课外自主学习活跃但课内状态一般；党皓天训练完成度高但对AI依赖较重；张赫桐课内最踏实但进步缓慢；陆臻单位时间效率最高但双修分散精力。",
    students: [
      {
        name: "马天成",
        tags: ["自主学习活跃", "训练量大", "课内一般"],
        comment: "课外自主学习活跃，线上赛和训练量较大。课内状态一般。定完目标以后应该自己有计划，计划实施能否到位很关键。"
      },
      {
        name: "党皓天",
        tags: ["训练完成度高", "AI依赖重", "比赛表现还行"],
        comment: "混沌。认真又不认真。训练完成度是挺高的，课外也有自主训练，比赛表现上来说也还行。总感觉是四个小伙子里对AI依赖最重的一位。抛开算法学习的话，很欣赏接触新事物的态度。考虑算法学习的话，除了封闭比赛就很难为水平下定义了。"
      },
      {
        name: "张赫桐",
        tags: ["课内踏实", "课外无付出", "进步缓慢"],
        comment: "课内的状态最踏实，课外默认无付出。进步是明显的，但是依然缓慢。"
      },
      {
        name: "陆臻",
        tags: ["效率最高", "双修", "带点运气"],
        comment: "单位时间学习效率最高之人，毫无疑问，但是双修。课内状态很好，课外默认无付出。身上是带点运气的，从实战表现来看，相比较于付出的精力应该是很好了。"
      }
    ]
  }, null, 2);

  const newAnnouncement = await prisma.announcement.create({
    data: {
      title: "2026年6月~7月家校专栏",
      content: structuredContent,
      category: "home-school",
      date: "2026-07",
      isPublic: true,
    }
  });

  console.log("Created:", newAnnouncement.id);
  
  // 验证
  const verify = await prisma.announcement.findUnique({
    where: { id: newAnnouncement.id }
  });
  const parsed = JSON.parse(verify.content);
  console.log("\nSummary:", parsed.summary.slice(0, 50) + "...");
  console.log("Students:", parsed.students.length);
  parsed.students.forEach(s => console.log("  -", s.name, s.tags));

  await prisma.$disconnect();
  console.log("\nDone");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
