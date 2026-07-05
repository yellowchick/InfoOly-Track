import { Metadata } from 'next'
import { StudentsListClient } from '@/components/student/StudentsListClient'
import { studentsSeedData } from '@/lib/student-data'

export const metadata: Metadata = {
  title: '学生列表 - InfoOly Track',
  description: '查看所有学生的信息学奥赛生涯记录与成长轨迹',
}

export default function StudentsPage() {
  const allStudents = studentsSeedData.map(({ contestResults, knowledges, tasks, ...student }) => student)
  
  return <StudentsListClient allStudents={allStudents} />
}
