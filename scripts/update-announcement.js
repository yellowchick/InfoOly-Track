const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("=== 更新家校专栏 ===");

  const content = `2026年6月~7月家校专栏

马天成
- 课外自主学习活跃，线上赛和训练量较大
- 课内状态一般
- 定完目标以后应该自己有计划，计划实施能否到位很关键

党皓天
- 混沌
- 认真又不认真
- 训练完成度是挺高的，课外也有自主训练，比赛表现上来说也还行
- 总感觉是四个小伙子里对AI依赖最重的一位
  - 抛开算法学习的话，很欣赏接触新事物的态度
  - 考虑算法学习的话，除了封闭比赛就很难为水平下定义了

张赫桐
- 课内的状态最踏实，课外默认无付出
- 进步是明显的，但是依然缓慢

陆臻
- 单位时间学习效率最高之人，毫无疑问，但是双修
- 课内状态很好，课外默认无付出
- 身上是带点运气的，从实战表现来看，相比较于付出的精力应该是很好了`;

  const newAnnouncement = await prisma.announcement.create({
    data: {
      title: '2026年6月~7月家校专栏',
      content: content,
      category: 'home-school',
      date: '2026-07',
      isPublic: true,
    }
  });

  console.log("✅ 已创建:", newAnnouncement.id, newAnnouncement.title);

  // 查询所有
  const all = await prisma.announcement.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log("\n=== 当前家校专栏 ===");
  all.forEach(a => console.log(a.date, "|", a.title));

  await prisma.$disconnect();
  console.log("\n✅ 更新完成");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
