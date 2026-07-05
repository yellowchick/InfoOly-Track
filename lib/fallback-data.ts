import { Contest, Student, Task, KnowledgePoint, StudentContestResult } from '@/types'
import { studentsSeedData } from './student-data'

// Extract all unique contests from student data
export const fallbackContests: (Contest & { results: (StudentContestResult & { student: Student })[] })[] = [
  {
    id: 'c1', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2024-10',
    description: '入门级认证', isTeam: false,
    results: [
      { id: 'cr1', studentId: 'student-1', contestId: 'c1', award: '二等奖', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr2', studentId: 'student-2', contestId: 'c1', award: '一等奖', student: { id: 'student-2', name: '党皓天', displayName: '党皓天', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr3', studentId: 'student-3', contestId: 'c1', award: '二等奖', student: { id: 'student-3', name: '陆臻', displayName: '陆臻', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c2', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2025-10',
    description: '入门级认证', isTeam: false,
    results: [
      { id: 'cr4', studentId: 'student-1', contestId: 'c2', award: '一等奖', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr5', studentId: 'student-2', contestId: 'c2', award: '二等奖', student: { id: 'student-2', name: '党皓天', displayName: '党皓天', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr6', studentId: 'student-4', contestId: 'c2', award: '二等奖', student: { id: 'student-4', name: '张赫桐', displayName: '张赫桐', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c3', name: 'CSP-S', type: 'offline', platform: 'CCF', date: '2025-10',
    description: '提高级认证', isTeam: false,
    results: [
      { id: 'cr7', studentId: 'student-1', contestId: 'c3', award: '二等奖', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c4', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-01',
    description: '美国计算机奥林匹克竞赛', isTeam: false,
    results: [
      { id: 'cr8', studentId: 'student-1', contestId: 'c4', award: '铜升银', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr9', studentId: 'student-2', contestId: 'c4', award: '铜升银', student: { id: 'student-2', name: '党皓天', displayName: '党皓天', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr10', studentId: 'student-3', contestId: 'c4', award: '铜升银', student: { id: 'student-3', name: '陆臻', displayName: '陆臻', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c5', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-02',
    description: '美国计算机奥林匹克竞赛', isTeam: false,
    results: [
      { id: 'cr11', studentId: 'student-1', contestId: 'c5', award: '银升金', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c6', name: 'YACS月赛乙组', type: 'online', platform: 'YACS', date: '2026-05',
    description: '乙组总分400（自限：时间减半90mins/180mins）', totalScore: 400, timeLimit: '90mins/180mins', isTeam: false,
    results: [
      { id: 'cr12', studentId: 'student-1', contestId: 'c6', score: 280, student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr13', studentId: 'student-2', contestId: 'c6', score: 270, student: { id: 'student-2', name: '党皓天', displayName: '党皓天', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr14', studentId: 'student-4', contestId: 'c6', score: 30, student: { id: 'student-4', name: '张赫桐', displayName: '张赫桐', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c7', name: 'YACS月赛甲组', type: 'online', platform: 'YACS', date: '2026-05',
    description: '甲组总分300（自限：时间缩减120mins/210mins）', totalScore: 300, timeLimit: '120mins/210mins', isTeam: false,
    results: [
      { id: 'cr15', studentId: 'student-2', contestId: 'c7', score: 65, student: { id: 'student-2', name: '党皓天', displayName: '党皓天', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr16', studentId: 'student-1', contestId: 'c7', score: 10, student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
      { id: 'cr17', studentId: 'student-3', contestId: 'c7', score: 100, student: { id: 'student-3', name: '陆臻', displayName: '陆臻', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c8', name: 'AtCoder ABC460', type: 'online', platform: 'AtCoder', date: '2026-05',
    description: 'AtCoder Beginner Contest 460', isTeam: false,
    results: [
      { id: 'cr18', studentId: 'student-1', contestId: 'c8', score: 1650, rank: 366, atcoderRank: 23870, atcoderRating: 731, notes: 'Rank总排名51225->23870，Rating积分186->731', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c9', name: 'AtCoder ABC462', type: 'online', platform: 'AtCoder', date: '2026-06',
    description: 'AtCoder Beginner Contest 462', isTeam: false,
    results: [
      { id: 'cr19', studentId: 'student-1', contestId: 'c9', score: 1450, rank: 2289, atcoderRank: 20148, atcoderRating: 838, notes: 'Rank总排名23870->20148，Rating积分731->838', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
  {
    id: 'c10', name: 'AtCoder ABC463', type: 'online', platform: 'AtCoder', date: '2026-06',
    description: 'AtCoder Beginner Contest 463', isTeam: false,
    results: [
      { id: 'cr20', studentId: 'student-1', contestId: 'c10', score: 1450, rank: 1133, atcoderRank: 15426, atcoderRating: 991, notes: 'Rank总排名20148->15426，Rating积分838->991', student: { id: 'student-1', name: '马天成', displayName: '马天成', createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z' } },
    ]
  },
]

// Extract all tasks from student data with student info
export const fallbackTasks: (Task & { student: Student })[] = studentsSeedData.flatMap(s =>
  s.tasks.map(t => ({
    ...t,
    student: {
      id: s.id,
      name: s.name,
      displayName: s.displayName,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }
  }))
)

// Extract all students for task page fallback
export const fallbackStudents: Student[] = studentsSeedData.map(({ contestResults, knowledges, tasks, ...student }) => student)

// Fallback knowledge points (all knowledge points in the system)
export const fallbackKnowledgePoints: (KnowledgePoint & { students: { id: string; studentId: string; knowledgePointId: string; certifiedAt: string; status: string; student: Student }[] })[] = [
  // Level 3
  { id: 'kp1', name: 'set数据结构运用', level: 3, levelAlias: 'CSP-J', category: '数据结构', students: [
    { id: 'sk24', studentId: 'student-4', knowledgePointId: 'kp1', certifiedAt: '202603', status: 'certified', student: fallbackStudents[3] }
  ]},
  { id: 'kp2', name: '快速幂', level: 3, levelAlias: 'CSP-J', category: '数学', students: [] },
  { id: 'kp3', name: '并查集', level: 3, levelAlias: 'CSP-J', category: '数据结构', students: [] },
  { id: 'kp4', name: '基础dp', level: 3, levelAlias: 'CSP-J', category: '动态规划', students: [] },
  { id: 'kp5', name: '二分答案', level: 3, levelAlias: 'CSP-J', category: '算法', students: [] },
  { id: 'kp6', name: '质数判断拓展', level: 3, levelAlias: 'CSP-J', category: '数学', students: [] },
  // Level 4
  { id: 'kp7', name: '树建模，邻接表结构', level: 4, levelAlias: 'GESP 7级', category: '数据结构', students: [] },
  { id: 'kp8', name: '分治法(归并)', level: 4, levelAlias: 'GESP 7级', category: '算法', students: [] },
  { id: 'kp9', name: '最小生成树MST', level: 4, levelAlias: 'GESP 7级', category: '图论', students: [
    { id: 'sk25', studentId: 'student-4', knowledgePointId: 'kp9', certifiedAt: '202603', status: 'certified', student: fallbackStudents[3] }
  ]},
  { id: 'kp10', name: '双指针/双游标', level: 4, levelAlias: 'GESP 7级', category: '算法', students: [] },
  { id: 'kp11', name: '树形DP', level: 4, levelAlias: 'GESP 7级', category: '动态规划', students: [] },
  { id: 'kp12', name: 'Floyd', level: 4, levelAlias: 'GESP 7级', category: '图论', students: [
    { id: 'sk8', studentId: 'student-1', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk17', studentId: 'student-2', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', student: fallbackStudents[1] },
    { id: 'sk22', studentId: 'student-3', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', student: fallbackStudents[2] },
    { id: 'sk30', studentId: 'student-4', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', student: fallbackStudents[3] },
  ]},
  { id: 'kp13', name: 'Dijkstra', level: 4, levelAlias: 'GESP 7级', category: '图论', students: [
    { id: 'sk9', studentId: 'student-1', knowledgePointId: 'kp13', certifiedAt: '202605', status: 'certified', student: fallbackStudents[0] }
  ]},
  { id: 'kp14', name: 'Bellman-Ford', level: 4, levelAlias: 'GESP 7级', category: '图论', students: [] },
  // Level 5
  { id: 'kp15', name: '匈牙利算法', level: 5, levelAlias: 'CSP-S', category: '图论', students: [
    { id: 'sk1', studentId: 'student-1', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk10', studentId: 'student-2', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', student: fallbackStudents[1] },
    { id: 'sk18', studentId: 'student-3', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', student: fallbackStudents[2] },
    { id: 'sk23', studentId: 'student-4', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', student: fallbackStudents[3] },
  ]},
  { id: 'kp16', name: '堆优化Dijkstra', level: 5, levelAlias: 'CSP-S', category: '图论', students: [] },
  { id: 'kp17', name: '树换根', level: 5, levelAlias: 'CSP-S', category: '图论', students: [] },
  { id: 'kp18', name: '朴素分块', level: 5, levelAlias: 'CSP-S', category: '数据结构', students: [
    { id: 'sk4', studentId: 'student-1', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk13', studentId: 'student-2', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', student: fallbackStudents[1] },
    { id: 'sk19', studentId: 'student-3', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', student: fallbackStudents[2] },
    { id: 'sk26', studentId: 'student-4', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', student: fallbackStudents[3] },
  ]},
  { id: 'kp19', name: '树状数组BIT', level: 5, levelAlias: 'CSP-S', category: '数据结构', students: [] },
  { id: 'kp20', name: '树建模序列化', level: 5, levelAlias: 'CSP-S', category: '数据结构', students: [] },
  { id: 'kp21', name: '莫队模板', level: 5, levelAlias: 'CSP-S', category: '数据结构', students: [
    { id: 'sk5', studentId: 'student-1', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk14', studentId: 'student-2', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', student: fallbackStudents[1] },
    { id: 'sk20', studentId: 'student-3', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', student: fallbackStudents[2] },
    { id: 'sk27', studentId: 'student-4', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', student: fallbackStudents[3] },
  ]},
  { id: 'kp22', name: '按位贪心', level: 5, levelAlias: 'CSP-S', category: '算法', students: [
    { id: 'sk6', studentId: 'student-1', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk15', studentId: 'student-2', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', student: fallbackStudents[1] },
    { id: 'sk21', studentId: 'student-3', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', student: fallbackStudents[2] },
    { id: 'sk28', studentId: 'student-4', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', student: fallbackStudents[3] },
  ]},
  { id: 'kp23', name: '逆元组合数', level: 5, levelAlias: 'CSP-S', category: '数学', students: [] },
  { id: 'kp24', name: '状压DP', level: 5, levelAlias: 'CSP-S', category: '动态规划', students: [
    { id: 'sk7', studentId: 'student-1', knowledgePointId: 'kp24', certifiedAt: '202605', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk16', studentId: 'student-2', knowledgePointId: 'kp24', certifiedAt: '202605', status: 'certified', student: fallbackStudents[1] },
    { id: 'sk29', studentId: 'student-4', knowledgePointId: 'kp24', certifiedAt: '202605', status: 'certified', student: fallbackStudents[3] },
  ]},
  { id: 'kp25', name: '超大背包', level: 5, levelAlias: 'CSP-S', category: '动态规划', students: [] },
  // Level 6
  { id: 'kp26', name: '带权二分图匹配KM算法', level: 6, levelAlias: 'USACO金', category: '图论', students: [
    { id: 'sk3', studentId: 'student-1', knowledgePointId: 'kp26', certifiedAt: '202603', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk12', studentId: 'student-2', knowledgePointId: 'kp26', certifiedAt: '202603', status: 'certified', student: fallbackStudents[1] },
  ]},
  { id: 'kp27', name: '二分图最小点覆盖', level: 6, levelAlias: 'USACO金', category: '图论', students: [] },
  { id: 'kp28', name: '分块进阶', level: 6, levelAlias: 'USACO金', category: '数据结构', students: [] },
  { id: 'kp29', name: '数学期望、概率', level: 6, levelAlias: 'USACO金', category: '数学', students: [] },
  // Level 7
  { id: 'kp30', name: 'HK算法', level: 7, levelAlias: '省选', category: '图论', students: [
    { id: 'sk2', studentId: 'student-1', knowledgePointId: 'kp30', certifiedAt: '202603', status: 'certified', student: fallbackStudents[0] },
    { id: 'sk11', studentId: 'student-2', knowledgePointId: 'kp30', certifiedAt: '202603', status: 'certified', student: fallbackStudents[1] },
  ]},
  { id: 'kp31', name: '莫队+位运算', level: 7, levelAlias: '省选', category: '数据结构', students: [] },
  { id: 'kp32', name: '莫队+差分', level: 7, levelAlias: '省选', category: '数据结构', students: [] },
]
