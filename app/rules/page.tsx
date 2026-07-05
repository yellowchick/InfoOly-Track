import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Rule } from '@/types'

export const metadata: Metadata = {
  title: '赛制介绍 - InfoOly Track',
  description: '信息学奥林匹克竞赛常见赛制介绍：OI赛制、IOI赛制、ACM-ICPC',
}

const fallbackRules: Rule[] = [
  {
    id: 'r1',
    name: 'OI赛制',
    description: '无提交反馈、无实时排名。比赛期间提交代码后不显示任何结果（如AC/WA/TLE），仅赛后统一评测；每题按通过的测试点（或子任务）得分，多次提交以最后一次为准，无罚时。',
    features: JSON.stringify(['无提交反馈','无实时排名','按测试点得分','最后一次提交为准','无罚时']),
    examples: 'NOI、CSP-J/S、NOIP、蓝桥杯（省赛及以上）',
    sortOrder: 1,
  },
  {
    id: 'r2',
    name: 'IOI赛制',
    description: '有实时反馈（每题得分/测试点通过情况）、有实时排名。同样按测试点给分、不限提交次数、最后一次提交计分，但比赛过程中可看到当前得分和全场排名。',
    features: JSON.stringify(['实时反馈','实时排名','按测试点得分','不限提交次数']),
    examples: 'IOI（国际奥赛）、PAT、CCF-CSP（部分场次）、多数线上月赛（如洛谷月赛）',
    sortOrder: 2,
  },
  {
    id: 'r3',
    name: 'ACM-ICPC',
    description: '以三人团队为单位，在5小时内共用一台计算机解决若干道算法难题，排名时首先以解题数量为最高准则，解题数相同时则比较总用时（包含错误提交产生的罚时）。',
    features: JSON.stringify(['三人团队','5小时','共用一台计算机','解题数量优先','含罚时']),
    examples: '国际大学生程序设计竞赛',
    sortOrder: 3,
  },
]

async function getRules() {
  try {
    const rules = await prisma.rule.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return rules
  } catch (error) {
    console.warn('Database query failed, using fallback rules:', error)
    return fallbackRules
  }
}

export default async function RulesPage() {
  const rules = await getRules()

  const parsedRules = rules.map((rule) => ({
    ...rule,
    features: rule.features ? (() => { try { return JSON.parse(rule.features) } catch { return [] } })() : [],
  }))

  return (
    <div className="min-h-screen flex flex-col bg-background pb-nav">
      <Header />

      <main className="flex-1 mx-auto w-full max-w-md px-4 pb-6 animate-fade-in">
        {/* Page Header */}
        <section className="mt-4">
          <h1 className="text-2xl font-bold text-foreground">赛制介绍</h1>
          <p className="text-sm text-muted mt-1">
            信息学竞赛中常见的三种赛制说明
          </p>
        </section>

        {/* Rules Accordion */}
        <section className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            {parsedRules.map((rule) => (
              <AccordionItem key={rule.id} value={rule.id} className="border-b border-border/60">
                <AccordionTrigger className="text-base font-semibold py-4 hover:no-underline">
                  {rule.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-3 pb-2">
                    <p className="text-sm text-foreground leading-relaxed">
                      {rule.description}
                    </p>

                    {Array.isArray(rule.features) && rule.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rule.features.map((feature: string) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {rule.examples && (
                      <div className="mt-1">
                        <span className="text-xs font-semibold text-muted">代表赛事：</span>
                        <span className="text-xs text-foreground">{rule.examples}</span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Quick Comparison Card */}
        <section className="mt-6">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">赛制对比</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="font-medium text-foreground">提交反馈</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted">OI: ❌</span>
                    <span className="text-muted">IOI: ✅</span>
                    <span className="text-muted">ACM: ✅</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="font-medium text-foreground">实时排名</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted">OI: ❌</span>
                    <span className="text-muted">IOI: ✅</span>
                    <span className="text-muted">ACM: ✅</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/40">
                  <span className="font-medium text-foreground">罚时机制</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted">OI: ❌</span>
                    <span className="text-muted">IOI: ❌</span>
                    <span className="text-muted">ACM: ✅</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium text-foreground">计分方式</span>
                  <div className="flex gap-2 text-xs">
                    <span className="text-muted">OI: 测试点</span>
                    <span className="text-muted">IOI: 测试点</span>
                    <span className="text-muted">ACM: 题数</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}
