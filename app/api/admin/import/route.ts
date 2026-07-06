import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { parseMarkdown } from '@/lib/parser'

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const confirm = formData.get('confirm') === 'true'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!file.name.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only Markdown files are supported' },
        { status: 400 }
      )
    }

    const text = await file.text()

    // 解析 Markdown
    const parsed = parseMarkdown(text)

    // 预览模式：返回解析结果供确认
    if (!confirm) {
      const preview = {
        fileName: file.name,
        lineCount: text.split('\n').length,
        headings: text.split('\n').filter((l) => l.startsWith('#')).map((l) => l.trim()),
        students: parsed.students.map((s) => s.name),
        contests: parsed.contests.map((c) => c.contest.name),
        knowledge: parsed.knowledgePoints.map((k) => k.name),
        tasks: parsed.tasks.map((t) => t.title),
      }
      return NextResponse.json({ preview, rawText: text })
    }

    // 确认导入模式：写入数据库
    const result = {
      students: 0,
      contests: 0,
      knowledgePoints: 0,
      tasks: 0,
      contestResults: 0,
      errors: [] as string[],
    }

    // 统一的日期默认值（确保新比赛创建和查找时 key 一致）
    const now = new Date()
    const defaultDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    await prisma.$transaction(async (tx) => {
      // 1. 导入学生
      const studentNameToId = new Map<string, string>()
      const existingStudents = await tx.student.findMany({ select: { id: true, name: true } })
      for (const s of existingStudents) studentNameToId.set(s.name, s.id)

      for (const student of parsed.students) {
        if (studentNameToId.has(student.name)) continue
        try {
          const created = await tx.student.create({
            data: {
              name: student.name,
              displayName: student.displayName || student.name,
            },
          })
          studentNameToId.set(student.name, created.id)
          result.students++
        } catch (e) {
          result.errors.push(`创建学生 "${student.name}" 失败`)
        }
      }

      // 2. 导入比赛（确保日期始终有值，防止 key 不匹配）
      const contestNameToId = new Map<string, string>()
      const existingContests = await tx.contest.findMany({ select: { id: true, name: true, date: true } })
      for (const c of existingContests) contestNameToId.set(`${c.name}-${c.date || defaultDate}`, c.id)

      for (const contestItem of parsed.contests) {
        const contest = contestItem.contest
        const safeDate = contest.date || defaultDate
        const key = `${contest.name}-${safeDate}`
        if (contestNameToId.has(key)) continue
        try {
          const created = await tx.contest.create({
            data: {
              name: contest.name,
              type: contest.type || 'offline',
              platform: contest.platform,
              date: safeDate,
              description: contest.description,
              totalScore: contest.totalScore,
              timeLimit: contest.timeLimit,
              isTeam: contest.isTeam || false,
            },
          })
          contestNameToId.set(key, created.id)
          result.contests++
        } catch (e) {
          result.errors.push(`创建比赛 "${contest.name}" 失败`)
        }
      }

      // 3. 导入知识点
      const knowledgeNameToId = new Map<string, string>()
      const existingKnowledge = await tx.knowledgePoint.findMany({ select: { id: true, name: true } })
      for (const k of existingKnowledge) knowledgeNameToId.set(k.name, k.id)

      for (const kp of parsed.knowledgePoints) {
        if (knowledgeNameToId.has(kp.name)) continue
        try {
          const created = await tx.knowledgePoint.create({
            data: {
              name: kp.name,
              level: kp.level,
              levelAlias: kp.levelAlias,
              category: kp.category,
              description: kp.description,
              prerequisites: kp.prerequisites,
            },
          })
          knowledgeNameToId.set(kp.name, created.id)
          result.knowledgePoints++
        } catch (e) {
          result.errors.push(`创建知识点 "${kp.name}" 失败`)
        }
      }

      // 4. 导入任务（Markdown 任务板无学生关联信息，暂不支持自动导入）
      if (parsed.tasks.length > 0) {
        result.errors.push(`跳过 ${parsed.tasks.length} 个任务：Markdown 任务板缺少学生关联信息`)
      }

      // 5. 导入比赛成绩（使用统一的日期默认值确保 key 匹配）
      for (const cr of parsed.contestResults) {
        const studentId = studentNameToId.get(cr.studentName)
        if (!studentId) {
          result.errors.push(`成绩：学生 "${cr.studentName}" 不存在`)
          continue
        }
        const safeDate = cr.date || defaultDate
        const contestKey = `${cr.contestName}-${safeDate}`
        const contestId = contestNameToId.get(contestKey)
        if (!contestId) {
          result.errors.push(`成绩：比赛 "${cr.contestName}"（日期：${safeDate}）不存在，key=${contestKey}`)
          continue
        }
        try {
          await tx.studentContestResult.create({
            data: {
              studentId,
              contestId,
              award: cr.award,
              score: cr.score,
              rank: cr.rank,
              notes: cr.notes,
            },
          })
          result.contestResults++
        } catch (e) {
          result.errors.push(`创建成绩 "${cr.contestName} - ${cr.studentName}" 失败`)
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: `导入完成：学生 ${result.students} 人，比赛 ${result.contests} 场，知识点 ${result.knowledgePoints} 条，任务 ${result.tasks} 条，成绩 ${result.contestResults} 条`,
      result,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
