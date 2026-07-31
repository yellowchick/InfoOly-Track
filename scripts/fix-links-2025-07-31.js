const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('=== 修复资讯中超链接错位问题 ===\n');

  const ann = await prisma.announcement.findFirst({
    where: { title: '7月总结 & 8月计划' },
  });

  if (!ann) {
    console.log('❌ 未找到资讯');
    await prisma.$disconnect();
    return;
  }

  // 修复前：报名网址https://gesp.ccf.org.cn/，下一次比赛时9月12日
  // 修复后：报名网址 [gesp.ccf.org.cn](https://gesp.ccf.org.cn/) ，下一次比赛时9月12日
  // 关键：URL 和后面的中文之间加空格，避免自动链接把中文逗号也包含进去

  let fixedContent = ann.content
    .replace(
      '报名网址https://gesp.ccf.org.cn/，下一次比赛时9月12日',
      '报名网址 [gesp.ccf.org.cn](https://gesp.ccf.org.cn/) ，下一次比赛时9月12日'
    )
    .replace(
      '报名网址https://cspsjtest.noi.cn/',
      '报名网址 [cspsjtest.noi.cn](https://cspsjtest.noi.cn/)'
    );

  if (fixedContent !== ann.content) {
    await prisma.announcement.update({
      where: { id: ann.id },
      data: { content: fixedContent },
    });
    console.log('✅ 已修复超链接错位');
    console.log('修改内容:');
    console.log('  - gesp.ccf.org.cn 链接已添加空格分隔');
    console.log('  - cspsjtest.noi.cn 链接已格式化');
  } else {
    console.log('📋 无需修改');
  }

  // 验证结果
  const verify = await prisma.announcement.findUnique({ where: { id: ann.id } });
  console.log('\n=== 修复后内容预览 ===');
  const lines = verify.content.split('\n');
  lines.forEach(line => {
    if (line.includes('gesp') || line.includes('csp')) {
      console.log(line);
    }
  });

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
