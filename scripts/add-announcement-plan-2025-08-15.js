const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 添加最新资讯：学习计划 ===\n');

  const content = `## 学习计划（8月中）

### 陆臻、张赫桐 自觉性计划

- 花费1小时：《最大边最小》
- 花费1小时：《离线问询》，顺带复习莫队（也是离线问询下的算法）
- 花费2小时：《DP优化》注意有两节，顺带复习一下背包相关知识
- 花费2小时：《最短路计数+次短路》，顺带巩固一下Floyd和Dijkstra和堆优化
- 花费1小时：《拆点》
- 花费2小时：《区间贪心》注意有两节
- 花费1小时：《字符串hash》
- 花费1小时：复习《单调队列》，该背就背，别每次都比赛的时候推导
- 花费1小时：复习《MST》，该背就背，别每次都比赛的时候推导
- 花费1小时：复习《并查集》，该背就背，别每次都比赛的时候推导

### 怕你会但是记不住的内容

- map的用法
- set的用法
- 并查集的root unite
- 邻接表相关vector
- 树状数组 lowbit
- 蒙板状压操作 关联单词mask
- 分块相关 block
- 优先队列 priority_queue
- 逆元推导

### 党皓天、马天成 计划

- 打比赛，疯狂打比赛
- 没有焦虑的，淡定（but`;

  const ann = await prisma.announcement.create({
    data: {
      title: '学习计划（8月中）',
      content: content,
      category: 'plan',
      date: '2026-08',
      isPublic: true,
    },
  });

  console.log('✅ 资讯创建成功:', ann.id);
  console.log('标题:', ann.title);
  console.log('内容长度:', ann.content.length);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
