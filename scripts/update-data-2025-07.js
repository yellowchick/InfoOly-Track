const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 学生ID映射
const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
  '梁芮棠': 'cmrg6e2rv0000107d2yiuvyir',
};

// 任务更新数据（来自更新.md）
const TASK_UPDATES = {
  '马天成': [
    { title: 'CSPSTR01', status: 'completed', category: 'CSP' },
    { title: 'CSPSTR16', status: 'completed', category: 'CSP' },
    { title: 'CSPSTR14', status: 'pending', category: 'CSP' },
    { title: '2560', status: 'completed', category: '练习' },
    { title: '2621', status: 'pending', category: '练习' },
    { title: '2622', status: 'pending', category: '练习' },
    { title: 'csps2024真题', status: 'pending', category: '真题' },
    { title: 'Dp特殊练习 CSPSTR29', status: 'pending', category: 'DP' },
    { title: '博弈论练习 CSPSTR20', status: 'pending', category: '博弈论' },
  ],
  '党皓天': [
    { title: 'CSPSTR01', status: 'completed', category: 'CSP' },
    { title: 'CSPSTR16', status: 'completed', category: 'CSP' },
    { title: 'CSPSTR14', status: 'pending', category: 'CSP' },
    { title: '2560', status: 'completed', category: '练习' },
    { title: '2621', status: 'pending', category: '练习' },
    { title: '2622', status: 'pending', category: '练习' },
    { title: 'csps2024真题', status: 'pending', category: '真题' },
    { title: 'Dp特殊练习 CSPSTR29', status: 'pending', category: 'DP' },
    { title: '博弈论练习 CSPSTR20', status: 'pending', category: '博弈论' },
  ],
  '张赫桐': [
    { title: 'CSPSTR01', status: 'pending', category: 'CSP' },
    { title: 'CSPSTR16', status: 'pending', category: 'CSP' },
    { title: '2560', status: 'pending', category: '练习' },
    { title: '2621', status: 'pending', category: '练习' },
    { title: '2622', status: 'pending', category: '练习' },
    { title: 'csps2024真题', status: 'pending', category: '真题' },
    { title: 'Dp特殊练习 CSPSTR29', status: 'pending', category: 'DP' },
    { title: '博弈论练习 CSPSTR20', status: 'pending', category: '博弈论' },
  ],
  '陆臻': [
    { title: 'csps2024真题', status: 'pending', category: '真题' },
    { title: 'Dp特殊练习 CSPSTR29', status: 'pending', category: 'DP' },
    { title: '博弈论练习 CSPSTR20', status: 'pending', category: '博弈论' },
  ],
  '梁芮棠': [
    { title: 'csps2024真题', status: 'pending', category: '真题' },
    { title: 'Dp特殊练习 CSPSTR29', status: 'pending', category: 'DP' },
    { title: '博弈论练习 CSPSTR20', status: 'pending', category: '博弈论' },
  ],
};

// 知识点数据
const KNOWLEDGE_POINTS = [
  { name: 'Nim石子游戏', level: 3, levelAlias: 'CSP-S', category: '博弈论', description: '博弈论基础：Nim游戏及其SG函数解法' },
  { name: '三分法', level: 3, levelAlias: 'CSP-S', category: '算法技巧', description: '单峰函数极值求解的三分搜索算法' },
  { name: '容斥原理', level: 3, levelAlias: 'CSP-S', category: '组合数学', description: '集合计数中的容斥原理及其应用' },
  { name: '矩阵快速幂', level: 4, levelAlias: 'NOIP', category: '数学', description: '利用矩阵快速幂加速线性递推计算' },
];

// 比赛成绩数据
const CONTEST_RESULTS = [
  {
    contest: { name: 'AtCoder ABC466', platform: 'AtCoder', date: '2026-07', type: 'online' },
    results: [
      { studentName: '马天成', score: 1450, totalScore: 2550, rank: 1580, atcoderRank: null, atcoderRating: null, notes: '账号: Tiancheng123' },
      { studentName: '党皓天', score: 1450, totalScore: 2600, rank: 3007, atcoderRank: null, atcoderRating: null, notes: '账号: solitaire' },
    ],
  },
  {
    contest: { name: 'AtCoder ARC224', platform: 'AtCoder', date: '2026-07', type: 'online' },
    results: [
      { studentName: '马天成', score: 2200, totalScore: 2900, rank: 381, atcoderRank: 9506, atcoderRating: 1254, notes: '账号: Tiancheng123, Rank: 15426->9506, Rating: 991->1254' },
    ],
  },
];

