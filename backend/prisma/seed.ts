import "dotenv/config";
import { prisma } from "../src/config/prisma";

async function main() {
  console.log("Seeding database with districts, villages, and water sources...");

  // Create a region (or use existing)
  let region = await prisma.region.findFirst({
    where: { name: "Maroodi Jeex" },
  });

  if (!region) {
    region = await prisma.region.create({
      data: { name: "Maroodi Jeex" },
    });
  }

  // Create Districts
  const districtsData = [
    { name: "Hargeisa" },
    { name: "Burco" },
    { name: "Gebiley" },
    { name: "Borama" },
  ];

  const districts = [];
  for (const distData of districtsData) {
    let district = await prisma.district.findFirst({
      where: { name: distData.name, region_id: region.id },
    });

    if (!district) {
      district = await prisma.district.create({
        data: {
          name: distData.name,
          region_id: region.id,
        },
      });
    }
    districts.push(district);
  }

  // Create Villages and Water Sources
  const villagesData = [
    {
      districtName: "Hargeisa",
      villageName: "Arabsiyo",
      waterSources: ["Ceel bari", "Ceel tuumbo"],
      coordinates: { lat: 9.56, lng: 44.065 },
    },
    {
      districtName: "Burco",
      villageName: "Qori lugud",
      waterSources: ["Ceel fidsane", "Ceel barax"],
      coordinates: { lat: 9.52, lng: 45.533 },
    },
    {
      districtName: "Gebiley",
      villageName: "Wajaale",
      waterSources: ["Ceel wajaale 1", "Ceel wajaale 2", "Ceel wajaale 3"],
      coordinates: { lat: 9.75, lng: 43.5 },
    },
  ];

  const statuses = ["Working", "Needed Maintenance", "Broken"];
  const types = ["WELL", "BOREHOLE", "BERKAD", "SPRING"];

  for (const villageData of villagesData) {
    const district = districts.find((d) => d.name === villageData.districtName);
    if (!district) continue;

    // Create or get village
    let village = await prisma.village.findFirst({
      where: {
        name: villageData.villageName,
        district_id: district.id,
      },
    });

    if (!village) {
      village = await prisma.village.create({
        data: {
          name: villageData.villageName,
          district_id: district.id,
          latitude: villageData.coordinates.lat,
          longitude: villageData.coordinates.lng,
          drought_risk_level: "Low",
        },
      });
    }

    // Create water sources for this village
    for (const sourceName of villageData.waterSources) {
      const existingSource = await prisma.waterSource.findFirst({
        where: {
          name: sourceName,
          village_id: village.id,
        },
      });

      if (!existingSource) {
        // Random offset for coordinates within village area
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        await prisma.waterSource.create({
          data: {
            name: sourceName,
            village_id: village.id,
            type: types[Math.floor(Math.random() * types.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            water_level: Math.floor(Math.random() * 100),
            latitude: villageData.coordinates.lat + latOffset,
            longitude: villageData.coordinates.lng + lngOffset,
            last_maintained: new Date(),
          },
        });
      }
    }
  }

  // Add 2 more water sources to each village (to reach 5 per district as requested)
  for (const villageData of villagesData) {
    const district = districts.find((d) => d.name === villageData.districtName);
    if (!district) continue;

    const village = await prisma.village.findFirst({
      where: {
        name: villageData.villageName,
        district_id: district.id,
      },
    });

    if (village) {
      const existingCount = await prisma.waterSource.count({
        where: { village_id: village.id },
      });

      // Add more sources to reach 5 per village
      const needed = 5 - existingCount;
      for (let i = 0; i < needed; i++) {
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        await prisma.waterSource.create({
          data: {
            name: `${villageData.villageName} Source ${existingCount + i + 1}`,
            village_id: village.id,
            type: types[Math.floor(Math.random() * types.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            water_level: Math.floor(Math.random() * 100),
            latitude: villageData.coordinates.lat + latOffset,
            longitude: villageData.coordinates.lng + lngOffset,
            last_maintained: new Date(),
          },
        });
      }
    }
  }

  console.log("✅ Seed data created successfully!");
  console.log("   - Districts: Hargeisa, Burco, Gebiley, Borama");
  console.log("   - Villages: Arabsiyo, Qori lugud, Wajaale");
  console.log("   - Water sources: 5 per village");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
