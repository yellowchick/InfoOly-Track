import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

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

    // Simple preview parsing - extract basic structure
    const lines = text.split('\n')
    const preview = {
      fileName: file.name,
      lineCount: lines.length,
      headings: lines
        .filter((line) => line.startsWith('#'))
        .map((line) => line.trim()),
      students: [] as string[],
      contests: [] as string[],
      knowledge: [] as string[],
      tasks: [] as string[],
    }

    // Extract student names (lines starting with ## 学生)
    let currentSection = ''
    for (const line of lines) {
      if (line.includes('学生') && line.startsWith('#')) {
        currentSection = 'students'
      } else if (line.includes('比赛') && line.startsWith('#')) {
        currentSection = 'contests'
      } else if (line.includes('知识点') && line.startsWith('#')) {
        currentSection = 'knowledge'
      } else if (line.includes('任务') && line.startsWith('#')) {
        currentSection = 'tasks'
      }

      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.slice(2).trim()
        if (currentSection && content) {
          const section = currentSection as 'students' | 'contests' | 'knowledge' | 'tasks'
          preview[section].push(content)
        }
      }
    }

    return NextResponse.json({ preview, rawText: text })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
