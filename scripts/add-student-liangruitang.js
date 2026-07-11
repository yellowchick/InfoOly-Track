const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 添加学生: 梁芮棠 ===\n');

  // 1. 创建学生
  const student = await prisma.student.create({
    data: {
      name: '梁芮棠',
      displayName: '梁芮棠',
      bio: '女生，信息学竞赛选手',
    },
  });
  console.log('✅ 学生创建成功:', student.id, student.name);

  // 2. 查找或创建所需比赛
  const requiredContests = [
    { name: 'CSP-J', platform: 'CCF', date: '2024-10', type: 'offline', description: '入门级认证' },
    { name: 'CSP-S', platform: 'CCF', date: '2024-10', type: 'offline', description: '提高级认证（复赛）' },
    { name: 'CSP-J', platform: 'CCF', date: '2025-10', type: 'offline', description: '入门级认证' },
    { name: 'CSP-S', platform: 'CCF', date: '2025-10', type: 'offline', description: '提高级认证' },
    { name: 'NOI女生赛', platform: 'CCF', date: '2025-03', type: 'offline', description: 'NOI女生赛' },
  ];

  const contestMap = {};

  for (const req of requiredContests) {
    // 查找现有比赛
    let contest = await prisma.contest.findFirst({
      where: {
        name: req.name,
        platform: req.platform,
        date: req.date,
      },
    });

    if (!contest) {
      // 创建新比赛
      contest = await prisma.contest.create({
        data: req,
      });
      console.log('✅ 创建比赛:', contest.name, contest.platform, contest.date, contest.id);
    } else {
      console.log('📋 已有比赛:', contest.name, contest.platform, contest.date, contest.id);
    }

    const key = `${req.name}-${req.date}`;
    contestMap[key] = contest.id;
  }

  // 3. 添加比赛成绩
  const results = [
    { contestKey: 'CSP-J-2024-10', award: '二等奖', notes: '2024年CCF CSP-J 二等奖' },
    { contestKey: 'CSP-S-2024-10', award: '二等奖', notes: '2024年CCF CSP-S复赛 二等奖' },
    { contestKey: 'CSP-J-2025-10', award: '二等奖', notes: '2025年CCF CSP-J 二等奖' },
    { contestKey: 'CSP-S-2025-10', award: '二等奖', notes: '2025年CCF CSP-S 二等奖' },
    { contestKey: 'NOI女生赛-2025-03', award: '三等奖', notes: '2025年NOI女生赛 三等奖' },
  ];

  for (const r of results) {
    const contestId = contestMap[r.contestKey];
    if (!contestId) {
      console.log('❌ 未找到比赛:', r.contestKey);
      continue;
    }

    // 检查是否已有成绩记录
    const existing = await prisma.studentContestResult.findFirst({
      where: {
        studentId: student.id,
        contestId: contestId,
      },
    });

    if (existing) {
      console.log('📋 已有成绩:', r.contestKey, r.award);
      continue;
    }

    await prisma.studentContestResult.create({
      data: {
        studentId: student.id,
        contestId: contestId,
        award: r.award,
        notes: r.notes,
      },
    });
    console.log('✅ 添加成绩:', r.contestKey, r.award);
  }

  console.log('\n=== 完成 ===');
  console.log('学生:', student.name, student.id);
  
  // 验证
  const verifyResults = await prisma.studentContestResult.findMany({
    where: { studentId: student.id },
    include: { contest: true },
  });
  console.log('\n生涯记录:');
  verifyResults.forEach(r => {
    console.log(`  ${r.contest.date} ${r.contest.name} (${r.contest.platform}) - ${r.award}`);
  });

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
