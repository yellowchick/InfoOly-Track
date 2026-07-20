const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
};

async function main() {
  console.log('=== 更新AtCoder ABC467 + 资讯 ===\n');

  // 1. 创建 AtCoder ABC467 比赛
  let abc467 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC467', platform: 'AtCoder', date: '2026-07' },
  });

  if (!abc467) {
    abc467 = await prisma.contest.create({
      data: {
        name: 'AtCoder ABC467',
        platform: 'AtCoder',
        date: '2026-07',
        type: 'online',
      },
    });
    console.log('✅ 创建比赛: AtCoder ABC467');
  } else {
    console.log('📋 已有比赛: AtCoder ABC467');
  }

  // 2. 添加党皓天成绩
  const existing = await prisma.studentContestResult.findFirst({
    where: {
      studentId: STUDENTS['党皓天'],
      contestId: abc467.id,
    },
  });

  if (!existing) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['党皓天'],
        contestId: abc467.id,
        score: 1025,
        rank: 1116,
        atcoderRank: 37436,
        atcoderRating: 413,
        notes: '账号: solitaire，首次开启rated模式',
      },
    });
    console.log('✅ 党皓天: AtCoder ABC467 得分 1025/2600, 排名 1116, Rank 37436, Rating 413');
  } else {
    console.log('📋 党皓天已有 AtCoder ABC467 成绩');
  }

  // 3. 添加资讯
  const content = `## AtCoder 比赛动态

- **党皓天**：开启 rated 模式打比赛，总算出 Rating 分了！
  - ABC467 首次 rated 参赛，获得 **Rating 413**

- **马天成**：因同一邮箱注册两个账号，ABC467 时切错账号打比赛，被判定违规
  - 原账号被删除，原账号 Rating 积分 **1254 清零**
  - 积分重置，从头开始`;

  const ann = await prisma.announcement.create({
    data: {
      title: 'AtCoder 比赛动态 - 7月',
      content: content,
      category: 'contest',
      date: '2026-07',
      isPublic: true,
    },
  });

  console.log('✅ 资讯创建成功:', ann.id);
  console.log('标题:', ann.title);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
