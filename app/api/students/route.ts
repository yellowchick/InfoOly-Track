import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        _count: {
          select: {
            contestResults: true,
            knowledges: true,
            tasks: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error('GET /api/students error:', error)
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, displayName, avatarUrl, bio } = body

    if (!name || !displayName) {
      return NextResponse.json({ error: 'Name and displayName are required' }, { status: 400 })
    }

    const student = await prisma.student.create({
      data: { name, displayName, avatarUrl, bio },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('POST /api/students error:', error)
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
