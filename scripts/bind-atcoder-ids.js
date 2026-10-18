/**
 * 回填学生 AtCoder 账号绑定
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BINDINGS = [
  { name: '马天成', atcoderId: 'Tiancheng' },
  { name: '党皓天', atcoderId: 'solitaire' },
  { name: '陆臻', atcoderId: 'Remielle' },
];

async function main() {
  console.log('=== 回填 AtCoder 账号绑定 ===');
  for (const b of BINDINGS) {
    const student = await prisma.student.findFirst({ where: { name: b.name } });
    if (!student) {
      console.log(`⚠️ 未找到学生: ${b.name}`);
      continue;
    }
    await prisma.student.update({
      where: { id: student.id },
      data: { atcoderId: b.atcoderId },
    });
    console.log(`✅ ${b.name} → ${b.atcoderId}`);
  }
  await prisma.$disconnect();
}
main();
