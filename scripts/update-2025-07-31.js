const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STUDENTS = {
  '马天成': 'cmr8wlszx0000tz14pnghg54f',
  '党皓天': 'cmr8wlszy0001tz14etzwmr3q',
  '张赫桐': 'cmr8wlszz0003tz146gtmytqt',
  '陆臻': 'cmr8wlszy0002tz14dpx8ba80',
  '梁芮棠': 'cmrg6e2rv0000107d2yiuvyir',
};

async function updateTasks() {
  console.log('\n=== 1. 更新任务板 ===\n');

  // 1.1 党皓天: gesp01~05, gesp06~10 已完成
  const dangTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['党皓天'] },
  });
  for (const task of dangTasks) {
    if (task.title.includes('GESP01~05') || task.title.includes('GESP06~10')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 党皓天: ${task.title} -> completed`);
      } else {
        console.log(`📋 党皓天: ${task.title} 已是 completed`);
      }
    }
  }

  // 1.2 陆臻: CSPSTR29 已完成
  const luTasks = await prisma.task.findMany({
    where: { studentId: STUDENTS['陆臻'] },
  });
  for (const task of luTasks) {
    if (task.title.includes('CSPSTR29')) {
      if (task.status !== 'completed') {
        await prisma.task.update({ where: { id: task.id }, data: { status: 'completed' } });
        console.log(`✅ 陆臻: ${task.title} -> completed`);
      } else {
        console.log(`📋 陆臻: ${task.title} 已是 completed`);
      }
    }
  }

  // 1.3 所有学生增加: yacs 7月乙组, yacs 7月甲组, 网络流TR21
  const newTasks = [
    { title: 'yacs 7月乙组', category: 'YACS' },
    { title: 'yacs 7月甲组', category: 'YACS' },
    { title: '网络流(最大流)模板题 TR21', category: '图论' },
  ];

  for (const [name, id] of Object.entries(STUDENTS)) {
    for (const nt of newTasks) {
      const existing = await prisma.task.findFirst({
        where: { studentId: id, title: nt.title },
      });
      if (!existing) {
        await prisma.task.create({
          data: { studentId: id, title: nt.title, category: nt.category, status: 'pending' },
        });
        console.log(`✅ ${name}: 创建 ${nt.title}`);
      } else {
        console.log(`📋 ${name}: 已有 ${nt.title}`);
      }
    }
  }
}

async function updateContests() {
  console.log('\n=== 2. 更新比赛成绩 ===\n');

  // 创建 AtCoder ABC468
  let abc468 = await prisma.contest.findFirst({
    where: { name: 'AtCoder ABC468', platform: 'AtCoder', date: '2026-07' },
  });
  if (!abc468) {
    abc468 = await prisma.contest.create({
      data: { name: 'AtCoder ABC468', platform: 'AtCoder', date: '2026-07', type: 'online' },
    });
    console.log('✅ 创建比赛: AtCoder ABC468');
  } else {
    console.log('📋 已有比赛: AtCoder ABC468');
  }

  // 马天成成绩
  const mtcExisting = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['马天成'], contestId: abc468.id },
  });
  if (!mtcExisting) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['马天成'],
        contestId: abc468.id,
        score: 1450,
        rank: null,
        atcoderRank: 10775,
        atcoderRating: 1200,
        notes: '账号: Tiancheng，为了新账号重回原账号巅峰，使用AI完成了6、7题',
      },
    });
    console.log('✅ 马天成: AtCoder ABC468 1450/2500, Rank 10775, Rating 1200');
  } else {
    console.log('📋 马天成已有 AtCoder ABC468 成绩');
  }

  // 梁芮棠成绩
  const lrtExisting = await prisma.studentContestResult.findFirst({
    where: { studentId: STUDENTS['梁芮棠'], contestId: abc468.id },
  });
  if (!lrtExisting) {
    await prisma.studentContestResult.create({
      data: {
        studentId: STUDENTS['梁芮棠'],
        contestId: abc468.id,
        score: 300,
        rank: 8243,
        atcoderRank: 59022,
        atcoderRating: 130,
        notes: '账号: soft_sweet505',
      },
    });
    console.log('✅ 梁芮棠: AtCoder ABC468 300/2500, 排名 8243, Rank 59022, Rating 130');
  } else {
    console.log('📋 梁芮棠已有 AtCoder ABC468 成绩');
  }
}

async function updateAnnouncement() {
  console.log('\n=== 3. 更新资讯 ===\n');

  const content = `## 7月总结 & 8月计划

### 📢 报名提醒
- **CSP报名已开启**：https://cspsjtest.noi.cn/
- **GESP报名已开启**：https://gesp.ccf.org.cn/，下次比赛 9月12日
  - 陆臻可报5级，预期90+
  - 马天成、张赫桐可报6级，预期90+
  - 党皓天可报7级，预期70+

### 📊 7月刷题计划
- 7月刷题计划完成
- 陆臻因生病训练量较少

### 🎯 8月训练侧重
- **习惯养成**：每题分两个代码完成，小数据必写暴力，保底30分
- **陆臻 & 张赫桐**：知识点补足
- **陆臻 & 张赫桐**：无特殊情况必须参加比赛，每周六晚8:00~9:40，建议线下一起打
- **马天成**：除比赛和任务补全外，侧重陷阱题和偏门题研究
- **党皓天**：如回归，安排同马天成

### 🏆 CSP-S 预测（暴力打底120分）
- **马天成**：目标300，极小概率爆零。8-9月以维持手感、增加准确度为主
- **党皓天**：目标200~300，小概率爆零。头脑清晰时有隐藏实力
- **张赫桐**：目标120~190。训练量高但实战弱，8月前无法保证暴力准确度
- **陆臻**：目标120~250。波动大（训练少+实战少），但爆零概率最低`;

  const ann = await prisma.announcement.create({
    data: {
      title: '7月总结 & 8月计划',
      content: content,
      category: 'summary',
      date: '2026-07',
      isPublic: true,
    },
  });
  console.log('✅ 资讯创建成功:', ann.id);
}

async function updateSchedules() {
  console.log('\n=== 4. 更新训练安排 ===\n');

  // 4.1 将7月训练安排设为 inactive
  const julySchedules = await prisma.schedule.findMany({
    where: { day: { in: ['周三', '周五', '周日'] } },
  });
  for (const s of julySchedules) {
    if (s.isActive) {
      await prisma.schedule.update({ where: { id: s.id }, data: { isActive: false } });
      console.log(`✅ 归档: ${s.day} ${s.startTime}-${s.endTime}`);
    }
  }

  // 4.2 创建8月训练安排
  const augustSchedules = [
    { day: '8.1', startTime: '20:00', endTime: '21:40', note: '比赛日，建议线下一起打' },
    { day: '8.8', startTime: '20:00', endTime: '21:40', note: '比赛日，建议线下一起打' },
    { day: '8.15', startTime: '20:00', endTime: '21:40', note: '比赛日，建议线下一起打' },
    { day: '8.22', startTime: '20:00', endTime: '21:40', note: '比赛日，建议线下一起打' },
    { day: '8.29', startTime: '20:00', endTime: '21:40', note: '比赛日，建议线下一起打' },
    { day: '8.10', startTime: '13:00', endTime: '17:00', note: '最迟20:00撤退' },
    { day: '8.11', startTime: '13:00', endTime: '17:00', note: '最迟20:00撤退' },
    { day: '8.17', startTime: '13:00', endTime: '17:00', note: '最迟20:00撤退' },
    { day: '8.24', startTime: '13:00', endTime: '17:00', note: '最迟20:00撤退' },
    { day: '8.25', startTime: '13:00', endTime: '17:00', note: '最迟20:00撤退' },
  ];

  for (const s of augustSchedules) {
    const existing = await prisma.schedule.findFirst({
      where: { day: s.day, startTime: s.startTime },
    });
    if (!existing) {
      await prisma.schedule.create({
        data: { ...s, isActive: true },
      });
      console.log(`✅ 创建: ${s.day} ${s.startTime}-${s.endTime}`);
    } else {
      console.log(`📋 已有: ${s.day} ${s.startTime}-${s.endTime}`);
    }
  }
}

async function main() {
  console.log('========================================');
  console.log('  InfoOly Track - 综合数据更新');
  console.log('  ' + new Date().toISOString());
  console.log('========================================');

  await updateTasks();
  await updateContests();
  await updateAnnouncement();
  await updateSchedules();

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
