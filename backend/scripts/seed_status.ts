import { prisma } from "../src/config/prisma";

const statuses = ["Working", "Broken", "Low Water", "Dry", "Contaminated"];

async function main() {
  console.log("Starting status update...");

  const waterSources = await prisma.waterSource.findMany();
  console.log(`Found ${waterSources.length} water sources.`);

  for (const source of waterSources) {
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    await prisma.waterSource.update({
      where: { id: source.id },
      data: { status: randomStatus },
    });
  }

  console.log("Status update complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
