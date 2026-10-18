'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff } from 'lucide-react'
import {
  verifyAccessCode,
  saveAccess,
  loadAccess,
  clearAccess,
  type AccessState,
} from '@/lib/student-access'

interface AccessGateProps {
  studentName: string
  children: React.ReactNode
}

export function AccessGate({ studentName, children }: AccessGateProps) {
  const [access, setAccess] = useState<AccessState | null>(null)
  const [checked, setChecked] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [showCode, setShowCode] = useState(false)
  const [switching, setSwitching] = useState(false)

  useEffect(() => {
    const saved = loadAccess()
    if (saved) {
      // 校验已保存的代码对当前学生仍有效
      const role = verifyAccessCode(saved.code, studentName)
      if (role) {
        setAccess({ role, code: saved.code })
      } else {
        clearAccess()
      }
    }
    setChecked(true)
  }, [studentName])

  if (!checked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (access && !switching) {
    return (
      <>
        {children}
        <div className="fixed bottom-20 right-4 z-40 print:hidden">
          <button
            onClick={() => setSwitching(true)}
            className="flex items-center gap-1.5 rounded-full bg-muted/90 backdrop-blur border px-3 py-1.5 text-xs text-muted-foreground shadow-sm hover:bg-muted transition-colors"
            title="切换访问身份"
          >
            <Lock className="h-3 w-3" />
            {access.role === 'admin' ? '管理员' : studentName}
          </button>
        </div>
      </>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const role = verifyAccessCode(code, studentName)
    if (!role) {
      setError('代码不正确，请重试')
      return
    }
    const state: AccessState = { role, code: code.trim().toLowerCase() }
    saveAccess(state)
    setAccess(state)
    setSwitching(false)
    setError('')
  }

  const handleSwitch = (e: React.FormEvent) => {
    e.preventDefault()
    clearAccess()
    setAccess(null)
    setSwitching(false)
    setCode('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>{switching ? '切换访问身份' : '学生详情'}</CardTitle>
          <CardDescription>
            {switching
              ? '请输入新的访问代码'
              : `查看 ${studentName} 的详细信息，请输入访问代码`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={switching ? handleSwitch : handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type={showCode ? 'text' : 'password'}
                placeholder="访问代码（姓名全拼或管理员代码）"
                value={code}
                onChange={(e) => { setCode(e.target.value); setError('') }}
                autoFocus
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full">
              {switching ? '确认切换' : '进入'}
            </Button>
            {switching && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => { setSwitching(false); setError('') }}>
                取消
              </Button>
            )}
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            学生代码默认为姓名全拼，管理员代码可查看所有学生
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
