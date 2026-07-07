'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import type { Student } from '@/types'

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = React.useState<Student[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = React.useMemo(() => {
    if (!searchQuery.trim()) return students
    const q = searchQuery.toLowerCase()
    return students.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.displayName.toLowerCase().includes(q) ||
      (s.bio && s.bio.toLowerCase().includes(q))
    )
  }, [students, searchQuery])

  const columns = [
    {
      key: 'name',
      title: '姓名',
      render: (student: Student) => (
        <Link href={`/students/${student.id}`} className="font-medium hover:underline text-primary">
          {student.name}
        </Link>
      ),
    },
    {
      key: 'displayName',
      title: '显示名称',
    },
    {
      key: 'createdAt',
      title: '创建时间',
      render: (student: Student) => (
        <div className="flex items-center gap-1 text-muted">
          <Calendar className="h-3.5 w-3.5" />
          {new Date(student.createdAt).toLocaleDateString('zh-CN')}
        </div>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">学生管理</h1>
            <p className="text-sm text-muted">查看学生信息和档案</p>
          </div>
          <div className="text-sm text-muted">
            共 {filteredStudents.length} 名学生
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="搜索姓名、显示名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredStudents}
            keyExtractor={(s) => s.id}
          />
        )}
      </div>
    </AdminLayout>
  )
}
