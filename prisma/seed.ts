import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 先清空所有表（按照外键依赖顺序从子表到父表）
  await prisma.$transaction([
    prisma.studentContestResult.deleteMany(),
    prisma.studentKnowledge.deleteMany(),
    prisma.task.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.schedule.deleteMany(),
    prisma.externalLink.deleteMany(),
    prisma.rule.deleteMany(),
    prisma.contest.deleteMany(),
    prisma.knowledgePoint.deleteMany(),
    prisma.student.deleteMany(),
  ])
  console.log('All tables cleared')

  // 创建学生
  const students = await prisma.$transaction([
    prisma.student.create({ data: { name: '马天成', displayName: '马天成' } }),
    prisma.student.create({ data: { name: '党皓天', displayName: '党皓天' } }),
    prisma.student.create({ data: { name: '陆臻', displayName: '陆臻' } }),
    prisma.student.create({ data: { name: '张赫桐', displayName: '张赫桐' } }),
  ])

  const [ma, dang, lu, zhang] = students

  // 创建赛制
  await prisma.$transaction([
    prisma.rule.create({ data: { name: 'OI赛制', description: '无提交反馈、无实时排名。比赛期间提交代码后不显示任何结果（如AC/WA/TLE），仅赛后统一评测；每题按通过的测试点（或子任务）得分，多次提交以最后一次为准，无罚时。', features: JSON.stringify(['无提交反馈','无实时排名','按测试点得分','最后一次提交为准','无罚时']), examples: 'NOI、CSP-J/S、NOIP、蓝桥杯（省赛及以上）', sortOrder: 1 } }),
    prisma.rule.create({ data: { name: 'IOI赛制', description: '有实时反馈（每题得分/测试点通过情况）、有实时排名。同样按测试点给分、不限提交次数、最后一次提交计分，但比赛过程中可看到当前得分和全场排名。', features: JSON.stringify(['实时反馈','实时排名','按测试点得分','不限提交次数']), examples: 'IOI（国际奥赛）、PAT、CCF-CSP（部分场次）、多数线上月赛（如洛谷月赛）', sortOrder: 2 } }),
    prisma.rule.create({ data: { name: 'ACM-ICPC', description: '以三人团队为单位，在5小时内共用一台计算机解决若干道算法难题，排名时首先以解题数量为最高准则，解题数相同时则比较总用时（包含错误提交产生的罚时）。', features: JSON.stringify(['三人团队','5小时','共用一台计算机','解题数量优先','含罚时']), examples: '国际大学生程序设计竞赛', sortOrder: 3 } }),
  ])

  // 创建比赛
  const contests = await prisma.$transaction([
    prisma.contest.create({ data: { name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2024-10', description: '入门级认证' } }),
    prisma.contest.create({ data: { name: 'CSP-J', type: 'offline', platform: 'CCF', date: '2025-10', description: '入门级认证' } }),
    prisma.contest.create({ data: { name: 'CSP-S', type: 'offline', platform: 'CCF', date: '2025-10', description: '提高级认证' } }),
    prisma.contest.create({ data: { name: 'USACO', type: 'online', platform: 'USACO', date: '2026-01', description: '美国计算机奥林匹克竞赛' } }),
    prisma.contest.create({ data: { name: 'USACO', type: 'online', platform: 'USACO', date: '2026-02', description: '美国计算机奥林匹克竞赛' } }),
    prisma.contest.create({ data: { name: 'YACS月赛乙组', type: 'online', platform: 'YACS', date: '2026-05', description: '乙组总分400（自限：时间减半90mins/180mins）', totalScore: 400, timeLimit: '90mins/180mins' } }),
    prisma.contest.create({ data: { name: 'YACS月赛甲组', type: 'online', platform: 'YACS', date: '2026-05', description: '甲组总分300（自限：时间缩减120mins/210mins）', totalScore: 300, timeLimit: '120mins/210mins' } }),
    prisma.contest.create({ data: { name: 'AtCoder ABC460', type: 'online', platform: 'AtCoder', date: '2026-05', description: 'AtCoder Beginner Contest 460' } }),
    prisma.contest.create({ data: { name: 'AtCoder ABC462', type: 'online', platform: 'AtCoder', date: '2026-06', description: 'AtCoder Beginner Contest 462' } }),
    prisma.contest.create({ data: { name: 'AtCoder ABC463', type: 'online', platform: 'AtCoder', date: '2026-06', description: 'AtCoder Beginner Contest 463' } }),
    prisma.contest.create({ data: { name: 'YACS月赛乙组', type: 'online', platform: 'YACS', date: '2026-06', isTeam: true, description: '乙组总分400（自限：时间减半90mins/180mins，团队讨论）', totalScore: 400, timeLimit: '90mins/180mins' } }),
    prisma.contest.create({ data: { name: 'YACS月赛甲组', type: 'online', platform: 'YACS', date: '2026-06', isTeam: true, description: '甲组总分300（自限：时间缩减，团队讨论）', totalScore: 300 } }),
  ])

  const [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12] = contests

  // 创建比赛成绩
  await prisma.$transaction([
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c1.id, award: '二等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: dang.id, contestId: c1.id, award: '一等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: lu.id, contestId: c1.id, award: '二等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c2.id, award: '一等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: zhang.id, contestId: c2.id, award: '二等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: dang.id, contestId: c2.id, award: '二等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c3.id, award: '二等奖' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c4.id, award: '铜升银' } }),
    prisma.studentContestResult.create({ data: { studentId: dang.id, contestId: c4.id, award: '铜升银' } }),
    prisma.studentContestResult.create({ data: { studentId: lu.id, contestId: c4.id, award: '铜升银' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c5.id, award: '银升金' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c6.id, score: 280 } }),
    prisma.studentContestResult.create({ data: { studentId: dang.id, contestId: c6.id, score: 270 } }),
    prisma.studentContestResult.create({ data: { studentId: zhang.id, contestId: c6.id, score: 30 } }),
    prisma.studentContestResult.create({ data: { studentId: dang.id, contestId: c7.id, score: 65 } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c7.id, score: 10 } }),
    prisma.studentContestResult.create({ data: { studentId: lu.id, contestId: c7.id, score: 100 } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c8.id, score: 1650, rank: 366, atcoderRank: 23870, atcoderRating: 731, notes: 'Rank总排名51225->23870，Rating积分186->731' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c9.id, score: 1450, rank: 2289, atcoderRank: 20148, atcoderRating: 838, notes: 'Rank总排名23870->20148，Rating积分731->838' } }),
    prisma.studentContestResult.create({ data: { studentId: ma.id, contestId: c10.id, score: 1450, rank: 1133, atcoderRank: 15426, atcoderRating: 991, notes: 'Rank总排名20148->15426，Rating积分838->991' } }),
  ])

  // 创建知识点
  const knowledgePoints = await prisma.$transaction([
    prisma.knowledgePoint.create({ data: { name: 'set数据结构运用', level: 3, levelAlias: 'CSP-J', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '快速幂', level: 3, levelAlias: 'CSP-J', category: '数学' } }),
    prisma.knowledgePoint.create({ data: { name: '并查集', level: 3, levelAlias: 'CSP-J', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '基础dp', level: 3, levelAlias: 'CSP-J', category: '动态规划' } }),
    prisma.knowledgePoint.create({ data: { name: '二分答案', level: 3, levelAlias: 'CSP-J', category: '算法' } }),
    prisma.knowledgePoint.create({ data: { name: '质数判断拓展', level: 3, levelAlias: 'CSP-J', category: '数学' } }),
    prisma.knowledgePoint.create({ data: { name: '树建模，邻接表结构', level: 4, levelAlias: 'GESP 7级', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '分治法(归并)', level: 4, levelAlias: 'GESP 7级', category: '算法' } }),
    prisma.knowledgePoint.create({ data: { name: '最小生成树MST', level: 4, levelAlias: 'GESP 7级', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '双指针/双游标', level: 4, levelAlias: 'GESP 7级', category: '算法' } }),
    prisma.knowledgePoint.create({ data: { name: '树形DP', level: 4, levelAlias: 'GESP 7级', category: '动态规划' } }),
    prisma.knowledgePoint.create({ data: { name: 'Floyd', level: 4, levelAlias: 'GESP 7级', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: 'Dijkstra', level: 4, levelAlias: 'GESP 7级', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: 'Bellman-Ford', level: 4, levelAlias: 'GESP 7级', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '树换根', level: 5, levelAlias: 'CSP-S', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '堆优化Dijkstra', level: 5, levelAlias: 'CSP-S', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '匈牙利算法', level: 5, levelAlias: 'CSP-S', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '朴素分块', level: 5, levelAlias: 'CSP-S', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '树状数组BIT', level: 5, levelAlias: 'CSP-S', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '树建模序列化', level: 5, levelAlias: 'CSP-S', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '莫队模板', level: 5, levelAlias: 'CSP-S', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '按位贪心', level: 5, levelAlias: 'CSP-S', category: '算法' } }),
    prisma.knowledgePoint.create({ data: { name: '逆元组合数', level: 5, levelAlias: 'CSP-S', category: '数学' } }),
    prisma.knowledgePoint.create({ data: { name: '超大背包', level: 5, levelAlias: 'CSP-S', category: '动态规划' } }),
    prisma.knowledgePoint.create({ data: { name: '状压DP', level: 5, levelAlias: 'CSP-S', category: '动态规划' } }),
    prisma.knowledgePoint.create({ data: { name: '带权二分图匹配KM算法', level: 6, levelAlias: 'USACO金', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '二分图最小点覆盖', level: 6, levelAlias: 'USACO金', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '分块进阶', level: 6, levelAlias: 'USACO金', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '数学期望、概率', level: 6, levelAlias: 'USACO金', category: '数学' } }),
    prisma.knowledgePoint.create({ data: { name: 'HK算法', level: 7, levelAlias: '省选', category: '图论' } }),
    prisma.knowledgePoint.create({ data: { name: '莫队+位运算', level: 7, levelAlias: '省选', category: '数据结构' } }),
    prisma.knowledgePoint.create({ data: { name: '莫队+差分', level: 7, levelAlias: '省选', category: '数据结构' } }),
  ])

  const kpMap = new Map(knowledgePoints.map(k => [k.name, k.id]))

  // 创建学生知识点认证
  const certData = [
    { student: zhang, certs: [
      ['匈牙利算法','202603'], ['set数据结构','202603'], ['最小生成树MST','202603'],
      ['朴素分块','202603'], ['莫队模板','202604'], ['按位贪心','202604'], ['状压DP','202605'], ['Floyd','202605']
    ]},
    { student: ma, certs: [
      ['匈牙利算法','202603'], ['HK算法','202603'], ['带权二分图匹配KM算法','202603'],
      ['朴素分块','202603'], ['莫队模板','202604'], ['按位贪心','202604'], ['状压DP','202605'], ['Floyd','202605'], ['Dijkstra','202605']
    ]},
    { student: dang, certs: [
      ['匈牙利算法','202603'], ['HK算法','202603'], ['带权二分图匹配KM算法','202603'],
      ['朴素分块','202603'], ['莫队模板','202604'], ['按位贪心','202604'], ['状压DP','202605'], ['Floyd','202605']
    ]},
    { student: lu, certs: [
      ['匈牙利算法','202603'], ['朴素分块','202603'], ['莫队模板','202604'], ['按位贪心','202604'], ['Floyd','202605']
    ]},
  ]

  for (const { student, certs } of certData) {
    for (const [name, date] of certs) {
      const kpid = kpMap.get(name)
      if (kpid) {
        await prisma.studentKnowledge.create({
          data: { studentId: student.id, knowledgePointId: kpid, certifiedAt: date }
        })
      }
    }
  }

  // 创建任务
  const taskData = [
    { student: ma, tasks: [
      { title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论' },
      { title: 'HK算法自主精研代码', status: 'completed', category: '图论' },
      { title: '带权二分图匹配KM算法 TR04', status: 'pending', category: '图论' },
      { title: '朴素分块 TR17', status: 'completed', category: '数据结构' },
      { title: '分块进阶 TR08,TR09,TR10', status: 'pending', category: '数据结构' },
      { title: '贪心练习 NOIP01', status: 'completed', category: '算法' },
      { title: '分块+同余优化+O2优化 TR12', status: 'pending', category: '数据结构' },
      { title: '分块+离线处理+优化 TR14', status: 'pending', category: '数据结构' },
      { title: '贪心练习 NOIP05', status: 'pending', category: '算法' },
      { title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构' },
      { title: '双指针优化练习+组合数逆元 NOIP02', status: 'completed', category: '算法' },
      { title: '莫队模板题 TR18', status: 'completed', category: '数据结构' },
      { title: '按位贪心 2461', status: 'pending', category: '算法' },
      { title: 'DP陷阱题 2170', status: 'pending', category: '动态规划' },
      { title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛' },
      { title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛' },
      { title: '状压DP练习 1102', status: 'completed', category: '动态规划' },
      { title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛' },
      { title: 'yacs五月乙组', status: 'completed', category: '比赛' },
      { title: 'yacs五月甲组', status: 'pending', category: '比赛' },
      { title: '莫队进阶题 TR19', status: 'pending', category: '数据结构' },
      { title: 'Bitset+莫队 TR20', status: 'pending', category: '数据结构' },
      { title: 'yacs六月乙组', status: 'pending', category: '比赛' },
      { title: 'yacs六月甲组', status: 'pending', category: '比赛' },
    ]},
    { student: dang, tasks: [
      { title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论' },
      { title: 'HK算法自主精研代码', status: 'completed', category: '图论' },
      { title: '带权二分图匹配KM算法 TR04', status: 'completed', category: '图论' },
      { title: '朴素分块 TR17', status: 'completed', category: '数据结构' },
      { title: '分块进阶 TR08,TR09,TR10', status: 'completed', category: '数据结构' },
      { title: '贪心练习 NOIP01', status: 'completed', category: '算法' },
      { title: '分块+同余优化+O2优化 TR12', status: 'completed', category: '数据结构' },
      { title: '分块+离线处理+优化 TR14', status: 'pending', category: '数据结构' },
      { title: '贪心练习 NOIP05', status: 'pending', category: '算法' },
      { title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构' },
      { title: '双指针优化练习+组合数逆元 NOIP02', status: 'pending', category: '算法' },
      { title: '莫队模板题 TR18', status: 'completed', category: '数据结构' },
      { title: '按位贪心 2461', status: 'completed', category: '算法' },
      { title: 'DP陷阱题 2170', status: 'pending', category: '动态规划' },
      { title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛' },
      { title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛' },
      { title: '状压DP练习 1102', status: 'completed', category: '动态规划' },
      { title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛' },
      { title: 'yacs五月乙组', status: 'completed', category: '比赛' },
      { title: 'yacs五月甲组', status: 'pending', category: '比赛' },
      { title: '莫队进阶题 TR19', status: 'pending', category: '数据结构' },
      { title: 'Bitset+莫队 TR20', status: 'pending', category: '数据结构' },
      { title: 'yacs六月乙组', status: 'pending', category: '比赛' },
      { title: 'yacs六月甲组', status: 'pending', category: '比赛' },
    ]},
    { student: lu, tasks: [
      { title: '匈牙利算法 TR01,TR02', status: 'completed', category: '图论' },
      { title: '朴素分块 TR17', status: 'completed', category: '数据结构' },
      { title: '贪心练习 NOIP01', status: 'completed', category: '算法' },
      { title: '贪心练习 NOIP05', status: 'completed', category: '算法' },
      { title: '双指针优化练习+组合数逆元 NOIP02', status: 'pending', category: '算法' },
      { title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构' },
      { title: '莫队模板题 TR18', status: 'pending', category: '数据结构' },
      { title: '按位贪心 2461', status: 'pending', category: '算法' },
      { title: 'DP陷阱题 2170', status: 'pending', category: '动态规划' },
      { title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛' },
      { title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛' },
      { title: '状压DP练习 1102', status: 'pending', category: '动态规划' },
      { title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛' },
      { title: 'yacs五月乙组', status: 'pending', category: '比赛' },
      { title: 'yacs五月甲组', status: 'pending', category: '比赛' },
      { title: '莫队进阶题 TR19', status: 'pending', category: '数据结构' },
      { title: 'Bitset+莫队 TR20', status: 'completed', category: '数据结构' },
      { title: 'yacs六月乙组', status: 'pending', category: '比赛' },
      { title: 'yacs六月甲组', status: 'pending', category: '比赛' },
    ]},
    { student: zhang, tasks: [
      { title: '匈牙利算法 TR01', status: 'completed', category: '图论' },
      { title: 'set数据结构 319,290,291', status: 'completed', category: '数据结构' },
      { title: 'MST最小生成树 1776,591', status: 'completed', category: '图论' },
      { title: '朴素分块 TR17', status: 'completed', category: '数据结构' },
      { title: '贪心练习 NOIP01', status: 'pending', category: '算法' },
      { title: '贪心练习 NOIP05', status: 'completed', category: '算法' },
      { title: '树建模+序列化+树状数组优化 2161', status: 'pending', category: '数据结构' },
      { title: '双指针优化练习+组合数逆元 NOIP02', status: 'pending', category: '算法' },
      { title: '莫队模板题 TR18', status: 'completed', category: '数据结构' },
      { title: '按位贪心 2461', status: 'pending', category: '算法' },
      { title: '状压DP练习 1102', status: 'completed', category: '动态规划' },
      { title: 'gesp五六七八级 GESP01~05', status: 'pending', category: '比赛' },
      { title: 'gesp五六七八级 GESP06~10', status: 'pending', category: '比赛' },
      { title: 'gesp五六七八级 GSEP11~13，NOI01', status: 'pending', category: '比赛' },
      { title: 'yacs五月乙组', status: 'pending', category: '比赛' },
      { title: 'yacs五月甲组', status: 'pending', category: '比赛' },
      { title: '莫队进阶题 TR19', status: 'pending', category: '数据结构' },
      { title: 'Bitset+莫队 TR20', status: 'pending', category: '数据结构' },
      { title: 'yacs六月乙组', status: 'pending', category: '比赛' },
      { title: 'yacs六月甲组', status: 'pending', category: '比赛' },
    ]},
  ]

  for (const { student, tasks } of taskData) {
    for (const t of tasks) {
      await prisma.task.create({
        data: { studentId: student.id, ...t }
      })
    }
  }

  // 创建公告
  await prisma.announcement.create({
    data: { title: '6月表现', content: '6月学生的表现都不错', category: 'home-school', date: '2026-06' }
  })

  // 创建时间安排
  await prisma.$transaction([
    prisma.schedule.create({ data: { day: '周三', startTime: '18:20', endTime: '20:00' } }),
    prisma.schedule.create({ data: { day: '周五', startTime: '15:50', endTime: '19:00' } }),
    prisma.schedule.create({ data: { day: '周日', startTime: '09:00', endTime: '12:00', note: '目前都是亏损状态(作业都还有欠着没完成的)，所以都建议有空来讨论完成' } }),
  ])

  // 创建外部链接
  await prisma.$transaction([
    prisma.externalLink.create({ data: { name: 'USACO', url: 'https://usaco.org/', category: 'platform', icon: '🌐', sortOrder: 1 } }),
    prisma.externalLink.create({ data: { name: 'YACS', url: 'https://www.iai.sh.cn/', category: 'platform', icon: '📚', sortOrder: 2 } }),
    prisma.externalLink.create({ data: { name: 'HydroOJ', url: 'https://hydro.ac/', category: 'platform', icon: '💧', sortOrder: 3 } }),
    prisma.externalLink.create({ data: { name: 'AtCoder', url: 'https://atcoder.jp/', category: 'platform', icon: '⚡', sortOrder: 4 } }),
  ])

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
