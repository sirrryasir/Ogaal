import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const villages = await prisma.village.findMany({
    include: { boreholes: true },
  });
  console.log("Villages:", villages.length);
  villages.forEach((v) => {
    console.log(`- ${v.name}: ${v.boreholes.length} boreholes`);
    v.boreholes.forEach((b) => {
      console.log(`  - ${b.name} (${b.latitude}, ${b.longitude})`);
    });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
