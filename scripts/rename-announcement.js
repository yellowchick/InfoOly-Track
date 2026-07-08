const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const announcements = await prisma.announcement.findMany({
    where: { title: { contains: "家校专栏" } }
  });
  
  for (const a of announcements) {
    const newTitle = a.title.replace(/家校专栏/g, "最新资讯");
    await prisma.announcement.update({
      where: { id: a.id },
      data: { title: newTitle }
    });
    console.log("Updated:", a.title, "→", newTitle);
  }
  
  if (announcements.length === 0) {
    console.log("No announcements with 家校专栏 found");
  }
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
