export const fallbackContests = [
  { id: 'c1', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2026-06', description: '入门级认证', isTeam: false, createdAt: new Date().toISOString() },
  { id: 'c2', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-06', description: '美国计算机奥林匹克', isTeam: false, createdAt: new Date().toISOString() },
  { id: 'c3', name: 'AtCoder', type: 'online', platform: 'AtCoder', date: '2026-06', description: 'AtCoder Beginner Contest', isTeam: false, createdAt: new Date().toISOString() },
  { id: 'c4', name: 'YACS', type: 'offline', platform: 'YACS', date: '2026-06', description: '青少年算法竞赛', isTeam: false, createdAt: new Date().toISOString() },
]

export const fallbackTasks = [
  { id: 't1', studentId: 'student-1', title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论', priority: 'normal', createdAt: new Date().toISOString(), student: { id: 'student-1', name: '马天成', displayName: '马天成', avatarUrl: '/avatars/1.png', bio: '热爱算法，擅长图论', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
  { id: 't2', studentId: 'student-2', title: '状压DP练习 1102', status: 'pending', category: 'DP', priority: 'normal', createdAt: new Date().toISOString(), student: { id: 'student-2', name: '党皓天', displayName: '党皓天', avatarUrl: '/avatars/2.png', bio: '逻辑思维强', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
  { id: 't3', studentId: 'student-3', title: '线段树模板题', status: 'completed', category: '数据结构', priority: 'normal', createdAt: new Date().toISOString(), student: { id: 'student-3', name: '陆臻', displayName: '陆臻', avatarUrl: '/avatars/3.png', bio: '稳扎稳打', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
  { id: 't4', studentId: 'student-4', title: 'Tarjan求强连通分量', status: 'pending', category: '图论', priority: 'normal', createdAt: new Date().toISOString(), student: { id: 'student-4', name: '张赫桐', displayName: '张赫桐', avatarUrl: '/avatars/4.png', bio: '进步明显', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } },
]

export const fallbackStudents = [
  { id: 'student-1', name: '马天成', displayName: '马天成', avatarUrl: '/avatars/1.png', bio: '热爱算法，擅长图论', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'student-2', name: '党皓天', displayName: '党皓天', avatarUrl: '/avatars/2.png', bio: '逻辑思维强', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'student-3', name: '陆臻', displayName: '陆臻', avatarUrl: '/avatars/3.png', bio: '稳扎稳打', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'student-4', name: '张赫桐', displayName: '张赫桐', avatarUrl: '/avatars/4.png', bio: '进步明显', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export const fallbackKnowledgePoints = [
  { id: 'k1', name: '排序算法', level: 1, levelAlias: 'CSP-J', category: '基础算法', description: '冒泡、选择、插入、快速排序', prerequisites: '数组基础', createdAt: new Date().toISOString() },
  { id: 'k2', name: '二分查找', level: 1, levelAlias: 'CSP-J', category: '基础算法', description: '有序数组二分查找', prerequisites: '排序算法', createdAt: new Date().toISOString() },
  { id: 'k3', name: '深度优先搜索', level: 2, levelAlias: 'CSP-S', category: '搜索', description: 'DFS基础与应用', prerequisites: '递归基础', createdAt: new Date().toISOString() },
  { id: 'k4', name: '动态规划', level: 3, levelAlias: 'NOIP', category: 'DP', description: '线性DP、区间DP', prerequisites: '递归基础,DFS', createdAt: new Date().toISOString() },
  { id: 'k5', name: '线段树', level: 4, levelAlias: '省选', category: '数据结构', description: '区间查询与修改', prerequisites: '二叉树,递归', createdAt: new Date().toISOString() },
]

export const fallbackAnnouncements = [
  { id: 'a1', title: '6月表现', content: '6月学生的表现都不错', category: 'home-school', date: '2026-06', isPublic: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export const fallbackSchedules = [
  { id: 's1', day: '周三', startTime: '18:20', endTime: '20:00', isActive: true },
  { id: 's2', day: '周五', startTime: '15:50', endTime: '19:00', isActive: true },
  { id: 's3', day: '周日', startTime: '09:00', endTime: '12:00', note: '目前都是亏损状态(作业都还有欠着没完成的)，所以都建议有空来讨论完成', isActive: true },
]

export const fallbackLinks = [
  { id: 'l1', name: 'USACO', url: 'https://usaco.org/', category: 'platform', icon: '🌐', sortOrder: 1 },
  { id: 'l2', name: 'YACS', url: 'https://www.iai.sh.cn/', category: 'platform', icon: '📚', sortOrder: 2 },
  { id: 'l3', name: 'HydroOJ', url: 'https://hydro.ac/', category: 'platform', icon: '💧', sortOrder: 3 },
  { id: 'l4', name: 'AtCoder', url: 'https://atcoder.jp/', category: 'platform', icon: '⚡', sortOrder: 4 },
]
