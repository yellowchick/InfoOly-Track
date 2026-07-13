const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 添加最新资讯: AtCoder介绍 ===\n');

  const content = `## 关于线上赛atcoder的介绍

AtCoder 是一个日本的在线编程竞赛平台，由 AtCoder Inc. 于 2012 年创立，总部位于日本，是目前全球最具影响力的竞技编程平台之一，尤其在亚太地区享有极高声誉。

因为使用的是排位制度，每个选手随着参加比赛获得分数，自己的排位分会上升，类似游戏中的天梯积分，刺激和促进互相之间的竞争

## 主要竞赛类型

| 竞赛类型                      | 简称 | 难度      | 说明                                      |
| ----------------------------- | ---- | --------- | ----------------------------------------- |
| **AtCoder Beginner Contest**  | ABC  | 入门~中等 | 面向初学者，通常 8 题，难度从 A 到 H 递增 |
| **AtCoder Regular Contest**   | ARC  | 中等~困难 | 面向有一定基础的选手                      |
| **AtCoder Grand Contest**     | AGC  | 困难~极难 | 面向顶尖选手，题目难度极高                |
| **AtCoder Heuristic Contest** | AHC  | 启发式    | 优化类问题，非传统算法竞赛                |

#### 评分系统

- **Rating 机制**：类似 Elo 系统，根据比赛表现动态调整
- 新用户需要参加至少一场 rated 比赛才会显示 rating
  - 党皓天参加完2场都没进入排名的原因：开赛之前进入能选择rated，而党皓天两次都是开赛以后才进入比赛，无法选择是否计入排位，所以不积分
  - 考虑到比赛开始前后10分钟网络服务器不稳定，建议开赛前至少半小时就报名，或者上周打完比赛就可以完成下周的报名

- 颜色段位：灰 → 棕 → 绿 → 水色 → 蓝 → 黄 → 橙 → 红

#### 赛制

- **标准赛制**：比赛期间提交，实时判题，有罚时（WA 一次 +5 分钟）
- 支持**虚拟参赛**（Virtual Contest），可以模拟历史比赛

#### 比赛难度

- **ABC 后期题目**（D~F）难度接近 CSP-S / NOIP 提高组
- **ARC 和 AGC** 的题目难度覆盖省选到国赛水平`;

  const announcement = await prisma.announcement.create({
    data: {
      title: '关于线上赛 AtCoder 的介绍',
      content: content,
      category: 'platform',
      date: '2026-07',
      isPublic: true,
    },
  });

  console.log('✅ 资讯创建成功:', announcement.id);
  console.log('标题:', announcement.title);
  console.log('日期:', announcement.date);
  console.log('分类:', announcement.category);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
