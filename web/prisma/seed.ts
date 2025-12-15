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

  // Clear existing data (optional, be careful in prod)
  // await prisma.report.deleteMany();
  // await prisma.borehole.deleteMany();
  // await prisma.village.deleteMany();

  const villages = [
    {
      name: "Hargeisa",
      latitude: 9.562,
      longitude: 44.065,
      drought_risk_level: "Medium",
    },
    {
      name: "Arabsiyo",
      latitude: 9.674,
      longitude: 43.764,
      drought_risk_level: "High",
    },
    {
      name: "Gabiley",
      latitude: 9.696,
      longitude: 43.626,
      drought_risk_level: "High",
    },
    {
      name: "Dararweyne",
      latitude: 9.712,
      longitude: 44.178,
      drought_risk_level: "Critical",
    },
    {
      name: "Baligubadle",
      latitude: 9.387,
      longitude: 44.004,
      drought_risk_level: "High",
    },
  ];

  for (const vData of villages) {
    const village = await prisma.village.upsert({
      where: { id: villages.indexOf(vData) + 1 }, // Simple ID strategy for seed
      update: {},
      create: vData,
    });
    console.log(`Upserted village: ${village.name}`);

    // Create boreholes for each village
    const boreholes = getBoreholesForVillage(
      village.name,
      village.latitude!,
      village.longitude!
    );

    for (const bh of boreholes) {
      await prisma.borehole.create({
        data: {
          village_id: village.id,
          name: bh.name,
          status: bh.status,
          water_level: bh.water_level,
          latitude: bh.latitude,
          longitude: bh.longitude,
          last_maintained: new Date(),
        },
      });
    }
  }

  console.log(`Seeding finished.`);
}

function getBoreholesForVillage(villageName: string, lat: number, lng: number) {
  // Generate some realistic offsets for boreholes around the village center
  const sources = [
    {
      name: `Ceelka ${villageName} Main`,
      status: "working",
      offset: [0.002, 0.002],
    },
    {
      name: `Ceelka ${villageName} North`,
      status: "low",
      offset: [0.005, -0.001],
    },
    {
      name: `Ceelka Reer ${villageName}`,
      status: "working",
      offset: [-0.003, 0.004],
    },
    {
      name: `Barkada ${villageName}`,
      status: "broken",
      offset: [-0.001, -0.005],
    },
  ];

  return sources.map((s) => ({
    name: s.name,
    status: s.status,
    water_level: Math.floor(Math.random() * 100),
    latitude: lat + s.offset[0],
    longitude: lng + s.offset[1],
  }));
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
