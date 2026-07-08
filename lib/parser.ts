export interface ParsedContest {
  contest: {
    name: string
    type: string
    platform?: string
    date: string
    description?: string
    totalScore?: number
    timeLimit?: string
    isTeam: boolean
  }
  results: {
    studentName: string
    award?: string
    score?: number
    rank?: number
    atcoderRank?: number
    atcoderRating?: number
    notes?: string
  }[]
}

export interface ParsedStudentKnowledge {
  studentName: string
  items: {
    name: string
    certifiedAt: string
  }[]
}

export interface ParsedData {
  rules: {
    name: string
    description: string
    features?: string
    examples?: string
  }[]
  contests: ParsedContest[]
  knowledgePoints: {
    name: string
    level: number
    levelAlias: string
    category: string
    description?: string
    prerequisites?: string
  }[]
  announcements: {
    title: string
    content: string
    category: string
    date?: string
    isPublic: boolean
  }[]
  schedules: {
    day: string
    startTime: string
    endTime: string
    note?: string
    isActive: boolean
  }[]
  studentKnowledges: ParsedStudentKnowledge[]
  tasks: {
    title: string
    status: string
    category?: string
  }[]
  // 以下字段由 parseMarkdown 自动提取，方便外部直接使用
  students: { name: string; displayName?: string }[]
  contestResults: {
    studentName: string
    contestName: string
    score?: number
    award?: string
    rank?: number
    notes?: string
    date?: string
    platform?: string
    contestType?: string
  }[]
}

function getIndentLevel(line: string): number {
  let count = 0
  for (const ch of line) {
    if (ch === ' ' || ch === '\t') count++
    else break
  }
  return count
}

function normalizeLine(line: string): { indent: number; content: string } {
  const indent = getIndentLevel(line)
  return { indent, content: line.trim() }
}

export function parseMarkdown(content: string): ParsedData {
  const lines = content.split('\n')
  const result: ParsedData = {
    rules: [],
    contests: [],
    knowledgePoints: [],
    announcements: [],
    schedules: [],
    studentKnowledges: [],
    tasks: [],
    students: [],
    contestResults: [],
  }

  let i = 0
  while (i < lines.length) {
    const line = lines[i].trim()

    if (line === '## 赛制介绍') {
      i = parseRules(lines, i + 1, result)
    } else if (line === '# 战绩' || line === '## 战绩') {
      i = parseContests(lines, i + 1, result)
    } else if (line === '### 难度分级') {
      i = parseKnowledgePoints(lines, i + 1, result)
    } else if (line === '### 最新资讯') {
      i = parseAnnouncements(lines, i + 1, result)
    } else if (line === '### 现阶段时间安排') {
      i = parseSchedules(lines, i + 1, result)
    } else if (line === '### 知识点认证') {
      i = parseStudentKnowledges(lines, i + 1, result)
    } else if (line === '### 任务板') {
      i = parseTasks(lines, i + 1, result)
    } else {
      i++
    }
  }

  // 从 studentKnowledges 提取唯一学生列表
  const studentNameSet = new Set<string>()
  for (const sk of result.studentKnowledges) {
    studentNameSet.add(sk.studentName)
  }
  result.students = Array.from(studentNameSet).map((name) => ({ name }))

  // 从 contests 提取比赛成绩（附加比赛名和日期）
  for (const contest of result.contests) {
    for (const r of contest.results) {
      result.contestResults.push({
        studentName: r.studentName,
        contestName: contest.contest.name,
        score: r.score,
        award: r.award,
        rank: r.rank,
        notes: r.notes,
        date: contest.contest.date,
        platform: contest.contest.platform,
        contestType: contest.contest.type,
      })
    }
  }

  return result
}

function parseRules(lines: string[], start: number, result: ParsedData): number {
  let i = start
  let currentName = ''
  let currentDescription = ''

  while (i < lines.length) {
    const line = lines[i].trim()
    if (line.startsWith('#') || line.startsWith('## ') || line.startsWith('### ')) {
      if (currentName) {
        result.rules.push({
          name: currentName,
          description: currentDescription.trim(),
        })
      }
      break
    }
    if (line.startsWith('- ')) {
      if (currentName) {
        result.rules.push({
          name: currentName,
          description: currentDescription.trim(),
        })
      }
      currentName = line.replace('- ', '').trim()
      currentDescription = ''
    } else if (line) {
      currentDescription += line + '\n'
    }
    i++
  }

  if (currentName) {
    result.rules.push({
      name: currentName,
      description: currentDescription.trim(),
    })
  }

  return i
}

