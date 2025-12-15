import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Start seeding ...`);

  // 1. Create Village
  const village = await prisma.village.upsert({
    where: { id: 1 }, // Assuming ID 1 for simplicity or just create
    update: {},
    create: {
      name: "Hargeisa",
      latitude: 9.56,
      longitude: 44.06,
      drought_risk_level: "Low",
    },
  });

  console.log(`Created/Found village: ${village.name}`);

  const waterSources = [
    {
      name: "Central Borehole",
      status: "Working",
      water_level: 80.0,
    },
    {
      name: "Village Well North",
      status: "Low Water",
      water_level: 20.0,
    },
    {
      name: "Community Pump",
      status: "Broken",
      water_level: 0.0,
    },
    {
      name: "River Access Point",
      status: "Low Water",
      water_level: 10.0,
    },
  ];

  for (const ws of waterSources) {
    const source = await prisma.borehole.create({
      data: {
        village_id: village.id,
        name: ws.name,
        status: ws.status,
        water_level: ws.water_level,
      },
    });
    console.log(`Created borehole with id: ${source.id}`);
  }
  console.log(`Seeding finished.`);
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
