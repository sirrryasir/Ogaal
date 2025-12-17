import "dotenv/config";
import { prisma } from "../src/config/prisma";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Files to process
const CSV_FILES = [
  "SWIMS_LiveMap_Dataset_20251217-145352.csv",
  "SWIMS_LiveMap_Dataset_20251217-151007.csv",
];

// Target regions to process
const TARGET_REGIONS = ["Awdal", "Togdheer", "Woqooyi Galbeed"];

// Mapping rules
const REGION_MAPPING: Record<string, string> = {
  Hargeisa: "Maroodi Jeex",
  Hargeysa: "Maroodi Jeex",
  Gebiley: "Maroodi Jeex",
  Gabiley: "Maroodi Jeex",
  Berbera: "Saaxil",
};

async function main() {
  console.log("Starting SWIMS data import...");

  // Wipe Phase
  console.log("Wiping existing data for target regions...");
  try {
    // Delete children first
    await prisma.sensorReading.deleteMany({});
    await prisma.report.deleteMany({});
    await prisma.alert.deleteMany({});
    await prisma.aIPrediction.deleteMany({});
    await prisma.intervention.deleteMany({});

    // Delete main entities
    await prisma.waterSource.deleteMany({});
    await prisma.village.deleteMany({});
    await prisma.district.deleteMany({});
    await prisma.region.deleteMany({});
    console.log("Wipe complete.");
  } catch (error) {
    console.error("Wipe failed:", error);
    process.exit(1);
  }

  for (const filePath of CSV_FILES) {
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`File not found: ${absolutePath}`);
      continue;
    }

    console.log(`Processing file: ${filePath}`);
    await processFile(absolutePath);
  }

  console.log("Import completed.");
}

async function processFile(filePath: string) {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let header: string[] | null = null;
  let rowCount = 0;
  let importedCount = 0;

  for await (const line of rl) {
    rowCount++;
    // Simple CSV parser that handles quotes
    const row = parseCSVLine(line);

    if (rowCount === 1) {
      header = row.map((h) => h.trim().toLowerCase());
      continue;
    }

    if (!header) continue;

    // Create a map of column name to value
    const data: Record<string, string> = {};
    header.forEach((col, index) => {
      data[col] = row[index] || "";
    });

    // Extract relevant fields
    const rawRegion = (data["region"] || "").trim();
    if (!TARGET_REGIONS.includes(rawRegion)) {
      continue;
    }

    const rawDistrict = (data["district"] || "").trim();
    const villageName = (
      data["nearest_settlement_name"] ||
      data["source_name"] ||
      ""
    ).trim();
    const sourceName = (data["source_name"] || "Unknown Source").trim();
    const sourceType = (data["water_source_type"] || "Borehole").trim();
    const functioningStr = (data["functioning"] || "").trim();
    const latStr = (data["latitude"] || "").trim();
    const lonStr = (data["longitude"] || "").trim();

    // Apply Region Mapping
    let finalRegionName = rawRegion;
    if (rawRegion === "Woqooyi Galbeed") {
      const districtLower = rawDistrict.toLowerCase();
      if (
        districtLower.includes("hargeisa") ||
        districtLower.includes("hargeysa") ||
        districtLower.includes("gebiley") ||
        districtLower.includes("gabiley")
      ) {
        finalRegionName = "Maroodi Jeex";
      } else if (districtLower.includes("berbera")) {
        finalRegionName = "Saaxil";
      }
    }

    // Prepare status
    let status = "Working";
    if (functioningStr && functioningStr.toLowerCase() === "no") {
      status = "Broken";
    } else if (functioningStr && functioningStr.toLowerCase() === "yes") {
      status = "Working";
    }

    // Coordinates
    const lat = parseFloat(latStr);
    const lon = parseFloat(lonStr);

    if (!villageName) {
      continue;
    }

    try {
      // Upsert Region
      const region = await prisma.region.upsert({
        where: { name: finalRegionName },
        update: {},
        create: { name: finalRegionName },
      });

      // Upsert District
      let district = await prisma.district.findFirst({
        where: { name: rawDistrict, region_id: region.id },
      });

      if (!district) {
        district = await prisma.district.create({
          data: {
            name: rawDistrict,
            region_id: region.id,
          },
        });
      }

      // Upsert Village
      let village = await prisma.village.findFirst({
        where: { name: villageName, district_id: district.id },
      });

      if (!village) {
        village = await prisma.village.create({
          data: {
            name: villageName,
            district_id: district.id,
            latitude: !isNaN(lat) ? lat : undefined,
            longitude: !isNaN(lon) ? lon : undefined,
          },
        });
      }

      // Create Water Source
      // Check by strict name AND village_id
      const existingSource = await prisma.waterSource.findFirst({
        where: {
          name: { equals: sourceName, mode: "insensitive" }, // Case insensitive check
          village_id: village.id,
        },
      });

      if (!existingSource) {
        await prisma.waterSource.create({
          data: {
            name: sourceName,
            type: sourceType,
            status: status,
            latitude: !isNaN(lat) ? lat : undefined,
            longitude: !isNaN(lon) ? lon : undefined,
            village_id: village.id,
          },
        });
        importedCount++;
      }
    } catch (e) {
      console.error(`Error processing row ${rowCount}:`, e);
    }
  }

  console.log(`Imported ${importedCount} water sources from ${filePath}`);
}

// Custom CSV Tokenizer
function parseCSVLine(text: string): string[] {
  const parsed: string[] = [];
  let current = "";
  let inQuote = false;

  for (let j = 0; j < text.length; j++) {
    const char = text[j];
    if (inQuote) {
      if (char === '"') {
        if (j + 1 < text.length && text[j + 1] === '"') {
          current += '"';
          j++;
        } else {
          inQuote = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ",") {
        parsed.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  parsed.push(current);
  return parsed;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
