import { PrismaClient } from '@prisma/client'

export interface AIStudent {
  type: 'student'
  data: {
    name: string
    displayName?: string
  }
}

export interface AITask {
  type: 'task'
  data: {
    studentName: string
    title: string
    status?: string
    category?: string
    priority?: string
    dueDate?: string
  }
}

export interface AIKnowledge {
  type: 'knowledge'
  data: {
    studentName: string
    knowledgeName: string
    certifiedAt?: string
  }
}

export interface AIContestResult {
  type: 'contest_result'
  data: {
    studentName: string
    contestName: string
    score?: number
    award?: string
    rank?: number
    notes?: string
    date?: string
    platform?: string
    contestType?: string
  }
}

export type AIEntity = AIStudent | AITask | AIKnowledge | AIContestResult

export interface ParsedAIData {
  entities: AIEntity[]
}

export interface NewStudent {
  name: string
  displayName: string
}

export interface NewTask {
  studentName: string
  title: string
  status: string
  category?: string
  priority?: string
  dueDate?: string
}

export interface NewKnowledge {
  studentName: string
  knowledgeName: string
  certifiedAt: string
}

export interface NewContestResult {
  studentName: string
  contestName: string
  score?: number
  award?: string
  rank?: number
  notes?: string
  date?: string
  platform?: string
  contestType?: string
}

export interface DuplicateItem {
  entity: string
  reason: string
}

export interface DeduplicatedData {
  newStudents: NewStudent[]
  newTasks: NewTask[]
  newKnowledges: NewKnowledge[]
  newContestResults: NewContestResult[]
  duplicates: DuplicateItem[]
  errors: DuplicateItem[]
}

export interface ImportResult {
  success: boolean
  importedCounts: {
    students: number
    tasks: number
    knowledges: number
    contestResults: number
  }
  errors: string[]
}

/**
 * 调用 Kimi API 分析文本，提取结构化数据
 */
export async function analyzeTextWithAI(
  text: string,
  apiKey: string
): Promise<ParsedAIData> {
  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'moonshot-v1-8k',
      messages: [
        {
          role: 'system',
          content: `你是一个数据解析助手。请将用户提供的关于信息学奥赛相关的自然语言描述解析为结构化JSON。

支持解析的实体类型：
1. student（学生）：{ name, displayName? }
2. task（任务）：{ studentName, title, status?, category?, priority?, dueDate? }，status 默认为 "completed"
3. knowledge（知识点认证）：{ studentName, knowledgeName, certifiedAt? }，certifiedAt 格式为 YYYYMM（如 202603），如未提供则使用当前年月
4. contest_result（比赛成绩）：{ studentName, contestName, score?, award?, rank?, notes?, date?, platform?, contestType? }，date 格式为 YYYY-MM

重要规则：
- GESP（中国计算机学会编程能力等级认证）是等级考试，不是排名。例如 "GESP 5级" 或 "通过5级" 应该作为 award 字段（如 award: "5级" 或 award: "通过5级"），而不是 score 或 rank。
- 得分类的比赛（如 CSP、USACO、YACS、AtCoder）使用 score 字段存储具体分数。
- 排名类的信息（如 "排名 15" 或 "第 3 名"）使用 rank 字段。
- 奖项（如 "一等奖"、"二等奖"、"金牌"、"铜牌"）使用 award 字段。

返回格式必须是合法的 JSON 对象，包含 entities 字段，entities 是一个数组，每个元素包含 type 和 data 字段。
不要输出任何解释文字，只输出 JSON。`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error')
    throw new Error(`Kimi API 请求失败: ${response.status} - ${errorText}`)
  }

  const json = await response.json()
  const content = json.choices?.[0]?.message?.content

  if (!content || typeof content !== 'string') {
    throw new Error('Kimi API 返回格式异常')
  }

  const extracted = extractJSON(content)
  if (!extracted) {
    throw new Error('无法从 AI 响应中提取 JSON')
  }

  try {
    const parsed = JSON.parse(extracted) as { entities?: unknown[] }
    if (!Array.isArray(parsed.entities)) {
      throw new Error('AI 返回的 JSON 缺少 entities 数组')
    }
    const normalized = parsed.entities.map((e: any) => ({
      type: e.type,
      data: e.data || e.value,
    }))
    const entities = normalized.filter(isValidEntity) as AIEntity[]
    return { entities }
  } catch (e) {
    throw new Error(
      `JSON 解析失败: ${e instanceof Error ? e.message : String(e)}`
    )
  }
}

/**
 * 从文本中提取 JSON 字符串（支持代码块包裹）
 */
function extractJSON(text: string): string | null {
  // 尝试匹配 ```json ... ``` 或 ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (codeBlockMatch) {
    const candidate = codeBlockMatch[1].trim()
    if (looksLikeJSON(candidate)) return candidate
  }

  // 尝试直接匹配 JSON 对象
  const objectMatch = text.match(/\{[\s\S]*\}/)
  if (objectMatch) {
    const candidate = objectMatch[0].trim()
    if (looksLikeJSON(candidate)) return candidate
  }

  // 尝试匹配 JSON 数组
  const arrayMatch = text.match(/\[[\s\S]*\]/)
  if (arrayMatch) {
    const candidate = arrayMatch[0].trim()
    if (looksLikeJSON(candidate)) return candidate
  }

  // 整个文本可能就是个 JSON
  const trimmed = text.trim()
  if (looksLikeJSON(trimmed)) return trimmed

  return null
}

