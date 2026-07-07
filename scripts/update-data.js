const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// 统计信息
const stats = {
  contests: { created: 0, reused: 0 },
  results: { created: 0, updated: 0, skipped: 0 },
  tasks: { created: 0, updated: 0, skipped: 0, notFound: 0 },
  errors: []
};

function log(...args) {
  console.log(...args);
}

// ============ 解析器 ============
function parseUpdateMarkdown(content) {
  const lines = content.split('\n').map(l => l.replace(/\r$/, ''));
  const data = {
    gesp: [],
    atcoder: [],
    tasks: []
  };

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.match(/^- 线下赛gesp/)) {
      const match = line.match(/gesp(\d{2})(\d{2})([四五级]+)/);
      if (match) {
        const year = '20' + match[1];
        const month = match[2];
        const level = match[3];
        const contest = {
          date: `${year}-${month}`,
          level,
          students: []
        };
        i++;
        while (i < lines.length && lines[i].match(/^  - /)) {
          const s = lines[i].trim();
          const m = s.match(/^- ([\u4e00-\u9fa5]+) (\d+)分，(.+)$/);
          if (m) {
            contest.students.push({
              name: m[1],
              score: parseInt(m[2], 10),
              notes: m[3]
            });
          }
          i++;
        }
        data.gesp.push(contest);
      } else {
        i++;
      }
    } else if (line.match(/^- 线上赛AtCoder/)) {
      const match = line.match(/AtCoder ([^(]+)（(\d{4}-\d{2})）/);
      if (match) {
        const contest = {
          name: 'AtCoder ' + match[1].trim(),
          date: match[2],
          students: []
        };
        i++;
        while (i < lines.length && lines[i].trim() === '') i++;
        if (i < lines.length && lines[i].match(/^  - /)) {
          const studentName = lines[i].trim().substring(2).trim();
          const student = { name: studentName, details: [] };
          i++;
          while (i < lines.length && lines[i].match(/^    - /)) {
            student.details.push(lines[i].trim().substring(2).trim());
            i++;
          }
          contest.students.push(student);
        }
        data.atcoder.push(contest);
      } else {
        i++;
      }
    } else if (line === '- 任务更新') {
      i++;
      while (i < lines.length) {
        while (i < lines.length && lines[i].trim() === '') i++;
        if (i >= lines.length || !lines[i].match(/^  - /)) break;
        const studentName = lines[i].trim().substring(2).trim();
        const studentTasks = { name: studentName, tasks: [] };
        i++;
        while (i < lines.length && lines[i].trim() === '') i++;
        while (i < lines.length && lines[i].match(/^    - \[/)) {
          const taskLine = lines[i].trim();
          const taskMatch = taskLine.match(/^- \[(x| )\] (.+)$/);
          if (taskMatch) {
            studentTasks.tasks.push({
              completed: taskMatch[1] === 'x',
              title: taskMatch[2].trim()
            });
          }
          i++;
          while (i < lines.length && lines[i].trim() === '') i++;
        }
        data.tasks.push(studentTasks);
      }
    } else {
      i++;
    }
  }

  return data;
}

// ============ 数据库操作 ============
async function processGESP(data, prisma) {
  log('\n=== 处理 GESP 比赛 ===');
  for (const contest of data.gesp) {
    const contestName = `GESP ${contest.level}`;
    const existingContest = await prisma.contest.findFirst({
      where: { name: contestName, date: contest.date }
    });

    let contestId;
    if (existingContest) {
      contestId = existingContest.id;
      log(`  [复用] 比赛: ${contestName} (${contest.date})`);
      stats.contests.reused++;
    } else {
      const created = await prisma.contest.create({
        data: {
          name: contestName,
          type: 'offline',
          platform: 'GESP',
          date: contest.date
        }
      });
      contestId = created.id;
      log(`  [创建] 比赛: ${contestName} (${contest.date})`);
      stats.contests.created++;
    }

    for (const studentData of contest.students) {
      const student = await prisma.student.findFirst({
        where: { name: studentData.name }
      });

      if (!student) {
        log(`  [跳过] 学生未找到: ${studentData.name}`);
        stats.results.skipped++;
        stats.errors.push(`学生未找到: ${studentData.name}`);
        continue;
      }

      const existingResult = await prisma.studentContestResult.findFirst({
        where: { studentId: student.id, contestId }
      });

      if (existingResult) {
        await prisma.studentContestResult.update({
          where: { id: existingResult.id },
          data: {
            score: studentData.score,
            award: contest.level,
            notes: studentData.notes
          }
        });
        log(`  [更新] 成绩: ${studentData.name} - ${studentData.score}分 (${contest.level})`);
        stats.results.updated++;
      } else {
        await prisma.studentContestResult.create({
          data: {
            studentId: student.id,
            contestId,
            score: studentData.score,
            award: contest.level,
            notes: studentData.notes
          }
        });
        log(`  [创建] 成绩: ${studentData.name} - ${studentData.score}分 (${contest.level})`);
        stats.results.created++;
      }
    }
  }
}

