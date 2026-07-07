import { StudentProfile, Student } from '@/types'

export const studentsSeedData: StudentProfile[] = [
  {
    id: 'student-1',
    name: '马天成',
    displayName: '马天成',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    contestResults: [
      { id: 'cr1', studentId: 'student-1', contestId: 'c1', award: '二等奖', contest: { id: 'c1', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2024-10', description: '入门级认证', isTeam: false } },
      { id: 'cr2', studentId: 'student-1', contestId: 'c2', award: '一等奖', contest: { id: 'c2', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2025-10', description: '入门级认证', isTeam: false } },
      { id: 'cr3', studentId: 'student-1', contestId: 'c3', award: '二等奖', contest: { id: 'c3', name: 'CSP-S', type: 'offline', platform: 'CCF', date: '2025-10', description: '提高级认证', isTeam: false } },
      { id: 'cr4', studentId: 'student-1', contestId: 'c4', award: '铜升银', contest: { id: 'c4', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-01', description: '美国计算机奥林匹克竞赛', isTeam: false } },
      { id: 'cr5', studentId: 'student-1', contestId: 'c5', award: '银升金', contest: { id: 'c5', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-02', description: '美国计算机奥林匹克竞赛', isTeam: false } },
      { id: 'cr6', studentId: 'student-1', contestId: 'c6', score: 280, contest: { id: 'c6', name: 'YACS月赛乙组', type: 'online', platform: 'YACS', date: '2026-05', description: '乙组总分400（自限：时间减半90mins/180mins）', totalScore: 400, timeLimit: '90mins/180mins', isTeam: false } },
      { id: 'cr7', studentId: 'student-1', contestId: 'c7', score: 10, contest: { id: 'c7', name: 'YACS月赛甲组', type: 'online', platform: 'YACS', date: '2026-05', description: '甲组总分300（自限：时间缩减120mins/210mins）', totalScore: 300, timeLimit: '120mins/210mins', isTeam: false } },
      { id: 'cr8', studentId: 'student-1', contestId: 'c8', score: 1650, rank: 366, atcoderRank: 23870, atcoderRating: 731, notes: 'Rank总排名51225->23870，Rating积分186->731', contest: { id: 'c8', name: 'AtCoder ABC460', type: 'online', platform: 'AtCoder', date: '2026-05', description: 'AtCoder Beginner Contest 460', isTeam: false } },
      { id: 'cr9', studentId: 'student-1', contestId: 'c9', score: 1450, rank: 2289, atcoderRank: 20148, atcoderRating: 838, notes: 'Rank总排名23870->20148，Rating积分731->838', contest: { id: 'c9', name: 'AtCoder ABC462', type: 'online', platform: 'AtCoder', date: '2026-06', description: 'AtCoder Beginner Contest 462', isTeam: false } },
      { id: 'cr10', studentId: 'student-1', contestId: 'c10', score: 1450, rank: 1133, atcoderRank: 15426, atcoderRating: 991, notes: 'Rank总排名20148->15426，Rating积分838->991', contest: { id: 'c10', name: 'AtCoder ABC463', type: 'online', platform: 'AtCoder', date: '2026-06', description: 'AtCoder Beginner Contest 463', isTeam: false } },
    ],
    knowledges: [
      { id: 'sk1', studentId: 'student-1', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp15', name: '匈牙利算法', level: 5, levelAlias: 'CSP-S', category: '图论' } },
      { id: 'sk2', studentId: 'student-1', knowledgePointId: 'kp29', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp29', name: 'HK算法', level: 7, levelAlias: '省选', category: '图论' } },
      { id: 'sk3', studentId: 'student-1', knowledgePointId: 'kp25', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp25', name: '带权二分图匹配KM算法', level: 6, levelAlias: 'USACO金', category: '图论' } },
      { id: 'sk4', studentId: 'student-1', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp18', name: '朴素分块', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk5', studentId: 'student-1', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp21', name: '莫队模板', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk6', studentId: 'student-1', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp22', name: '按位贪心', level: 5, levelAlias: 'CSP-S', category: '算法' } },
      { id: 'sk7', studentId: 'student-1', knowledgePointId: 'kp24', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp24', name: '状压DP', level: 5, levelAlias: 'CSP-S', category: '动态规划' } },
      { id: 'sk8', studentId: 'student-1', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp12', name: 'Floyd', level: 4, levelAlias: 'GESP 7级', category: '图论' } },
      { id: 'sk9', studentId: 'student-1', knowledgePointId: 'kp13', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp13', name: 'Dijkstra', level: 4, levelAlias: 'GESP 7级', category: '图论' } },
    ],
    tasks: [
      { id: 't1', studentId: 'student-1', title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't2', studentId: 'student-1', title: 'HK算法自主精研代码', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't41', studentId: 'student-1', title: '带权二分图匹配KM算法 TR04', status: 'pending', category: '图论', priority: 'normal' },
      { id: 't3', studentId: 'student-1', title: '朴素分块 TR17', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't42', studentId: 'student-1', title: '分块进阶 TR08,TR09,TR10', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't4', studentId: 'student-1', title: '贪心练习 NOIP01', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't43', studentId: 'student-1', title: '分块+同余优化+O2优化 TR12', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't44', studentId: 'student-1', title: '分块+离线处理+优化 TR14', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't36', studentId: 'student-1', title: '贪心练习 NOIP05', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't37', studentId: 'student-1', title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't5', studentId: 'student-1', title: '双指针优化练习+组合数逆元 NOIP02', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't6', studentId: 'student-1', title: '莫队模板题 TR18', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't38', studentId: 'student-1', title: '按位贪心 2461', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't45', studentId: 'student-1', title: 'DP陷阱题 2170', status: 'pending', category: '动态规划', priority: 'normal' },
      { id: 't46', studentId: 'student-1', title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't47', studentId: 'student-1', title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't7', studentId: 'student-1', title: '状压DP练习 1102', status: 'completed', category: '动态规划', priority: 'normal' },
      { id: 't48', studentId: 'student-1', title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't8', studentId: 'student-1', title: 'yacs五月乙组', status: 'completed', category: '比赛', priority: 'normal' },
      { id: 't39', studentId: 'student-1', title: 'yacs五月甲组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't49', studentId: 'student-1', title: '莫队进阶题 TR19', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't50', studentId: 'student-1', title: 'Bitset+莫队 TR20', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't51', studentId: 'student-1', title: 'yacs六月乙组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't52', studentId: 'student-1', title: 'yacs六月甲组', status: 'pending', category: '比赛', priority: 'normal' },
    ],
  },
  {
    id: 'student-2',
    name: '党皓天',
    displayName: '党皓天',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    contestResults: [
      { id: 'cr11', studentId: 'student-2', contestId: 'c1', award: '一等奖', contest: { id: 'c1', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2024-10', description: '入门级认证', isTeam: false } },
      { id: 'cr12', studentId: 'student-2', contestId: 'c2', award: '二等奖', contest: { id: 'c2', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2025-10', description: '入门级认证', isTeam: false } },
      { id: 'cr13', studentId: 'student-2', contestId: 'c4', award: '铜升银', contest: { id: 'c4', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-01', description: '美国计算机奥林匹克竞赛', isTeam: false } },
      { id: 'cr14', studentId: 'student-2', contestId: 'c6', score: 270, contest: { id: 'c6', name: 'YACS月赛乙组', type: 'online', platform: 'YACS', date: '2026-05', description: '乙组总分400（自限：时间减半90mins/180mins）', totalScore: 400, timeLimit: '90mins/180mins', isTeam: false } },
      { id: 'cr15', studentId: 'student-2', contestId: 'c7', score: 65, contest: { id: 'c7', name: 'YACS月赛甲组', type: 'online', platform: 'YACS', date: '2026-05', description: '甲组总分300（自限：时间缩减120mins/210mins）', totalScore: 300, timeLimit: '120mins/210mins', isTeam: false } },
    ],
    knowledges: [
      { id: 'sk10', studentId: 'student-2', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp15', name: '匈牙利算法', level: 5, levelAlias: 'CSP-S', category: '图论' } },
      { id: 'sk11', studentId: 'student-2', knowledgePointId: 'kp29', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp29', name: 'HK算法', level: 7, levelAlias: '省选', category: '图论' } },
      { id: 'sk12', studentId: 'student-2', knowledgePointId: 'kp25', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp25', name: '带权二分图匹配KM算法', level: 6, levelAlias: 'USACO金', category: '图论' } },
      { id: 'sk13', studentId: 'student-2', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp18', name: '朴素分块', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk14', studentId: 'student-2', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp21', name: '莫队模板', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk15', studentId: 'student-2', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp22', name: '按位贪心', level: 5, levelAlias: 'CSP-S', category: '算法' } },
      { id: 'sk16', studentId: 'student-2', knowledgePointId: 'kp24', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp24', name: '状压DP', level: 5, levelAlias: 'CSP-S', category: '动态规划' } },
      { id: 'sk17', studentId: 'student-2', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp12', name: 'Floyd', level: 4, levelAlias: 'GESP 7级', category: '图论' } },
    ],
    tasks: [
      { id: 't9', studentId: 'student-2', title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't10', studentId: 'student-2', title: 'HK算法自主精研代码', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't11', studentId: 'student-2', title: '带权二分图匹配KM算法 TR04', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't12', studentId: 'student-2', title: '朴素分块 TR17', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't13', studentId: 'student-2', title: '分块进阶 TR08,TR09,TR10', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't14', studentId: 'student-2', title: '贪心练习 NOIP01', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't15', studentId: 'student-2', title: '分块+同余优化+O2优化 TR12', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't53', studentId: 'student-2', title: '分块+离线处理+优化 TR14', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't54', studentId: 'student-2', title: '贪心练习 NOIP05', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't55', studentId: 'student-2', title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't56', studentId: 'student-2', title: '双指针优化练习+组合数逆元 NOIP02', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't16', studentId: 'student-2', title: '莫队模板题 TR18', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't17', studentId: 'student-2', title: '按位贪心 2461', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't57', studentId: 'student-2', title: 'DP陷阱题 2170', status: 'pending', category: '动态规划', priority: 'normal' },
      { id: 't58', studentId: 'student-2', title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't59', studentId: 'student-2', title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't18', studentId: 'student-2', title: '状压DP练习 1102', status: 'completed', category: '动态规划', priority: 'normal' },
      { id: 't60', studentId: 'student-2', title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't19', studentId: 'student-2', title: 'yacs五月乙组', status: 'completed', category: '比赛', priority: 'normal' },
      { id: 't40', studentId: 'student-2', title: 'yacs五月甲组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't61', studentId: 'student-2', title: '莫队进阶题 TR19', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't62', studentId: 'student-2', title: 'Bitset+莫队 TR20', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't63', studentId: 'student-2', title: 'yacs六月乙组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't64', studentId: 'student-2', title: 'yacs六月甲组', status: 'pending', category: '比赛', priority: 'normal' },
    ],
  },
  {
    id: 'student-3',
    name: '陆臻',
    displayName: '陆臻',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    contestResults: [
      { id: 'cr16', studentId: 'student-3', contestId: 'c1', award: '二等奖', contest: { id: 'c1', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2024-10', description: '入门级认证', isTeam: false } },
      { id: 'cr17', studentId: 'student-3', contestId: 'c4', award: '铜升银', contest: { id: 'c4', name: 'USACO', type: 'online', platform: 'USACO', date: '2026-01', description: '美国计算机奥林匹克竞赛', isTeam: false } },
      { id: 'cr18', studentId: 'student-3', contestId: 'c7', score: 100, contest: { id: 'c7', name: 'YACS月赛甲组', type: 'online', platform: 'YACS', date: '2026-05', description: '甲组总分300（自限：时间缩减120mins/210mins）', totalScore: 300, timeLimit: '120mins/210mins', isTeam: false } },
    ],
    knowledges: [
      { id: 'sk18', studentId: 'student-3', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp15', name: '匈牙利算法', level: 5, levelAlias: 'CSP-S', category: '图论' } },
      { id: 'sk19', studentId: 'student-3', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp18', name: '朴素分块', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk20', studentId: 'student-3', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp21', name: '莫队模板', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk21', studentId: 'student-3', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp22', name: '按位贪心', level: 5, levelAlias: 'CSP-S', category: '算法' } },
      { id: 'sk22', studentId: 'student-3', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp12', name: 'Floyd', level: 4, levelAlias: 'GESP 7级', category: '图论' } },
    ],
    tasks: [
      { id: 't20', studentId: 'student-3', title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't21', studentId: 'student-3', title: '朴素分块 TR17', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't22', studentId: 'student-3', title: '贪心练习 NOIP01', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't23', studentId: 'student-3', title: '贪心练习 NOIP05', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't65', studentId: 'student-3', title: '双指针优化练习+组合数逆元 NOIP02', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't66', studentId: 'student-3', title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't67', studentId: 'student-3', title: '莫队模板题 TR18', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't68', studentId: 'student-3', title: '按位贪心 2461', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't69', studentId: 'student-3', title: 'DP陷阱题 2170', status: 'pending', category: '动态规划', priority: 'normal' },
      { id: 't70', studentId: 'student-3', title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't71', studentId: 'student-3', title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't72', studentId: 'student-3', title: '状压DP练习 1102', status: 'pending', category: '动态规划', priority: 'normal' },
      { id: 't73', studentId: 'student-3', title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't74', studentId: 'student-3', title: 'yacs五月乙组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't75', studentId: 'student-3', title: 'yacs五月甲组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't76', studentId: 'student-3', title: '莫队进阶题 TR19', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't24', studentId: 'student-3', title: 'Bitset+莫队 TR20', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't77', studentId: 'student-3', title: 'yacs六月乙组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't78', studentId: 'student-3', title: 'yacs六月甲组', status: 'pending', category: '比赛', priority: 'normal' },
    ],
  },
  {
    id: 'student-4',
    name: '张赫桐',
    displayName: '张赫桐',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    contestResults: [
      { id: 'cr19', studentId: 'student-4', contestId: 'c2', award: '二等奖', contest: { id: 'c2', name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2025-10', description: '入门级认证', isTeam: false } },
      { id: 'cr20', studentId: 'student-4', contestId: 'c6', score: 30, contest: { id: 'c6', name: 'YACS月赛乙组', type: 'online', platform: 'YACS', date: '2026-05', description: '乙组总分400（自限：时间减半90mins/180mins）', totalScore: 400, timeLimit: '90mins/180mins', isTeam: false } },
    ],
    knowledges: [
      { id: 'sk23', studentId: 'student-4', knowledgePointId: 'kp15', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp15', name: '匈牙利算法', level: 5, levelAlias: 'CSP-S', category: '图论' } },
      { id: 'sk24', studentId: 'student-4', knowledgePointId: 'kp1', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp1', name: 'set数据结构运用', level: 3, levelAlias: 'CSP-J', category: '数据结构' } },
      { id: 'sk25', studentId: 'student-4', knowledgePointId: 'kp9', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp9', name: '最小生成树MST', level: 4, levelAlias: 'GESP 7级', category: '图论' } },
      { id: 'sk26', studentId: 'student-4', knowledgePointId: 'kp18', certifiedAt: '202603', status: 'certified', knowledgePoint: { id: 'kp18', name: '朴素分块', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk27', studentId: 'student-4', knowledgePointId: 'kp21', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp21', name: '莫队模板', level: 5, levelAlias: 'CSP-S', category: '数据结构' } },
      { id: 'sk28', studentId: 'student-4', knowledgePointId: 'kp22', certifiedAt: '202604', status: 'certified', knowledgePoint: { id: 'kp22', name: '按位贪心', level: 5, levelAlias: 'CSP-S', category: '算法' } },
      { id: 'sk29', studentId: 'student-4', knowledgePointId: 'kp24', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp24', name: '状压DP', level: 5, levelAlias: 'CSP-S', category: '动态规划' } },
      { id: 'sk30', studentId: 'student-4', knowledgePointId: 'kp12', certifiedAt: '202605', status: 'certified', knowledgePoint: { id: 'kp12', name: 'Floyd', level: 4, levelAlias: 'GESP 7级', category: '图论' } },
    ],
    tasks: [
      { id: 't25', studentId: 'student-4', title: '匈牙利算法 TR01', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't26', studentId: 'student-4', title: 'set数据结构 319,290,291', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't27', studentId: 'student-4', title: 'MST最小生成树 1776,591', status: 'completed', category: '图论', priority: 'normal' },
      { id: 't28', studentId: 'student-4', title: '朴素分块 TR17', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't29', studentId: 'student-4', title: '贪心练习 NOIP01', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't30', studentId: 'student-4', title: '贪心练习 NOIP05', status: 'completed', category: '算法', priority: 'normal' },
      { id: 't31', studentId: 'student-4', title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't32', studentId: 'student-4', title: '双指针优化练习+组合数逆元 NOIP02', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't33', studentId: 'student-4', title: '莫队模板题 TR18', status: 'completed', category: '数据结构', priority: 'normal' },
      { id: 't34', studentId: 'student-4', title: '按位贪心 2461', status: 'pending', category: '算法', priority: 'normal' },
      { id: 't35', studentId: 'student-4', title: '状压DP练习 1102', status: 'completed', category: '动态规划', priority: 'normal' },
      { id: 't79', studentId: 'student-4', title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't80', studentId: 'student-4', title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't81', studentId: 'student-4', title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't82', studentId: 'student-4', title: 'yacs五月乙组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't83', studentId: 'student-4', title: 'yacs五月甲组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't84', studentId: 'student-4', title: '莫队进阶题 TR19', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't85', studentId: 'student-4', title: 'Bitset+莫队 TR20', status: 'pending', category: '数据结构', priority: 'normal' },
      { id: 't86', studentId: 'student-4', title: 'yacs六月乙组', status: 'pending', category: '比赛', priority: 'normal' },
      { id: 't87', studentId: 'student-4', title: 'yacs六月甲组', status: 'pending', category: '比赛', priority: 'normal' },
    ],
  },
]

export function getAllStudents(): Student[] {
  return studentsSeedData.map(({ contestResults, knowledges, tasks, ...student }) => student)
}

export function getStudentById(id: string): StudentProfile | undefined {
  return studentsSeedData.find(s => s.id === id)
}

export function getStudentByName(name: string): StudentProfile | undefined {
  return studentsSeedData.find(s => s.name === name || s.displayName === name)
}

export function getStudentStats(student: StudentProfile) {
  const totalTasks = student.tasks.length
  const completedTasks = student.tasks.filter(t => t.status === 'completed').length
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const highestAward = student.contestResults
    .filter(cr => cr.award)
    .sort((a, b) => {
      const awardRank = (award: string) => {
        if (award.includes('金')) return 3
        if (award.includes('银')) return 2
        if (award.includes('铜')) return 1
        if (award.includes('一等')) return 3
        if (award.includes('二等')) return 2
        if (award.includes('三等')) return 1
        return 0
      }
      return awardRank(b.award!) - awardRank(a.award!)
    })[0]?.award

  return {
    contestCount: student.contestResults.length,
    highestAward: highestAward || '暂无',
    knowledgeCount: student.knowledges.length,
    totalTasks,
    completedTasks,
    taskCompletionRate,
  }
}

export function getTimelineItems(student: StudentProfile) {
  const items = [
    ...student.contestResults.map(cr => ({
      id: `contest-${cr.id}`,
      date: cr.contest?.date || '',
      type: 'contest' as const,
      title: cr.contest?.name || '未知比赛',
      description: cr.contest?.description || '',
      badge: cr.award || (cr.score !== undefined ? `得分: ${cr.score}` : undefined),
      status: 'completed' as const,
    })),
  ].filter(item => item.date)

  items.sort((a, b) => {
    return b.date.localeCompare(a.date)
  })

  return items
}
