import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contests)
  } catch (error) {
    console.error('Error fetching contests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contests' },
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
    const contest = await prisma.contest.create({
      data: {
        name: data.name,
        type: data.type || 'offline',
        platform: data.platform,
        date: data.date,
        description: data.description,
        totalScore: data.totalScore ? parseInt(data.totalScore) : null,
        timeLimit: data.timeLimit,
        isTeam: data.isTeam || false,
      },
    })

    return NextResponse.json(contest)
  } catch (error) {
    console.error('Error creating contest:', error)
    return NextResponse.json(
      { error: 'Failed to create contest' },
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
    const contest = await prisma.contest.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        platform: data.platform,
        date: data.date,
        description: data.description,
        totalScore: data.totalScore ? parseInt(data.totalScore) : null,
        timeLimit: data.timeLimit,
        isTeam: data.isTeam,
      },
    })

    return NextResponse.json(contest)
  } catch (error) {
    console.error('Error updating contest:', error)
    return NextResponse.json(
      { error: 'Failed to update contest' },
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
        { error: 'Contest ID is required' },
        { status: 400 }
      )
    }

    await prisma.contest.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contest:', error)
    return NextResponse.json(
      { error: 'Failed to delete contest' },
      { status: 500 }
    )
  }
}
