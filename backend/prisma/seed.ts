import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const hargeisa = await prisma.district.create({
    data: { name: "Hargeisa", region: { create: { name: "Maroodi Jeex" } } },
  });

  await prisma.waterSource.create({
    data: {
      name: "Hargeisa Borehole 1",
      village: {
        create: {
          name: "Hargeisa Village A",
          district_id: hargeisa.id,
          latitude: 9.56,
          longitude: 44.065,
        },
      },
      type: "Borehole",
      latitude: 9.56,
      longitude: 44.065,
    },
  });

  console.log("Seed data created.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