function parseContests(lines: string[], start: number, result: ParsedData): number {
  let i = start
  let currentContest: ParsedContest['contest'] | null = null
  let currentResults: ParsedContest['results'] = []

  while (i < lines.length) {
    const { indent, content } = normalizeLine(lines[i])
    if (indent === 0 && (content.startsWith('#') || content.startsWith('## ') || content.startsWith('### '))) {
      if (currentContest) {
        result.contests.push({ contest: currentContest, results: currentResults })
      }
      break
    }

    if (indent === 0 && content.startsWith('- ')) {
      // New date/entry at top level
      if (currentContest) {
        result.contests.push({ contest: currentContest, results: currentResults })
      }
      currentContest = null
      currentResults = []

      const dateMatch = content.match(/^-\s*(\d{4}\/\d{1,2})\s*(.*)/)
      if (dateMatch) {
        const date = dateMatch[1].replace('/', '-')
        const rest = dateMatch[2]

        // Check if there's a platform info in the same line
        const platformMatch = rest.match(/(csp-j|csp-s|usaco|atcoder|gesp|noip)/i)
        const platform = platformMatch ? platformMatch[1].toLowerCase() : ''
        const isOffline = rest.includes('线下') || !rest.includes('线上')
        const type = isOffline ? 'offline' : 'online'

        currentContest = {
          name: rest.trim() || date,
          date,
          type,
          platform: platform || undefined,
          isTeam: false,
        }
      }
    } else if (indent === 2 && content.startsWith('- ')) {
      // Nested contest info: type, results, etc.
      if (!currentContest) {
        i++
        continue
      }
      const text = content.replace('- ', '').trim()

      // Contest type line: 线下赛csp-j, 线上赛usaco
      const typeMatch = text.match(/^(线上|线下)赛?(.+)/i)
      if (typeMatch) {
        currentContest.type = typeMatch[1] === '线上' ? 'online' : 'offline'
        const platformName = typeMatch[2].trim().toLowerCase()
        if (platformName) currentContest.platform = platformName
      }

      // Nested results list
      else if (text) {
        // Check if it's a result line with a student name
        // Look ahead for sub-items
        const j = i + 1
        let hasSubItems = false
        let subRank: number | undefined
        let subScore: number | undefined
        let subNotes = ''
        if (j < lines.length) {
          const nextLine = lines[j]
          const nextIndent = getIndentLevel(nextLine)
          const nextContent = nextLine.trim()
          if (nextIndent >= 4 && nextContent.startsWith('- ')) {
            hasSubItems = true
            // Parse sub-items
            let k = j
            while (k < lines.length) {
              const subLine = lines[k]
              const subLevel = getIndentLevel(subLine)
              const subText = subLine.trim()
              if (subLevel < 4) break
              if (subText.startsWith('- ')) {
                const item = subText.replace('- ', '').trim()
                if (item.includes('排名')) {
                  const rankMatch = item.match(/排名[：:]\s*(\d+)/)
                  if (rankMatch) subRank = parseInt(rankMatch[1])
                }
                if (item.includes('得分')) {
                  const scoreMatch = item.match(/得分[：:]\s*([\d\/]+)/)
                  if (scoreMatch) subNotes = scoreMatch[1]
                }
                if (item.includes('Rating')) {
                  const ratingMatch = item.match(/Rating[：:]\s*(\d+)/)
                  if (ratingMatch) subNotes += ` Rating: ${ratingMatch[1]}`
                }
                if (item.includes('排名')) {
                  const rankMatch = item.match(/排名[：:]\s*(\d+)/)
                  if (rankMatch) subNotes += ` Rank: ${rankMatch[1]}`
                }
              }
              k++
            }
            // We will skip sub-items in main loop
            i = k - 1
          }
        }

        const studentAwardMatch = text.match(/^(\S+)\s+(一等|二等|三等|金牌|银牌|铜牌|优秀奖|参与奖|一等奖|二等奖|三等奖|通过\d+级|\d+级)/)
        const studentScoreMatch = text.match(/^(\S+)\s+(\d+)(?!级)/)

        if (studentAwardMatch) {
          const studentName = studentAwardMatch[1].trim()
          const award = studentAwardMatch[2].trim()
          currentResults.push({ studentName, award, rank: subRank, notes: subNotes || undefined })
        } else if (studentScoreMatch) {
          const studentName = studentScoreMatch[1].trim()
          const score = parseInt(studentScoreMatch[2])
          currentResults.push({ studentName, score, rank: subRank, notes: subNotes || undefined })
        } else if (text) {
          // Could be a generic note or result line
          // Try to extract student name from simple format
          const simpleMatch = text.match(/^(\S+)(?:\s+(.+))?/)
          if (simpleMatch) {
            const studentName = simpleMatch[1]
            const rest = simpleMatch[2] || ''
            const resultItem: any = { studentName }
            if (rest && /^\d+$/.test(rest.trim())) {
              resultItem.score = parseInt(rest.trim())
            } else if (rest && /(一等|二等|三等|金牌|银牌|铜牌)/.test(rest)) {
              resultItem.award = rest.trim()
            } else if (rest) {
              resultItem.notes = rest
            }
            if (subRank) resultItem.rank = subRank
            if (subNotes) {
              if (resultItem.notes) {
                resultItem.notes += ' ' + subNotes
              } else {
                resultItem.notes = subNotes
              }
            }
            if (Object.keys(resultItem).length > 1 || !hasSubItems) {
              currentResults.push(resultItem)
            }
          }
        }
      }
    }

    i++
  }

  if (currentContest) {
    result.contests.push({ contest: currentContest, results: currentResults })
  }

  return i
}

