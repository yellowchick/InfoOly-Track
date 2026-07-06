'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Upload, FileText, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import AdminLayout from '@/components/admin/AdminLayout'
import AiImportPanel from '@/components/admin/AiImportPanel'

interface PreviewData {
  fileName: string
  lineCount: number
  headings: string[]
  students: string[]
  contests: string[]
  knowledge: string[]
  tasks: string[]
}

export default function ImportPage() {
  const router = useRouter()
  const [file, setFile] = React.useState<File | null>(null)
  const [preview, setPreview] = React.useState<PreviewData | null>(null)
  const [rawText, setRawText] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<{ success: boolean; message: string } | null>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.name.endsWith('.md')) {
      setFile(droppedFile)
      uploadFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      uploadFile(selectedFile)
    }
  }

  const uploadFile = async (uploadFile: File) => {
    setLoading(true)
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', uploadFile)

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.status === 401) {
        router.push('/admin/')
        return
      }

      if (res.ok) {
        const data = await res.json()
        setPreview(data.preview)
        setRawText(data.rawText)
      } else {
        const data = await res.json()
        setResult({ success: false, message: data.error || '解析失败' })
      }
    } catch (error) {
      setResult({ success: false, message: '上传失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  const handleImport = async () => {
    if (!preview) return
    setLoading(true)
    try {
      // In a real implementation, you would send the parsed data to be imported
      // Here we simulate the import process
      const formData = new FormData()
      if (file) formData.append('file', file)
      formData.append('confirm', 'true')

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        setResult({ success: true, message: '导入成功！' })
        setPreview(null)
        setFile(null)
        setRawText('')
        if (fileInputRef.current) fileInputRef.current.value = ''
      } else {
        const data = await res.json()
        setResult({ success: false, message: data.error || '导入失败' })
      }
    } catch (error) {
      setResult({ success: false, message: '导入失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setRawText('')
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">数据导入</h1>
          <p className="text-sm text-muted">从文件或自然语言描述导入数据</p>
        </div>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:w-auto">
            <TabsTrigger value="file" className="gap-2">
              <Upload className="h-4 w-4" />
              文件导入
            </TabsTrigger>
            <TabsTrigger value="ai" className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI 智能导入
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-6 mt-6">
            {/* 模板下载 */}
            <Card className="border-dashed border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">下载导入模板</p>
                    <p className="text-xs text-muted">了解支持的 Markdown 格式和示例数据</p>
                  </div>
                  <a
                    href="/templates/导入模板.md"
                    download
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  >
                    下载模板
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors
                ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">点击或拖拽上传文件</p>
                  <p className="mt-1 text-sm text-muted">支持 Markdown (.md) 格式，参考导入模板格式</p>
                </div>
              </div>
            </div>

            {/* File Info */}
            {file && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <FileText className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={clearFile} className="rounded p-1 hover:bg-muted">
                  <X className="h-4 w-4 text-muted" />
                </button>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">解析预览</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted">文件</p>
                      <p className="font-medium">{preview.fileName}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted">行数</p>
                      <p className="font-medium">{preview.lineCount}</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted">学生</p>
                      <p className="font-medium">{preview.students.length} 条</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted">比赛</p>
                      <p className="font-medium">{preview.contests.length} 条</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted">知识点</p>
                      <p className="font-medium">{preview.knowledge.length} 条</p>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted">任务</p>
                      <p className="font-medium">{preview.tasks.length} 条</p>
                    </div>
                  </div>

                  {preview.headings.length > 0 && (
                    <div>
                      <p className="mb-2 text-sm font-medium">文档结构</p>
                      <div className="space-y-1">
                        {preview.headings.map((heading, i) => (
                          <p key={i} className="text-sm text-muted">{heading}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {rawText && (
                    <div>
                      <p className="mb-2 text-sm font-medium">内容预览</p>
                      <pre className="max-h-64 overflow-auto rounded-lg bg-muted/50 p-3 text-xs text-muted">
                        {rawText.slice(0, 2000)}{rawText.length > 2000 ? '...' : ''}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={clearFile}>取消</Button>
                    <Button onClick={handleImport} disabled={loading} className="gap-2">
                      <CheckCircle className="h-4 w-4" />
                      {loading ? '导入中...' : '确认导入'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Result */}
            {result && (
              <div className={`flex items-center gap-3 rounded-lg p-4 ${result.success ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                {result.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <p className="font-medium">{result.message}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="ai" className="mt-6">
            <AiImportPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
