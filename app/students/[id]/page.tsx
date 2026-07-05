import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StudentDetailTabs } from '@/components/student/StudentDetailTabs'
import { getStudentById, studentsSeedData } from '@/lib/student-data'

interface PageProps {
  params: { id: string }
}

export function generateStaticParams() {
  return studentsSeedData.map((student) => ({
    id: student.id,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const student = getStudentById(params.id)
  if (!student) {
    return { title: '学生未找到' }
  }
  return {
    title: `${student.name} - 学生详情`,
    description: `${student.name}的信息学奥赛生涯记录`,
  }
}

export default async function StudentDetailPage({ params }: PageProps) {
  let student = getStudentById(params.id)

  if (!student) {
    notFound()
  }

  return <StudentDetailTabs student={student} />
}