function parseKnowledgePoints(lines: string[], start: number, result: ParsedData): number {
  let i = start
  let currentLevel = 0
  let currentLevelAlias = ''
  let currentCategory = ''

  while (i < lines.length) {
    const { indent, content } = normalizeLine(lines[i])
    if (indent === 0 && content.startsWith('###')) {
      break
    }
    if (content.startsWith('###')) {
      break
    }

    if (indent === 0 && content.startsWith('- ')) {
      const header = content.replace('- ', '').trim()
      // Match: 3(csp-j)(gesp 5级、6级)
      const match = header.match(/^(\d+)\s*\(\s*([^)]+)\s*\)(?:\s*\(\s*([^)]+)\s*\))?/)
      if (match) {
        currentLevel = parseInt(match[1])
        currentLevelAlias = match[2].trim().toUpperCase()
        currentCategory = match[3] ? match[3].trim() : ''
      }
    } else if (indent === 2 && content.startsWith('- ') && currentLevel > 0) {
      const name = content.replace('- ', '').trim()
      if (name) {
        result.knowledgePoints.push({
          name,
          level: currentLevel,
          levelAlias: currentLevelAlias,
          category: currentCategory || 'general',
          description: undefined,
          prerequisites: undefined,
        })
      }
    }

    i++
  }

  return i
}

function parseAnnouncements(lines: string[], start: number, result: ParsedData): number {
  let i = start
  let currentTitle = ''
  let currentContent = ''

  while (i < lines.length) {
    const { indent, content } = normalizeLine(lines[i])
    if (indent === 0 && content.startsWith('###')) {
      if (currentTitle) {
        result.announcements.push({
          title: currentTitle,
          content: currentContent.trim(),
          category: 'general',
          isPublic: true,
        })
      }
      break
    }

    if (indent === 0 && content.startsWith('- ')) {
      if (currentTitle) {
        result.announcements.push({
          title: currentTitle,
          content: currentContent.trim(),
          category: 'general',
          isPublic: true,
        })
      }
      currentTitle = content.replace('- ', '').trim()
      currentContent = ''
    } else if (indent >= 2 && currentTitle) {
      currentContent += content + '\n'
    } else if (content && currentTitle) {
      currentContent += content + '\n'
    }

    i++
  }

  if (currentTitle) {
    result.announcements.push({
      title: currentTitle,
      content: currentContent.trim(),
      category: 'general',
      isPublic: true,
    })
  }

  return i
}

function parseSchedules(lines: string[], start: number, result: ParsedData): number {
  let i = start

  while (i < lines.length) {
    const { indent, content } = normalizeLine(lines[i])
    if (indent === 0 && content.startsWith('###')) {
      break
    }

    if (content.startsWith('- ')) {
      const text = content.replace('- ', '').trim()
      // Match: 周一 14:00-16:00 或 周一 14:00-16:00 备注
      const match = text.match(/^(\S+?)\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})(?:\s+(.+))?/)
      if (match) {
        result.schedules.push({
          day: match[1],
          startTime: match[2],
          endTime: match[3],
          note: match[4] || undefined,
          isActive: true,
        })
      }
    }

    i++
  }

  return i
}

function parseStudentKnowledges(lines: string[], start: number, result: ParsedData): number {
  let i = start
  let currentStudent = ''
  let currentItems: { name: string; certifiedAt: string }[] = []

  while (i < lines.length) {
    const { indent, content } = normalizeLine(lines[i])
    if (indent === 0 && content.startsWith('###')) {
      if (currentStudent) {
        result.studentKnowledges.push({ studentName: currentStudent, items: currentItems })
      }
      break
    }

    if (indent === 0 && content.startsWith('- ')) {
      if (currentStudent) {
        result.studentKnowledges.push({ studentName: currentStudent, items: currentItems })
      }
      currentStudent = content.replace('- ', '').trim()
      currentItems = []
    } else if (indent >= 2 && content.startsWith('- ') && currentStudent) {
      const item = content.replace('- ', '').trim()
      // Match: 匈牙利算法 202603
      const match = item.match(/^(.+?)\s+(\d{6})\s*$/)
      if (match) {
        currentItems.push({ name: match[1].trim(), certifiedAt: match[2] })
      }
    }

    i++
  }

  if (currentStudent) {
    result.studentKnowledges.push({ studentName: currentStudent, items: currentItems })
  }

  return i
}

function parseTasks(lines: string[], start: number, result: ParsedData): number {
  let i = start

  while (i < lines.length) {
    const { indent, content } = normalizeLine(lines[i])
    if (indent === 0 && content.startsWith('###')) {
      break
    }

    if (content.startsWith('- ')) {
      const text = content.replace('- ', '').trim()
      if (text.startsWith('[x]')) {
        result.tasks.push({
          title: text.replace('[x]', '').trim(),
          status: 'completed',
        })
      } else if (text.startsWith('[ ]')) {
        result.tasks.push({
          title: text.replace('[ ]', '').trim(),
          status: 'pending',
        })
      }
    }

    i++
  }

  return i
}
