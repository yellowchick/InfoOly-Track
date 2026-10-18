/**
 * 通用新增学生脚本（自动关联访问代码）
 *
 * 用法:
 *   node scripts/add-student.js --name 王小明 [--bio 简介] [--atcoder abc123]
 *
 * 自动完成:
 *   1. 生成访问代码（姓名全拼，如 wangxiaoming）写入 Student.accessCode
 *   2. 创建学生记录
 *
 * 比赛成绩、任务等请使用其他脚本或让 Kimi Work 继续录入。
 */
const { PrismaClient } = require('@prisma/client');
const { pinyin } = require('pinyin');

const prisma = new PrismaClient();

function nameToPinyin(name) {
  return pinyin(name, { style: 'normal' }).join('').toLowerCase();
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      out[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return out;
}

async function main() {
  const { name, bio, atcoder } = parseArgs();
  if (!name) {
    console.error('用法: node scripts/add-student.js --name 学生姓名 [--bio 简介] [--atcoder 账号]');
    process.exit(1);
  }

  const existing = await prisma.student.findFirst({ where: { name } });
  if (existing) {
    console.error(`❌ 学生「${name}」已存在 (id: ${existing.id})`);
    process.exit(1);
  }

  const accessCode = nameToPinyin(name);
  const student = await prisma.student.create({
    data: {
      name,
      displayName: name,
      bio: bio || null,
      atcoderId: atcoder || null,
      accessCode,
    },
  });

  console.log('✅ 学生创建成功');
  console.log('   姓名:', student.name);
  console.log('   ID:', student.id);
  console.log('   访问代码:', accessCode);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
