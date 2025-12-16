import "dotenv/config";
import { prisma } from "../src/config/prisma";

// const prisma = new PrismaClient(); // Removed local instance

async function main() {
  console.log("Seeding database...");

  // Create Regions and Districts
  const region = await prisma.region.create({
    data: {
      name: "Maroodi Jeex",
      districts: {
        create: [
          { name: "Hargeisa" },
          { name: "Salahlay" },
          { name: "Gabiley" },
        ],
      },
    },
    include: { districts: true },
  });

  const hargeisaDistrict = region.districts.find((d) => d.name === "Hargeisa");

  // Generate 20 Water Sources
  const statuses = [
    "Working",
    "Working",
    "Working",
    "Needed Maintenance",
    "Broken",
  ];
  const types = ["Borehole", "Borehole", "Dam", "Berkad", "Well"];

  // Base coordinates for Hargeisa
  const baseLat = 9.56;
  const baseLng = 44.065;

  for (let i = 1; i <= 20; i++) {
    // Random offset for coordinates
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;

    await prisma.waterSource.create({
      data: {
        name: `Water Source ${i}`,
        type: types[Math.floor(Math.random() * types.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        water_level: Math.floor(Math.random() * 100),
        latitude: baseLat + latOffset,
        longitude: baseLng + lngOffset,
        village: {
          create: {
            name: `Village ${i}`,
            district_id: hargeisaDistrict?.id,
            latitude: baseLat + latOffset,
            longitude: baseLng + lngOffset,
            drought_risk_level: ["Low", "Medium", "High"][
              Math.floor(Math.random() * 3)
            ],
          },
        },
      },
    });
  }

  console.log("Seed data created: 20 sources.");
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
