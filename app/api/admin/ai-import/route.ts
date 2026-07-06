import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  analyzeTextWithAI,
  deduplicate,
  importFilteredData,
} from '@/lib/ai-parser'

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { text, mode = 'preview' } = body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: '请提供需要解析的文本' },
        { status: 400 }
      )
    }

    const apiKey = process.env.MOONSHOT_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI 服务未配置，请检查 MOONSHOT_API_KEY 环境变量' },
        { status: 500 }
      )
    }

    // 1. 调用 AI 分析文本
    let parsedData
    try {
      parsedData = await analyzeTextWithAI(text.trim(), apiKey)
    } catch (e) {
      console.error('AI 分析失败:', e)
      return NextResponse.json(
        {
          error:
            'AI 分析失败: ' +
            (e instanceof Error ? e.message : '未知错误'),
        },
        { status: 502 }
      )
    }

    // 2. 去重
    const deduplicated = await deduplicate(parsedData, prisma)

    const totalNew =
      deduplicated.newStudents.length +
      deduplicated.newTasks.length +
      deduplicated.newKnowledges.length +
      deduplicated.newContestResults.length

    const hasDuplicates =
      deduplicated.duplicates.length > 0 || deduplicated.errors.length > 0

    // 3. Preview 模式：只返回分析结果
    if (mode === 'preview') {
      return NextResponse.json({
        preview: deduplicated,
        rawEntities: parsedData.entities,
        duplicates: deduplicated.duplicates,
        errors: deduplicated.errors,
        canImport: totalNew > 0,
        stats: {
          students: deduplicated.newStudents.length,
          tasks: deduplicated.newTasks.length,
          knowledges: deduplicated.newKnowledges.length,
          contestResults: deduplicated.newContestResults.length,
          duplicates: deduplicated.duplicates.length,
          errors: deduplicated.errors.length,
        },
      })
    }

    // 4. Confirm 模式：导入数据
    if (mode === 'confirm') {
      if (totalNew === 0) {
        return NextResponse.json(
          { error: '没有可导入的新数据' },
          { status: 400 }
        )
      }

      const importResult = await importFilteredData(deduplicated, prisma)

      return NextResponse.json({
        success: importResult.success,
        importedCounts: importResult.importedCounts,
        errors: importResult.errors,
        message: importResult.success
          ? `导入完成：学生 ${importResult.importedCounts.students} 人，任务 ${importResult.importedCounts.tasks} 条，知识点 ${importResult.importedCounts.knowledges} 条，比赛成绩 ${importResult.importedCounts.contestResults} 条`
          : '导入过程中出现错误',
      })
    }

    return NextResponse.json(
      { error: '不支持的 mode 参数，请使用 preview 或 confirm' },
      { status: 400 }
    )
  } catch (error) {
    console.error('AI import route error:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}
