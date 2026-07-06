'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  Loader2,
  User,
  ClipboardList,
  BookOpen,
  Trophy,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AIImportStats {
  students: number
  tasks: number
  knowledges: number
  contestResults: number
  duplicates: number
  errors: number
}

interface DuplicateItem {
  entity: string
  reason: string
}

interface AIImportPreview {
  newStudents: { name: string; displayName: string }[]
  newTasks: { studentName: string; title: string; status: string; category?: string }[]
  newKnowledges: { studentName: string; knowledgeName: string; certifiedAt: string }[]
  newContestResults: { studentName: string; contestName: string; score?: number; award?: string }[]
  duplicates: DuplicateItem[]
  errors: DuplicateItem[]
}

interface AIImportResult {
  success: boolean
  importedCounts: AIImportStats
  errors: string[]
  message: string
}

interface ParsedEntity {
  type: string
  data: Record<string, unknown>
}

export default function AiImportPanel() {
  const router = useRouter()
  const [text, setText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [importing, setImporting] = React.useState(false)
  const [preview, setPreview] = React.useState<AIImportPreview | null>(null)
  const [rawEntities, setRawEntities] = React.useState<ParsedEntity[] | null>(null)
  const [stats, setStats] = React.useState<AIImportStats | null>(null)
  const [canImport, setCanImport] = React.useState(false)
  const [result, setResult] = React.useState<AIImportResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)
    setPreview(null)
    setRawEntities(null)
    setStats(null)
    setCanImport(false)

    try {
      const res = await fetch('/api/admin/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), mode: 'preview' }),
        credentials: 'include',
      })

      if (res.status === 401) {
        router.push('/admin/')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '分析失败，请重试')
        return
      }

      setPreview(data.preview)
      setRawEntities(data.rawEntities || [])
      setStats(data.stats)
      setCanImport(data.canImport)
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误，请检查连接')
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!canImport || !preview) return

    setImporting(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/admin/ai-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), mode: 'confirm' }),
        credentials: 'include',
      })

      if (res.status === 401) {
        router.push('/admin/')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '导入失败')
        return
      }

      setResult(data)
      if (data.success) {
        setCanImport(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败，请重试')
    } finally {
      setImporting(false)
    }
  }

  const handleClear = () => {
    setText('')
    setPreview(null)
    setRawEntities(null)
    setStats(null)
    setCanImport(false)
    setResult(null)
    setError(null)
  }

  const totalNewItems =
    (preview?.newStudents.length || 0) +
    (preview?.newTasks.length || 0) +
    (preview?.newKnowledges.length || 0) +
    (preview?.newContestResults.length || 0)

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">自然语言描述</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="请输入自然语言描述，例如：马天成完成了匈牙利算法TR01和状压DP练习1102，党皓天在2026年5月的YACS乙组得了270分..."
            rows={6}
            className="w-full resize-none rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">
              支持描述：学生、任务、知识点认证、比赛成绩
            </p>
            <div className="flex gap-2">
              {preview && (
                <Button variant="outline" onClick={handleClear} size="sm">
                  <X className="mr-1 h-4 w-4" />
                  清空
                </Button>
              )}
              <Button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                size="sm"
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {loading ? '分析中...' : 'AI 分析'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI 解析原始结果 */}
      {rawEntities && rawEntities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI 解析结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {rawEntities.map((entity, i) => {
                let label = entity.type
                let color: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' = 'default'

                switch (entity.type) {
                  case 'student':
                    label = `学生: ${String(entity.data.name || '未知')}`
                    color = 'secondary'
                    break
                  case 'task':
                    label = `任务: ${String(entity.data.title || '未知')}`
                    color = 'success'
                    break
                  case 'knowledge':
                    label = `知识点: ${String(entity.data.knowledgeName || '未知')}`
                    color = 'warning'
                    break
                  case 'contest_result':
                    label = `成绩: ${String(entity.data.contestName || '未知')}`
                    color = 'default'
                    break
                }

                return (
                  <Badge key={i} variant={color} className="text-xs">
                    {label}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 统计卡片 */}
      {stats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted">新增学生</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.students}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-success" />
              <span className="text-sm text-muted">新增任务</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.tasks}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-warning" />
              <span className="text-sm text-muted">新增知识点</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.knowledges}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted">新增成绩</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stats.contestResults}</p>
          </div>
        </div>
      )}

      {/* 去重后详细预览 */}
      {preview && totalNewItems > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">待导入数据</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 学生列表 */}
            {preview.newStudents.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  学生 ({preview.newStudents.length})
                </p>
                <div className="space-y-1">
                  {preview.newStudents.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{s.name}</span>
                      <span className="text-muted">({s.displayName})</span>
                      <Badge variant="success" className="ml-auto text-xs">新增</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 任务列表 */}
            {preview.newTasks.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-success" />
                  任务 ({preview.newTasks.length})
                </p>
                <div className="space-y-1">
                  {preview.newTasks.map((t, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{t.title}</span>
                      <span className="text-muted">- {t.studentName}</span>
                      <Badge variant="success" className="ml-auto text-xs">新增</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 知识点列表 */}
            {preview.newKnowledges.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-warning" />
                  知识点 ({preview.newKnowledges.length})
                </p>
                <div className="space-y-1">
                  {preview.newKnowledges.map((k, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{k.knowledgeName}</span>
                      <span className="text-muted">
                        - {k.studentName} ({k.certifiedAt})
                      </span>
                      <Badge variant="success" className="ml-auto text-xs">新增</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 比赛成绩列表 */}
            {preview.newContestResults.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  比赛成绩 ({preview.newContestResults.length})
                </p>
                <div className="space-y-1">
                  {preview.newContestResults.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-success/10 px-3 py-2 text-sm"
                    >
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">{r.contestName}</span>
                      <span className="text-muted">
                        - {r.studentName}
                        {r.score !== undefined && ` (${r.score}分)`}
                        {r.award && ` [${r.award}]`}
                      </span>
                      <Badge variant="success" className="ml-auto text-xs">新增</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 重复项和错误 */}
      {(preview?.duplicates.length || 0) > 0 || (preview?.errors.length || 0) > 0 ? (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              跳过项
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {preview && preview.duplicates.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-warning">
                  重复项 ({preview.duplicates.length})
                </p>
                <div className="space-y-1">
                  {preview.duplicates.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-warning/10 px-3 py-2 text-sm"
                    >
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span>{d.entity}</span>
                      <span className="text-muted">- {d.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {preview && preview.errors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-danger">
                  错误项 ({preview.errors.length})
                </p>
                <div className="space-y-1">
                  {preview.errors.map((e, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-md bg-danger/10 px-3 py-2 text-sm"
                    >
                      <AlertCircle className="h-4 w-4 text-danger" />
                      <span>{e.entity}</span>
                      <span className="text-muted">- {e.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* 无法导入原因提示 */}
      {preview && !result?.success && totalNewItems === 0 && (
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              无可导入数据
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {preview.duplicates.length > 0 && (
              <p className="text-sm text-muted">
                所有解析出的数据已存在于数据库中（{preview.duplicates.length} 条重复）
              </p>
            )}
            {preview.errors.length > 0 && (
              <p className="text-sm text-muted">
                解析数据存在错误，请修正后重试（{preview.errors.length} 条错误）
              </p>
            )}
            {preview.duplicates.length === 0 && preview.errors.length === 0 && (
              <p className="text-sm text-muted">
                未解析到任何有效数据，请检查输入内容是否包含可识别的学生、任务、知识点或比赛成绩
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sticky 底部按钮区域 */}
      {preview && !result?.success && (
        <div className="sticky bottom-20 z-10 flex justify-end gap-3 rounded-xl border border-border bg-card/95 backdrop-blur-sm p-4 shadow-lg">
          <Button variant="outline" onClick={handleClear}>
            取消
          </Button>
          {canImport && totalNewItems > 0 ? (
            <Button onClick={handleImport} disabled={importing} className="gap-2">
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {importing ? '导入中...' : '确认导入'}
            </Button>
          ) : (
            <Button disabled variant="secondary" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              无可导入数据
            </Button>
          )}
        </div>
      )}

      {/* 导入成功后的重新输入按钮 */}
      {result?.success && (
        <div className="flex justify-end">
          <Button onClick={handleClear} variant="outline" className="gap-2">
            <X className="h-4 w-4" />
            重新输入
          </Button>
        </div>
      )}

      {/* 导入结果 */}
      {result && (
        <div
          className={`rounded-lg p-4 ${
            result.success
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <p className="font-medium">{result.message}</p>
          </div>
          {result.errors.length > 0 && (
            <div className="mt-2 space-y-1 text-sm">
              {result.errors.map((err, i) => (
                <p key={i} className="text-danger">{err}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg bg-danger/10 p-4 text-danger">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}
    </div>
  )
}
