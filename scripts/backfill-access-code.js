/**
 * 回填学生访问代码
 * 为所有 accessCode 为空的学生生成姓名全拼访问代码（幂等，可重复执行）
 */
const { PrismaClient } = require('@prisma/client');
const { pinyin } = require('pinyin');

const prisma = new PrismaClient();

async function main() {
  const students = await prisma.student.findMany({ where: { accessCode: null } });
  if (students.length === 0) {
    console.log('所有学生均已有访问代码，无需回填');
    return;
  }
  for (const s of students) {
    const code = pinyin(s.name, { style: 'normal' }).join('').toLowerCase();
    await prisma.student.update({ where: { id: s.id }, data: { accessCode: code } });
    console.log(`✅ ${s.name} → ${code}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
