import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const knowledgePoints = await prisma.knowledgePoint.findMany({
      include: {
        students: {
          include: {
            student: true,
          },
        },
      },
      orderBy: [
        { level: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ knowledgePoints })
  } catch (error) {
    console.error('Error fetching knowledge points:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge points' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const knowledgePoint = await prisma.knowledgePoint.create({
      data: {
        name: data.name,
        level: parseInt(data.level) || 1,
        levelAlias: data.levelAlias || '',
        category: data.category || '',
        description: data.description,
        prerequisites: data.prerequisites,
      },
    })

    return NextResponse.json(knowledgePoint)
  } catch (error) {
    console.error('Error creating knowledge point:', error)
    return NextResponse.json(
      { error: 'Failed to create knowledge point' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const knowledgePoint = await prisma.knowledgePoint.update({
      where: { id: data.id },
      data: {
        name: data.name,
        level: parseInt(data.level) || 1,
        levelAlias: data.levelAlias,
        category: data.category,
        description: data.description,
        prerequisites: data.prerequisites,
      },
    })

    return NextResponse.json(knowledgePoint)
  } catch (error) {
    console.error('Error updating knowledge point:', error)
    return NextResponse.json(
      { error: 'Failed to update knowledge point' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    if (!checkAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Knowledge point ID is required' },
        { status: 400 }
      )
    }

    await prisma.knowledgePoint.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting knowledge point:', error)
    return NextResponse.json(
      { error: 'Failed to delete knowledge point' },
      { status: 500 }
    )
  }
}