async function processAtCoder(data, prisma) {
  log('\n=== 处理 AtCoder 比赛 ===');
  for (const contest of data.atcoder) {
    const existingContest = await prisma.contest.findFirst({
      where: { name: contest.name, date: contest.date }
    });

    let contestId;
    if (existingContest) {
      contestId = existingContest.id;
      log(`  [复用] 比赛: ${contest.name} (${contest.date})`);
      stats.contests.reused++;
    } else {
      const created = await prisma.contest.create({
        data: {
          name: contest.name,
          type: 'online',
          platform: 'AtCoder',
          date: contest.date
        }
      });
      contestId = created.id;
      log(`  [创建] 比赛: ${contest.name} (${contest.date})`);
      stats.contests.created++;
    }

    for (const studentData of contest.students) {
      const student = await prisma.student.findFirst({
        where: { name: studentData.name }
      });

      if (!student) {
        log(`  [跳过] 学生未找到: ${studentData.name}`);
        stats.results.skipped++;
        stats.errors.push(`学生未找到: ${studentData.name}`);
        continue;
      }

      // 解析详情
      let account = '';
      let score = null;
      let rank = null;
      let totalScore = null;

      for (const detail of studentData.details) {
        if (detail.startsWith('账号：')) {
          account = detail.substring(3);
        } else if (detail.startsWith('得分：')) {
          const scoreMatch = detail.match(/得分：(\d+)\/(\d+)/);
          if (scoreMatch) {
            score = parseInt(scoreMatch[1], 10);
            totalScore = parseInt(scoreMatch[2], 10);
          }
          const rankMatch = detail.match(/排名：(\d+)/);
          if (rankMatch) {
            rank = parseInt(rankMatch[1], 10);
          }
        }
      }

      const notes = account && totalScore !== null
        ? `账号：${account}，总分${totalScore}`
        : '';

      const existingResult = await prisma.studentContestResult.findFirst({
        where: { studentId: student.id, contestId }
      });

      if (existingResult) {
        await prisma.studentContestResult.update({
          where: { id: existingResult.id },
          data: { score, rank, notes }
        });
        log(`  [更新] 成绩: ${studentData.name} - ${score}/${totalScore}，排名${rank}`);
        stats.results.updated++;
      } else {
        await prisma.studentContestResult.create({
          data: {
            studentId: student.id,
            contestId,
            score,
            rank,
            notes
          }
        });
        log(`  [创建] 成绩: ${studentData.name} - ${score}/${totalScore}，排名${rank}`);
        stats.results.created++;
      }
    }
  }
}

async function processTasks(data, prisma) {
  log('\n=== 处理任务更新 ===');
  for (const studentData of data.tasks) {
    const student = await prisma.student.findFirst({
      where: { name: studentData.name }
    });

    if (!student) {
      log(`  [跳过] 学生未找到: ${studentData.name}`);
      stats.tasks.skipped++;
      stats.errors.push(`学生未找到: ${studentData.name}`);
      continue;
    }

    for (const task of studentData.tasks) {
      if (!task.completed) {
        log(`  [忽略] 任务未勾选，保持原状态: ${studentData.name} - ${task.title}`);
        stats.tasks.skipped++;
        continue;
      }

      const existingTask = await prisma.task.findFirst({
        where: { title: task.title, studentId: student.id }
      });

      if (!existingTask) {
        // 任务不存在，创建新任务并标记为完成
        await prisma.task.create({
          data: {
            studentId: student.id,
            title: task.title,
            status: 'completed',
            completedAt: new Date(),
            priority: 'normal',
            category: 'CSP'
          }
        });
        log(`  [创建] 新任务并标记完成: ${studentData.name} - ${task.title}`);
        stats.tasks.created++;
        continue;
      }

      if (existingTask.status === 'completed') {
        log(`  [忽略] 任务已是完成状态: ${studentData.name} - ${task.title}`);
        stats.tasks.skipped++;
      } else {
        await prisma.task.update({
          where: { id: existingTask.id },
          data: {
            status: 'completed',
            completedAt: new Date()
          }
        });
        log(`  [更新] 任务完成: ${studentData.name} - ${task.title}`);
        stats.tasks.updated++;
      }
    }
  }
}

function printStats() {
  log('\n========================================');
  log('           更新总结');
  log('========================================');
  log(`比赛: 创建 ${stats.contests.created} 个, 复用 ${stats.contests.reused} 个`);
  log(`成绩: 创建 ${stats.results.created} 个, 更新 ${stats.results.updated} 个, 跳过 ${stats.results.skipped} 个`);
  log(`任务: 创建 ${stats.tasks.created} 个, 更新 ${stats.tasks.updated} 个, 跳过 ${stats.tasks.skipped} 个, 未找到 ${stats.tasks.notFound} 个`);
  if (stats.errors.length > 0) {
    log(`\n警告/错误 (${stats.errors.length}):`);
    stats.errors.forEach(e => log(`  - ${e}`));
  }
  log('========================================\n');
}

// ============ 主函数 ============
async function main() {
  const mdPath = process.argv[2] || path.join(process.cwd(), '更新.md');

  log(`读取文件: ${mdPath}`);
  if (!fs.existsSync(mdPath)) {
    console.error(`错误: 文件不存在: ${mdPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(mdPath, 'utf-8');
  const data = parseUpdateMarkdown(content);

  log('解析结果:');
  log(`  GESP 比赛: ${data.gesp.length} 场`);
  data.gesp.forEach(c => log(`    - ${c.level} (${c.date}): ${c.students.length} 人`));
  log(`  AtCoder 比赛: ${data.atcoder.length} 场`);
  data.atcoder.forEach(c => log(`    - ${c.name} (${c.date}): ${c.students.length} 人`));
  log(`  任务更新: ${data.tasks.length} 人`);
  data.tasks.forEach(t => {
    const completed = t.tasks.filter(tk => tk.completed).length;
    const unchecked = t.tasks.filter(tk => !tk.completed).length;
    log(`    - ${t.name}: ${completed} 个完成, ${unchecked} 个未勾选`);
  });

  const prisma = new PrismaClient();

  try {
    await processGESP(data, prisma);
    await processAtCoder(data, prisma);
    await processTasks(data, prisma);
    printStats();
  } catch (e) {
    console.error('执行出错:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    log('数据库连接已断开');
  }
}

main();
