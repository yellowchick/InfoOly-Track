'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import AdminLayout from '@/components/admin/AdminLayout'
import DataTable from '@/components/admin/DataTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog'
import FormDialog, { type FormField } from '@/components/admin/FormDialog'
import type { Student } from '@/types'

const studentFields: FormField[] = [
  { name: 'name', label: '姓名', type: 'input', required: true, placeholder: '输入学生姓名' },
  { name: 'displayName', label: '显示名称', type: 'input', required: true, placeholder: '输入显示名称' },
  { name: 'bio', label: '简介', type: 'textarea', placeholder: '输入简介（可选）', rows: 3 },
]

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = React.useState<Student[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showForm, setShowForm] = React.useState(false)
  const [editingStudent, setEditingStudent] = React.useState<Student | null>(null)
  const [deletingStudent, setDeletingStudent] = React.useState<Student | null>(null)

  React.useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students', { credentials: 'include' })
      if (res.status === 401) {
        router.push('/admin/')
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

  const handleSubmit = async (values: Record<string, string | number | boolean>) => {
    try {
      if (editingStudent) {
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include',
        })
        if (res.ok) {
          setEditingStudent(null)
          setShowForm(false)
          fetchStudents()
        }
      } else {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          credentials: 'include',
        })
        if (res.ok) {
          setShowForm(false)
          fetchStudents()
        }
      }
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  const handleDelete = async () => {
    if (!deletingStudent) return
    try {
      const res = await fetch(`/api/students/${deletingStudent.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setDeletingStudent(null)
        fetchStudents()
      }
    } catch (error) {
      console.error('Error deleting student:', error)
    }
  }

  const columns = [
    {
      key: 'name',
      title: '姓名',
      render: (student: Student) => (
        <div className="font-medium">{student.name}</div>
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
            <p className="text-sm text-muted">管理学生信息和档案</p>
          </div>
          <Button
            onClick={() => {
              setEditingStudent(null)
              setShowForm(true)
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            新增学生
          </Button>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-muted">加载中...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={students}
            keyExtractor={(s) => s.id}
            onEdit={(student) => {
              setEditingStudent(student)
              setShowForm(true)
            }}
            onDelete={(student) => setDeletingStudent(student)}
          />
        )}

        {showForm && (
          <FormDialog
            title={editingStudent ? '编辑学生' : '新增学生'}
            fields={studentFields}
            initialValues={
              editingStudent
                ? {
                    name: editingStudent.name,
                    displayName: editingStudent.displayName,
                    bio: editingStudent.bio || '',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false)
              setEditingStudent(null)
            }}
          />
        )}

        {deletingStudent && (
          <ConfirmDialog
            title="确认删除"
            description={`确定要删除学生 "${deletingStudent.name}" 吗？此操作不可恢复。`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingStudent(null)}
          />
        )}
      </div>
    </AdminLayout>
  )
}
