'use client'

import { StudentProfile } from '@/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Timeline } from '@/components/student/Timeline'
import { StudentStats } from '@/components/student/StudentStats'
import { KnowledgeGrid } from '@/components/student/KnowledgeGrid'
import { TaskList } from '@/components/student/TaskList'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, BookOpen, ListChecks, Clock } from 'lucide-react'
import Link from 'next/link'
import { getTimelineItems } from '@/lib/student-data'

interface StudentDetailTabsProps {
  student: StudentProfile
}

export function StudentDetailTabs({ student }: StudentDetailTabsProps) {
  const timelineItems = getTimelineItems(student)

  return (
    <div className="min-h-screen bg-background pb-nav">
      <div className="container mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6">
          <Link href="/students/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回学生列表
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
              {student.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold">{student.name}</h1>
          <p className="text-muted-foreground mt-1">{student.displayName}</p>
        </div>

        <div className="mb-8">
          <StudentStats student={student} />
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="gap-1.5 py-2.5">
              <Clock className="h-4 w-4 hidden sm:inline" />
              <span>概览</span>
            </TabsTrigger>
            <TabsTrigger value="contests" className="gap-1.5 py-2.5">
              <Trophy className="h-4 w-4 hidden sm:inline" />
              <span>战绩</span>
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-1.5 py-2.5">
              <BookOpen className="h-4 w-4 hidden sm:inline" />
              <span>知识点</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-1.5 py-2.5">
              <ListChecks className="h-4 w-4 hidden sm:inline" />
              <span>任务板</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">生涯时间轴</h2>
              <Timeline items={timelineItems} orientation="horizontal" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold mb-4">近期战绩</h2>
                <div className="space-y-2">
                  {student.contestResults.slice(0, 3).map(cr => (
                    <div key={cr.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{cr.contest?.name}</p>
                        <p className="text-xs text-muted-foreground">{cr.contest?.date}</p>
                      </div>
                      <span className="text-sm font-semibold text-yellow-600">
                        {cr.award || `得分: ${cr.score}`}
                      </span>
                    </div>
                  ))}
                  {student.contestResults.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无比赛记录</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">最新认证</h2>
                <div className="space-y-2">
                  {student.knowledges.slice(0, 3).map(sk => (
                    <div key={sk.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="font-medium text-sm">{sk.knowledgePoint?.name}</p>
                        <p className="text-xs text-muted-foreground">{sk.knowledgePoint?.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {sk.knowledgePoint?.levelAlias}
                      </span>
                    </div>
                  ))}
                  {student.knowledges.length === 0 && (
                    <p className="text-sm text-muted-foreground">暂无知识点认证</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contests" className="mt-6">
            <div className="space-y-3">
              {student.contestResults.map(cr => (
                <div key={cr.id} className="rounded-xl border bg-card shadow-sm p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{cr.contest?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {cr.contest?.platform} · {cr.contest?.date}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cr.contest?.description}
                      </p>
                      {cr.notes && (
                        <p className="text-xs text-muted-foreground mt-2 bg-muted rounded-md p-2">
                          {cr.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {cr.award && (
                        <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold bg-yellow-50 text-yellow-600 border border-yellow-200">
                          {cr.award}
                        </span>
                      )}
                      {cr.score !== undefined && !cr.award && (
                        <span className="text-lg font-bold text-blue-600">
                          {cr.score}
                        </span>
                      )}
                    </div>
                  </div>
                  {(cr.rank || cr.atcoderRank || cr.atcoderRating) && (
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      {cr.rank && <span>排名: {cr.rank}</span>}
                      {cr.atcoderRank && <span>AtCoder排名: {cr.atcoderRank}</span>}
                      {cr.atcoderRating && <span>AtCoder积分: {cr.atcoderRating}</span>}
                    </div>
                  )}
                </div>
              ))}
              {student.contestResults.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  暂无比赛记录
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <KnowledgeGrid knowledges={student.knowledges} />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <TaskList tasks={student.tasks} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
