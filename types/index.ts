export interface Student {
  id: string
  name: string
  displayName: string
  avatarUrl?: string
  bio?: string
  createdAt: string
  updatedAt: string
}

export interface Contest {
  id: string
  name: string
  type: string
  platform?: string
  date: string
  description?: string
  totalScore?: number
  timeLimit?: string
  isTeam: boolean
}

export interface StudentContestResult {
  id: string
  studentId: string
  contestId: string
  award?: string
  score?: number
  rank?: number
  atcoderRank?: number
  atcoderRating?: number
  notes?: string
  student?: Student
  contest?: Contest
}

export interface KnowledgePoint {
  id: string
  name: string
  level: number
  levelAlias: string
  category: string
  description?: string
  prerequisites?: string
}

export interface StudentKnowledge {
  id: string
  studentId: string
  knowledgePointId: string
  certifiedAt: string
  status: string
  notes?: string
  knowledgePoint?: KnowledgePoint
}

export interface Task {
  id: string
  studentId: string
  title: string
  category?: string
  problemIds?: string
  status: string
  priority: string
  dueDate?: string
  completedAt?: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  category: string
  date?: string
  isPublic: boolean
}

export interface Schedule {
  id: string
  day: string
  startTime: string
  endTime: string
  note?: string
  isActive: boolean
}

export interface ExternalLink {
  id: string
  name: string
  url: string
  category: string
  icon?: string
  sortOrder: number
}

export interface Rule {
  id: string
  name: string
  description: string
  features?: string
  examples?: string
  sortOrder?: number
}

export interface StudentProfile extends Student {
  contestResults: (StudentContestResult & { contest: Contest })[]
  knowledges: (StudentKnowledge & { knowledgePoint: KnowledgePoint })[]
  tasks: Task[]
}

export interface TimelineItem {
  id: string
  date: string
  type: 'contest' | 'knowledge' | 'task' | 'announcement'
  title: string
  description: string
  status?: string
  badge?: string
}
