import { PrismaClient } from '@prisma/client'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { parseMarkdown } from '../lib/parser'

const prisma = new PrismaClient()

const EXAMPLE_MD = `# 战绩

## 2024/10 CSP-J 初赛
- 线下赛csp-j
- 马天成 二等奖

### 难度分级

- 3(csp-j)(gesp 5级、6级)
  - 排序算法
  - 二分查找
- 4(csp-s)(gesp 7级)
  - 动态规划
  - 图论基础

### 最新资讯
- 本周训练安排
  请同学们按时完成作业，准备下周的模拟赛。
- 注意事项
  请携带有效证件参加比赛。

### 现阶段时间安排
- 周一 14:00-16:00 训练
- 周三 14:00-16:00 训练
- 周六 09:00-12:00 模拟赛

### 知识点认证
- 张-赫-桐
  - 匈牙利算法 202603
- 马天成
  - 动态规划 202604

### 任务板
- [x] 完成 CSP-J 初赛准备
- [ ] 完成动态规划专项训练
- [ ] 准备图论知识点

## 赛制介绍
- CSP-J/S
  CSP-J（入门级）和 CSP-S（提高级）是面向中小学生的非专业级软件能力认证。
- USACO
  美国计算机奥林匹克竞赛，分为铜、银、金、铂金四个级别。
`

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const mdPath = join(process.cwd(), 'public', 'data', '难度分级.md')

  // 确保目录存在
  if (!existsSync(join(process.cwd(), 'public', 'data'))) {
    throw new Error('Directory public/data does not exist')
  }

  if (!existsSync(mdPath)) {
    console.log('Creating example markdown file at', mdPath)
    writeFileSync(mdPath, EXAMPLE_MD, 'utf-8')
  }

  const content = readFileSync(mdPath, 'utf-8')
  const data = parseMarkdown(content)

  console.log('Parsed data:')
  console.log('  Rules:', data.rules.length)
  console.log('  Contests:', data.contests.length)
  console.log('  KnowledgePoints:', data.knowledgePoints.length)
  console.log('  Announcements:', data.announcements.length)
  console.log('  Schedules:', data.schedules.length)
  console.log('  StudentKnowledges:', data.studentKnowledges.length)
  console.log('  Tasks:', data.tasks.length)

  if (dryRun) {
    console.log('Dry run mode, not writing to database.')
    console.log(JSON.stringify(data, null, 2))
    return
  }

  // 导入规则
  for (const rule of data.rules) {
    const existing = await prisma.rule.findFirst({ where: { name: rule.name } })
    if (!existing) {
      await prisma.rule.create({ data: rule })
      console.log('Created rule:', rule.name)
    }
  }

  // 导入比赛和成绩
  for (const { contest, results } of data.contests) {
    const existing = await prisma.contest.findFirst({ where: { name: contest.name, date: contest.date } })
    let contestId: string
    if (!existing) {
      const created = await prisma.contest.create({ data: contest })
      contestId = created.id
      console.log('Created contest:', contest.name)
    } else {
      contestId = existing.id
    }

    for (const result of results) {
      const student = await prisma.student.findFirst({ where: { name: result.studentName } })
      if (!student) {
        console.log('Student not found, skipping result:', result.studentName)
        continue
      }
      const existingResult = await prisma.studentContestResult.findFirst({
        where: { studentId: student.id, contestId },
      })
      if (!existingResult) {
        await prisma.studentContestResult.create({
          data: { ...result, studentId: student.id, contestId },
        })
        console.log('Created result for:', result.studentName)
      }
    }
  }

  // 导入知识点
  for (const kp of data.knowledgePoints) {
    const existing = await prisma.knowledgePoint.findFirst({ where: { name: kp.name } })
    if (!existing) {
      await prisma.knowledgePoint.create({ data: kp })
      console.log('Created knowledge point:', kp.name)
    }
  }

  // 导入公告
  for (const ann of data.announcements) {
    const existing = await prisma.announcement.findFirst({ where: { title: ann.title } })
    if (!existing) {
      await prisma.announcement.create({ data: ann })
      console.log('Created announcement:', ann.title)
    }
  }

  // 导入时间安排
  for (const schedule of data.schedules) {
    const existing = await prisma.schedule.findFirst({
      where: { day: schedule.day, startTime: schedule.startTime, endTime: schedule.endTime },
    })
    if (!existing) {
      await prisma.schedule.create({ data: schedule })
      console.log('Created schedule:', schedule.day, schedule.startTime)
    }
  }

  // 导入知识点认证
  for (const sk of data.studentKnowledges) {
    const student = await prisma.student.findFirst({ where: { name: sk.studentName } })
    if (!student) {
      console.log('Student not found, skipping knowledge:', sk.studentName)
      continue
    }
    for (const item of sk.items) {
      const kp = await prisma.knowledgePoint.findFirst({ where: { name: item.name } })
      if (!kp) {
        console.log('Knowledge point not found, skipping:', item.name)
        continue
      }
      const existing = await prisma.studentKnowledge.findFirst({
        where: { studentId: student.id, knowledgePointId: kp.id },
      })
      if (!existing) {
        await prisma.studentKnowledge.create({
          data: {
            studentId: student.id,
            knowledgePointId: kp.id,
            certifiedAt: item.certifiedAt,
          },
        })
        console.log('Created student knowledge:', sk.studentName, item.name)
      }
    }
  }

  // 导入任务
  for (const task of data.tasks) {
    // 由于没有学生关联，默认关联第一个学生
    const firstStudent = await prisma.student.findFirst()
    if (!firstStudent) {
      console.log('No students found, skipping task:', task.title)
      continue
    }
    const existing = await prisma.task.findFirst({ where: { title: task.title, studentId: firstStudent.id } })
    if (!existing) {
      await prisma.task.create({
        data: { ...task, studentId: firstStudent.id },
      })
      console.log('Created task:', task.title)
    }
  }

  console.log('Import complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
