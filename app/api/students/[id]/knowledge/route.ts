/**
 * 学生知识点自助掌握 API
 *
 * POST /api/students/[id]/knowledge
 * Body: { knowledgePointId, action: 'certify' | 'uncertify', code }
 *
 * 验证：code 必须是该学生的姓名全拼 或 管理员代码
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAccessCode, getStudentCode } from '@/lib/student-access'

interface RouteParams {
  params: { id: string }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      select: { id: true, name: true },
    })
    if (!student) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 })
    }

    const body = await request.json()
    const { knowledgePointId, action, code } = body

    if (!knowledgePointId || !action || !code) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }
    if (action !== 'certify' && action !== 'uncertify') {
      return NextResponse.json({ error: 'action 必须是 certify 或 uncertify' }, { status: 400 })
    }

    // 验证访问代码：管理员 或 该学生本人的全拼代码
    const role = verifyAccessCode(String(code), student.name)
    if (!role) {
      return NextResponse.json({ error: '访问代码不正确' }, { status: 403 })
    }

    const kp = await prisma.knowledgePoint.findUnique({
      where: { id: knowledgePointId },
      select: { id: true },
    })
    if (!kp) {
      return NextResponse.json({ error: '知识点不存在' }, { status: 404 })
    }

    const existing = await prisma.studentKnowledge.findFirst({
      where: { studentId: student.id, knowledgePointId },
    })

    if (action === 'certify') {
      const now = new Date()
      const certifiedAt = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
      if (existing) {
        // 已存在：更新状态与认证时间
        const updated = await prisma.studentKnowledge.update({
          where: { id: existing.id },
          data: { status: 'certified', certifiedAt },
        })
        return NextResponse.json({ success: true, record: updated })
      }
      const record = await prisma.studentKnowledge.create({
        data: {
          studentId: student.id,
          knowledgePointId,
          certifiedAt,
          status: 'certified',
          notes: role === 'admin' ? '管理员标记' : '学生自助标记',
        },
      })
      return NextResponse.json({ success: true, record })
    }

    // uncertify：删除掌握记录（忘记）
    if (existing) {
      await prisma.studentKnowledge.delete({ where: { id: existing.id } })
    }
    return NextResponse.json({ success: true, deleted: true })
  } catch (error) {
    console.error('POST student knowledge error:', error)
    return NextResponse.json({ error: '操作失败' }, { status: 500 })
  }
}

// 提供给前端的代码提示（学生全拼，便于前端展示输入提示）
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      select: { name: true },
    })
    if (!student) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 })
    }
    return NextResponse.json({ hint: `请输入${student.name}姓名全拼或管理员代码` })
  } catch {
    return NextResponse.json({ hint: '请输入访问代码' })
  }
}

// 避免 lint 未使用告警
void getStudentCode