async function updateTasks() {
  console.log('\n=== 更新任务状态 ===\n');
  let created = 0;
  let updated = 0;

  for (const [studentName, tasks] of Object.entries(TASK_UPDATES)) {
    const studentId = STUDENTS[studentName];
    if (!studentId) {
      console.log(`❌ 未找到学生: ${studentName}`);
      continue;
    }

    for (const task of tasks) {
      // 查找现有任务
      const existing = await prisma.task.findFirst({
        where: {
          studentId: studentId,
          title: task.title,
        },
      });

      if (existing) {
        // 更新状态
        if (existing.status !== task.status) {
          await prisma.task.update({
            where: { id: existing.id },
            data: { status: task.status },
          });
          console.log(`🔄 ${studentName}: ${task.title} -> ${task.status}`);
          updated++;
        } else {
          console.log(`📋 ${studentName}: ${task.title} 已是 ${task.status}`);
        }
      } else {
        // 创建新任务
        await prisma.task.create({
          data: {
            studentId: studentId,
            title: task.title,
            category: task.category,
            status: task.status,
          },
        });
        console.log(`✅ ${studentName}: 创建 ${task.title} (${task.status})`);
        created++;
      }
    }
  }

  console.log(`\n任务更新完成: 创建 ${created} 个, 更新 ${updated} 个`);
}

async function updateKnowledgePoints() {
  console.log('\n=== 更新知识点 ===\n');
  let created = 0;

  for (const kp of KNOWLEDGE_POINTS) {
    const existing = await prisma.knowledgePoint.findFirst({
      where: { name: kp.name },
    });

    if (existing) {
      console.log(`📋 已有知识点: ${kp.name}`);
    } else {
      await prisma.knowledgePoint.create({
        data: kp,
      });
      console.log(`✅ 创建知识点: ${kp.name} (${kp.levelAlias})`);
      created++;
    }
  }

  console.log(`\n知识点更新完成: 创建 ${created} 个`);
}

async function updateContestResults() {
  console.log('\n=== 更新比赛成绩 ===\n');
  let createdContest = 0;
  let createdResult = 0;

  for (const cr of CONTEST_RESULTS) {
    // 查找或创建比赛
    let contest = await prisma.contest.findFirst({
      where: {
        name: cr.contest.name,
        platform: cr.contest.platform,
        date: cr.contest.date,
      },
    });

    if (!contest) {
      contest = await prisma.contest.create({
        data: cr.contest,
      });
      console.log(`✅ 创建比赛: ${cr.contest.name} (${cr.contest.platform}, ${cr.contest.date})`);
      createdContest++;
    } else {
      console.log(`📋 已有比赛: ${cr.contest.name} (${cr.contest.platform}, ${cr.contest.date})`);
    }

    // 添加成绩
    for (const result of cr.results) {
      const studentId = STUDENTS[result.studentName];
      if (!studentId) {
        console.log(`❌ 未找到学生: ${result.studentName}`);
        continue;
      }

      const existing = await prisma.studentContestResult.findFirst({
        where: {
          studentId: studentId,
          contestId: contest.id,
        },
      });

      if (existing) {
        console.log(`📋 ${result.studentName} 已有 ${cr.contest.name} 成绩`);
      } else {
        await prisma.studentContestResult.create({
          data: {
            studentId: studentId,
            contestId: contest.id,
            score: result.score,
            rank: result.rank,
            atcoderRank: result.atcoderRank,
            atcoderRating: result.atcoderRating,
            notes: result.notes,
          },
        });
        console.log(`✅ ${result.studentName}: ${cr.contest.name} 得分 ${result.score}/${result.totalScore}, 排名 ${result.rank}`);
        createdResult++;
      }
    }
  }

  console.log(`\n比赛成绩更新完成: 创建 ${createdContest} 个比赛, ${createdResult} 条成绩`);
}

async function main() {
  console.log('========================================');
  console.log('  InfoOly Track - 数据更新脚本');
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  await updateTasks();
  await updateKnowledgePoints();
  await updateContestResults();

  console.log('\n========================================');
  console.log('  所有更新完成！');
  console.log('========================================');

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
