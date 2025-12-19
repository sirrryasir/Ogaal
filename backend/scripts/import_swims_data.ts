import "dotenv/config";
import { prisma } from "../src/config/prisma";
import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Files to process
const CSV_FILES = ["SWIMS_LiveMap_Dataset_20251218-081345.csv"];

// Target regions to process
const TARGET_REGIONS = [
  "Awdal",
  "Togdheer",
  "Woqooyi Galbeed",
  "Sanaag",
  "Sool",
  "Maroodi Jeex",
  "Saaxil",
];

// Mapping rules
const REGION_MAPPING: Record<string, string> = {
  Hargeisa: "Maroodi Jeex",
  Hargeysa: "Maroodi Jeex",
  Gebiley: "Maroodi Jeex",
  Gabiley: "Maroodi Jeex",
  Berbera: "Saaxil",
};

// Limit for seed data
const MAX_IMPORT_COUNT = 1000;

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

  let totalImported = 0;

  for (const filePath of CSV_FILES) {
    if (totalImported >= MAX_IMPORT_COUNT) {
      break;
    }
    const absolutePath = path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`File not found: ${absolutePath}`);
      continue;
    }

    console.log(`Processing file: ${filePath}`);
    const count = await processFile(absolutePath, totalImported);
    totalImported = count;
  }

  console.log(`Import completed. Total imported: ${totalImported}`);
}

async function processFile(
  filePath: string,
  currentTotal: number
): Promise<number> {
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let header: string[] | null = null;
  let rowCount = 0;
  let importedCount = 0;
  let totalCount = currentTotal;

  for await (const line of rl) {
    if (totalCount >= MAX_IMPORT_COUNT) {
      break;
    }

    rowCount++;
    const row = parseCSVLine(line);

    if (rowCount === 1) {
      header = row.map((h) => h.trim().toLowerCase());
      continue;
    }

    if (!header) continue;

    const data: Record<string, string> = {};
    header.forEach((col, index) => {
      data[col] = row[index] || "";
    });

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
    const establishingAgency = (data["establishingSMOWRD_agency"] || "").trim();
    const inspectingAgency = "Somaliland MOWRD"; // Always set to "Somaliland MOWRD"

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

    if (finalRegionName === "Woqooyi Galbeed") {
      continue;
    }

    // Prepare status
    let status = "Working";
    if (functioningStr && functioningStr.toLowerCase() === "no") {
      status = "Broken";
    } else if (functioningStr && functioningStr.toLowerCase() === "yes") {
      status = "Working";
    }

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
      const existingSource = await prisma.waterSource.findFirst({
        where: {
          name: { equals: sourceName, mode: "insensitive" },
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
            inspecting_agency: inspectingAgency,
            establishing_agency: establishingAgency || undefined,
            // settlement_name REMOVED - this field no longer exists
          },
        });
        importedCount++;
        totalCount++;
      }
    } catch (e) {
      console.error(`Error processing row ${rowCount}:`, e);
    }
  }

  console.log(`Imported ${importedCount} water sources from ${filePath}`);
  return totalCount;
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