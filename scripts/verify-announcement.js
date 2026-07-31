const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const ann = await prisma.announcement.findFirst({
    where: { title: '7月总结 & 8月计划' },
  });
  if (ann) {
    console.log('ID:', ann.id);
    console.log('标题:', ann.title);
    console.log('内容长度:', ann.content.length);
    console.log('\n=== 完整内容 ===\n');
    console.log(ann.content);
  } else {
    console.log('未找到资讯');
  }
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
