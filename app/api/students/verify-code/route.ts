/**
 * 学生详情访问代码校验 API
 *
 * POST /api/students/verify-code
 * Body: { studentId, code }
 * 返回: { role: 'admin' | 'student' } 或 403
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyStudentAccess } from '@/lib/student-access'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId, code } = body

    if (!studentId || !code) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 })
    }

    const student = await prisma.student.findUnique({
      where: { id: String(studentId) },
      select: { id: true, name: true, accessCode: true },
    })
    if (!student) {
      return NextResponse.json({ error: '学生不存在' }, { status: 404 })
    }

    const role = await verifyStudentAccess(String(code), student)
    if (!role) {
      return NextResponse.json({ error: '访问代码不正确' }, { status: 403 })
    }

    return NextResponse.json({ role })
  } catch (error) {
    console.error('verify-code error:', error)
    return NextResponse.json({ error: '校验失败' }, { status: 500 })
  }
}
