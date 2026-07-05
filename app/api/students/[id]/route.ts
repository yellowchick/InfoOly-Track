import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkAdmin } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        contestResults: {
          include: { contest: true },
          orderBy: { contest: { date: 'desc' } },
        },
        knowledges: {
          include: { knowledgePoint: true },
          orderBy: { certifiedAt: 'desc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    console.error('GET /api/students/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params
    const body = await request.json()
    const { name, displayName, avatarUrl, bio } = body

    const existing = await prisma.student.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const updated = await prisma.student.update({
      where: { id },
      data: { name, displayName, avatarUrl, bio },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('PUT /api/students/[id] error:', error)
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = params

    const existing = await prisma.student.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    await prisma.student.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/students/[id] error:', error)
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 })
  }
}