function looksLikeJSON(str: string): boolean {
  return str.startsWith('{') || str.startsWith('[')
}

function isValidEntity(item: unknown): item is AIEntity {
  if (!item || typeof item !== 'object') return false
  const obj = item as Record<string, unknown>
  if (!obj.type || typeof obj.type !== 'string') return false
  if (!obj.data || typeof obj.data !== 'object') return false
  return ['student', 'task', 'knowledge', 'contest_result'].includes(obj.type)
}

/**
 * 去重：对比现有数据库，过滤掉已存在的数据
 */
export async function deduplicate(
  parsedData: ParsedAIData,
  prisma: PrismaClient
): Promise<DeduplicatedData> {
  const result: DeduplicatedData = {
    newStudents: [],
    newTasks: [],
    newKnowledges: [],
    newContestResults: [],
    duplicates: [],
    errors: [],
  }

  // 加载现有数据用于查重
  const existingStudents = await prisma.student.findMany({
    select: { id: true, name: true },
  })
  const existingStudentNames = new Set(existingStudents.map((s) => s.name))
  const studentNameToId = new Map(existingStudents.map((s) => [s.name, s.id]))

  const existingTasks = await prisma.task.findMany({
    select: { id: true, studentId: true, title: true },
  })
  const existingTaskKeys = new Set(
    existingTasks.map((t) => `${t.studentId}:${t.title}`)
  )

  const existingKnowledges = await prisma.studentKnowledge.findMany({
    select: {
      id: true,
      studentId: true,
      knowledgePoint: { select: { name: true } },
    },
  })
  const existingKnowledgeKeys = new Set(
    existingKnowledges.map((k) => `${k.studentId}:${k.knowledgePoint.name}`)
  )

  const existingKnowledgePoints = await prisma.knowledgePoint.findMany({
    select: { id: true, name: true },
  })
  const knowledgeNameToId = new Map(
    existingKnowledgePoints.map((k) => [k.name, k.id])
  )

  const existingContests = await prisma.contest.findMany({
    select: { id: true, name: true },
  })
  const contestNameToId = new Map(existingContests.map((c) => [c.name, c.id]))

  const existingResults = await prisma.studentContestResult.findMany({
    select: { id: true, studentId: true, contestId: true },
  })
  const existingResultKeys = new Set(
    existingResults.map((r) => `${r.studentId}:${r.contestId}`)
  )

  // 收集所有涉及的学生名（包括新学生）
  const allStudentNames = new Set<string>()
  for (const entity of parsedData.entities) {
    if (entity.type === 'student') {
      allStudentNames.add(entity.data.name)
    } else if ('studentName' in entity.data) {
      allStudentNames.add(entity.data.studentName)
    }
  }

  // 处理学生
  for (const entity of parsedData.entities) {
    if (entity.type !== 'student') continue

    const { name, displayName } = entity.data
    if (existingStudentNames.has(name)) {
      result.duplicates.push({
        entity: `学生: ${name}`,
        reason: '学生已存在',
      })
      continue
    }
    // 避免同一批中重复添加
    if (result.newStudents.find((s) => s.name === name)) {
      result.duplicates.push({
        entity: `学生: ${name}`,
        reason: '同批重复',
      })
      continue
    }
    result.newStudents.push({
      name,
      displayName: displayName || name,
    })
    existingStudentNames.add(name)
  }

  // 处理任务
  for (const entity of parsedData.entities) {
    if (entity.type !== 'task') continue

    const { studentName, title, status, category, priority, dueDate } =
      entity.data

    if (!allStudentNames.has(studentName)) {
      result.errors.push({
        entity: `任务: ${title} (${studentName})`,
        reason: `学生 "${studentName}" 未在解析结果中找到`,
      })
      continue
    }

    const studentId = studentNameToId.get(studentName)
    if (!studentId) {
      // 学生将在本次导入中创建，暂不标记为重复
    } else {
      const key = `${studentId}:${title}`
      if (existingTaskKeys.has(key)) {
        result.duplicates.push({
          entity: `任务: ${title} (${studentName})`,
          reason: '该学生已有同名任务',
        })
        continue
      }
    }

    // 避免同一批中重复
    const duplicateInBatch = result.newTasks.find(
      (t) => t.studentName === studentName && t.title === title
    )
    if (duplicateInBatch) {
      result.duplicates.push({
        entity: `任务: ${title} (${studentName})`,
        reason: '同批重复',
      })
      continue
    }

    result.newTasks.push({
      studentName,
      title,
      status: status || 'completed',
      category,
      priority,
      dueDate,
    })
  }

  // 处理知识点
  for (const entity of parsedData.entities) {
    if (entity.type !== 'knowledge') continue

    const { studentName, knowledgeName, certifiedAt } = entity.data

    if (!allStudentNames.has(studentName)) {
      result.errors.push({
        entity: `知识点: ${knowledgeName} (${studentName})`,
        reason: `学生 "${studentName}" 未在解析结果中找到`,
      })
      continue
    }

    const kpId = knowledgeNameToId.get(knowledgeName)
    if (!kpId) {
      result.errors.push({
        entity: `知识点: ${knowledgeName} (${studentName})`,
        reason: `知识点 "${knowledgeName}" 不存在于数据库中，请先添加知识点`,
      })
      continue
    }

    const studentId = studentNameToId.get(studentName)
    if (studentId) {
      const key = `${studentId}:${knowledgeName}`
      if (existingKnowledgeKeys.has(key)) {
        result.duplicates.push({
          entity: `知识点: ${knowledgeName} (${studentName})`,
          reason: '该学生已认证此知识点',
        })
        continue
      }
    }

    // 避免同一批中重复
    const duplicateInBatch = result.newKnowledges.find(
      (k) => k.studentName === studentName && k.knowledgeName === knowledgeName
    )
    if (duplicateInBatch) {
      result.duplicates.push({
        entity: `知识点: ${knowledgeName} (${studentName})`,
        reason: '同批重复',
      })
      continue
    }

    const now = new Date()
    const defaultCertifiedAt = `${now.getFullYear()}${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`

    result.newKnowledges.push({
      studentName,
      knowledgeName,
      certifiedAt: certifiedAt || defaultCertifiedAt,
    })
  }

  // 处理比赛成绩
  for (const entity of parsedData.entities) {
    if (entity.type !== 'contest_result') continue

    const {
      studentName,
      contestName,
      score,
      award,
      rank,
      notes,
      date,
      platform,
      contestType,
    } = entity.data

    if (!allStudentNames.has(studentName)) {
      result.errors.push({
        entity: `比赛成绩: ${contestName} (${studentName})`,
        reason: `学生 "${studentName}" 未在解析结果中找到`,
      })
      continue
    }

    const studentId = studentNameToId.get(studentName)
    const contestId = contestNameToId.get(contestName)

    if (contestId && studentId) {
      const key = `${studentId}:${contestId}`
      if (existingResultKeys.has(key)) {
        result.duplicates.push({
          entity: `比赛成绩: ${contestName} (${studentName})`,
          reason: '该学生在此比赛中已有成绩记录',
        })
        continue
      }
    }

    // 避免同一批中重复
    const duplicateInBatch = result.newContestResults.find(
      (r) => r.studentName === studentName && r.contestName === contestName
    )
    if (duplicateInBatch) {
      result.duplicates.push({
        entity: `比赛成绩: ${contestName} (${studentName})`,
        reason: '同批重复',
      })
      continue
    }

    result.newContestResults.push({
      studentName,
      contestName,
      score,
      award,
      rank,
      notes,
      date,
      platform,
      contestType,
    })
  }

  return result
}

