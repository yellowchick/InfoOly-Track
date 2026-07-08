import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { fallbackAnnouncements } from '@/lib/fallback-data'

interface PageProps {
  params: { id: string }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const announcement = await getAnnouncement(params.id)
  if (!announcement) return { title: '内容未找到' }
  return {
    title: `${announcement.title} - 家校专栏`,
    description: typeof announcement.content === 'string' && announcement.content.startsWith('{') 
      ? JSON.parse(announcement.content).summary?.slice(0, 100) 
      : announcement.content.slice(0, 100),
  }
}

async function getAnnouncement(id: string) {
  try {
    const dbAnn = await prisma.announcement.findUnique({
      where: { id, isPublic: true },
    })
    if (dbAnn) return dbAnn
  } catch { /* ignore */ }
  
  return fallbackAnnouncements.find((a) => a.id === id) || null
}

// 解析公告内容
function parseContent(content: string): { summary: string; students: any[]; isStructured: boolean; rawContent: string } {
  if (content.startsWith('{')) {
    try {
      const parsed = JSON.parse(content)
      return {
        summary: parsed.summary || '',
        students: parsed.students || [],
        isStructured: true,
        rawContent: content,
      }
    } catch {
      return { summary: content, students: [], isStructured: false, rawContent: content }
    }
  }
  return { summary: content, students: [], isStructured: false, rawContent: content }
}

// 学生颜色映射
const studentColors: Record<string, { bg: string; border: string; text: string; tag: string }> = {
  '马天成': { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', tag: 'bg-blue-100 text-blue-700' },
  '党皓天': { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700', tag: 'bg-purple-100 text-purple-700' },
  '张赫桐': { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700', tag: 'bg-green-100 text-green-700' },
  '陆臻': { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-700', tag: 'bg-orange-100 text-orange-700' },
}

function getStudentColor(name: string) {
  return studentColors[name] || { bg: 'bg-gray-50', border: 'border-gray-300', text: 'text-gray-700', tag: 'bg-gray-100 text-gray-700' }
}

export default async function AnnouncementDetailPage({ params }: PageProps) {
  const announcement = await getAnnouncement(params.id)

  if (!announcement) {
    notFound()
  }

  const { summary, students, isStructured } = parseContent(announcement.content)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="mx-auto max-w-md px-4 py-6">
        {/* 返回 */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        {/* 标题 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{announcement.date || '近期'}</span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              家校专栏
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground">{announcement.title}</h1>
        </div>

        {isStructured ? (
          <>
            {/* 整体总结 */}
            {summary && (
              <div className="rounded-xl border border-border/60 bg-gradient-to-r from-primary/5 to-transparent p-4 mb-6">
                <h2 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  整体总结
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
              </div>
            )}

            {/* 学生评价卡片 */}
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                学生评价
              </h2>
              
              <div className="grid grid-cols-1 gap-3">
                {students.map((student: any) => {
                  const colors = getStudentColor(student.name)
                  return (
                    <div 
                      key={student.name} 
                      className={`rounded-xl border-l-4 ${colors.border} ${colors.bg} p-4`}
                    >
                      {/* 学生名字 */}
                      <h3 className={`text-base font-bold ${colors.text} mb-2`}>
                        {student.name}
                      </h3>
                      
                      {/* 标签 */}
                      {student.tags && student.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {student.tags.map((tag: string) => (
                            <span 
                              key={tag}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.tag}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* 详细评价 */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {student.comment}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          /* 非结构化内容（兼容旧数据） */
          <article className="prose prose-sm max-w-none text-foreground">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {summary}
            </div>
          </article>
        )}

        {/* 底部导航 */}
        <div className="mt-8 pt-4 border-t border-border">
          <Link href="/announcements/">
            <span className="text-sm text-primary hover:underline">
              查看所有家校专栏 →
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
