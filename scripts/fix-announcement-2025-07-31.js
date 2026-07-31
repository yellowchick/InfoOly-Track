const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 删除旧资讯并创建新资讯 ===\n');

  // 1. 删除旧的 "7月总结 & 8月计划"
  const oldAnn = await prisma.announcement.findFirst({
    where: { title: '7月总结 & 8月计划' },
  });

  if (oldAnn) {
    await prisma.announcement.delete({ where: { id: oldAnn.id } });
    console.log('✅ 删除旧资讯:', oldAnn.id);
  } else {
    console.log('📋 旧资讯不存在');
  }

  // 2. 创建新资讯（完整内容，不删减）
  const content = `### 咨讯更新

- csp报名开启，务必尽快完成报名，报名网址https://cspsjtest.noi.cn/
- gesp报名开启，报名网址https://gesp.ccf.org.cn/，下一次比赛时9月12日，看小伙子们自己意见是否参与，按照上次成绩
  - 陆臻可报5级，心里预期90+
  - 马天成、张赫桐可报名6级，心里预期90+
  - 党皓天可报7级，心里预期70+
- 7月刷题计划完成，陆臻因为生病训练量太少
- 8月除了维持刷题手感外，侧重点如下
  - 习惯养成，为了避免爆0情况，每个题目分两个代码完成，对小数据做到每次必写暴力，<所有！>试题做到保底30分
  - lz和zht，知识点补足
  - lz和zht无特殊情况必须加入打比赛，比赛时间每周六晚8:00~9:40，建议来线下一起打
  - mtc除了比赛和任务补全以外，侧重于更多陷阱题和偏门题的研究
  - 如果dht回归，安排和mtc一样
- 勇于下主观判断预测csp-s，在控制暴力打底120分的情况下
  - 马天成目标在300，不排除极小概率犯蠢粗心的爆零情况，8月、9月练习基本很难更进一步，以维持手感增加准确度为主，更进一步需要的是时间沉淀和更强的学习氛围
  - 党皓天目标在200~300，不排除小概率犯蠢粗心的爆零情况，作为教练信一手在ds老师和豆包老师的掩护下党皓天有藏真实水平，毕竟在思路讨论上头脑有时候很清晰
  - 张赫桐目标依然在120~190，第一题或者第二题能AC一题的情况下，完成剩下所有的暴力。训练量已经很高，实战弱于前两位，实战经验和陆臻五五开，8月前并无法保证暴力程序的准确度
  - 陆臻目标在120~250，波动大的原因是"训练量少+实战少"，上限比较高的原因是"有思路的前提下完成代码效率和准确度较高"，上限又不能再高的原因是"部分知识点的掌握确实因为训练少而常常遗忘"，下限底的原因是"实战少"。另外个人特质上，总感觉陆臻的爆零概率是四位当中最低的`;

  const newAnn = await prisma.announcement.create({
    data: {
      title: '7月总结 & 8月计划',
      content: content,
      category: 'summary',
      date: '2026-07',
      isPublic: true,
    },
  });

  console.log('✅ 创建新资讯:', newAnn.id);
  console.log('标题:', newAnn.title);
  console.log('内容长度:', newAnn.content.length);

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