/**
 * 导入过滤后的数据到数据库
 */
export async function importFilteredData(
  data: DeduplicatedData,
  prisma: PrismaClient
): Promise<ImportResult> {
  const result: ImportResult = {
    success: true,
    importedCounts: {
      students: 0,
      tasks: 0,
      knowledges: 0,
      contestResults: 0,
    },
    errors: [],
  }

  const studentNameToId = new Map<string, string>()

  try {
    await prisma.$transaction(async (tx) => {
      // 1. 创建学生
      for (const student of data.newStudents) {
        try {
          const created = await tx.student.create({
            data: {
              name: student.name,
              displayName: student.displayName,
            },
          })
          studentNameToId.set(student.name, created.id)
          result.importedCounts.students++
        } catch (e) {
          result.errors.push(
            `创建学生 "${student.name}" 失败: ${
              e instanceof Error ? e.message : String(e)
            }`
          )
        }
      }

      // 加载现有学生 ID（用于新创建的学生和已有学生）
      const allStudents = await tx.student.findMany({
        select: { id: true, name: true },
      })
      for (const s of allStudents) {
        studentNameToId.set(s.name, s.id)
      }

      // 2. 创建任务
      for (const task of data.newTasks) {
        const studentId = studentNameToId.get(task.studentName)
        if (!studentId) {
          result.errors.push(`找不到学生 "${task.studentName}"，跳过任务 "${task.title}"`)
          continue
        }
        try {
          await tx.task.create({
            data: {
              studentId,
              title: task.title,
              status: task.status,
              category: task.category,
              priority: task.priority || 'normal',
              dueDate: task.dueDate,
            },
          })
          result.importedCounts.tasks++
        } catch (e) {
          result.errors.push(
            `创建任务 "${task.title}" 失败: ${
              e instanceof Error ? e.message : String(e)
            }`
          )
        }
      }

      // 3. 创建知识点认证
      const knowledgeNameToId = new Map<string, string>()
      const allKnowledgePoints = await tx.knowledgePoint.findMany({
        select: { id: true, name: true },
      })
      for (const kp of allKnowledgePoints) {
        knowledgeNameToId.set(kp.name, kp.id)
      }

      for (const knowledge of data.newKnowledges) {
        const studentId = studentNameToId.get(knowledge.studentName)
        if (!studentId) {
          result.errors.push(
            `找不到学生 "${knowledge.studentName}"，跳过知识点 "${knowledge.knowledgeName}"`
          )
          continue
        }
        const kpId = knowledgeNameToId.get(knowledge.knowledgeName)
        if (!kpId) {
          result.errors.push(
            `找不到知识点 "${knowledge.knowledgeName}"，跳过`
          )
          continue
        }
        try {
          await tx.studentKnowledge.create({
            data: {
              studentId,
              knowledgePointId: kpId,
              certifiedAt: knowledge.certifiedAt,
              status: 'certified',
            },
          })
          result.importedCounts.knowledges++
        } catch (e) {
          result.errors.push(
            `创建知识点认证 "${knowledge.knowledgeName}" 失败: ${
              e instanceof Error ? e.message : String(e)
            }`
          )
        }
      }

      // 4. 创建比赛（如不存在）及成绩
      const contestNameToId = new Map<string, string>()
      const allContests = await tx.contest.findMany({
        select: { id: true, name: true },
      })
      for (const c of allContests) {
        contestNameToId.set(c.name, c.id)
      }

      for (const cr of data.newContestResults) {
        const studentId = studentNameToId.get(cr.studentName)
        if (!studentId) {
          result.errors.push(
            `找不到学生 "${cr.studentName}"，跳过比赛 "${cr.contestName}"`
          )
          continue
        }

        let contestId = contestNameToId.get(cr.contestName)
        if (!contestId) {
          // 自动创建比赛
          try {
            const now = new Date()
            const defaultDate = `${now.getFullYear()}-${String(
              now.getMonth() + 1
            ).padStart(2, '0')}`
            const createdContest = await tx.contest.create({
              data: {
                name: cr.contestName,
                date: cr.date || defaultDate,
                type: cr.contestType || 'offline',
                platform: cr.platform || undefined,
                isTeam: false,
              },
            })
            contestId = createdContest.id
            contestNameToId.set(cr.contestName, contestId)
          } catch (e) {
            result.errors.push(
              `创建比赛 "${cr.contestName}" 失败: ${
                e instanceof Error ? e.message : String(e)
              }`
            )
            continue
          }
        }

        // 检查是否已存在（事务内再次检查）
        const existingResult = await tx.studentContestResult.findFirst({
          where: { studentId, contestId },
        })
        if (existingResult) {
          result.errors.push(
            `学生 "${cr.studentName}" 在比赛 "${cr.contestName}" 中已有成绩，跳过`
          )
          continue
        }

        try {
          await tx.studentContestResult.create({
            data: {
              studentId,
              contestId,
              score: cr.score,
              award: cr.award,
              rank: cr.rank,
              notes: cr.notes,
            },
          })
          result.importedCounts.contestResults++
        } catch (e) {
          result.errors.push(
            `创建比赛成绩 "${cr.contestName}" 失败: ${
              e instanceof Error ? e.message : String(e)
            }`
          )
        }
      }
    })
  } catch (e) {
    result.success = false
    result.errors.push(`事务执行失败: ${e instanceof Error ? e.message : String(e)}`)
  }

  return result
}
