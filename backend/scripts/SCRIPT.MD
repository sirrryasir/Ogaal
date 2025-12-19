# Backend Scripts

This folder contains utility scripts for managing the backend database by importing actual real-world data from CSV files and applying specific filtering logic.

## Files

### `import_swims_data.ts`

This script imports actual real data from the SWIMS (Somalia Water Information Management System) CSV dataset into the database. It populates the database with real water source information, including regions, districts, villages, and water sources, while applying strict filtering to ensure only relevant data is imported.

**Key Features:**
- **Real Data Import:** Processes actual CSV data containing real-world water source information from Somalia.
- **Data Wipe:** Clears existing data for target regions before import to prevent duplicates and ensure clean data entry.
- **Filtering Logic:**
  - **Target Regions Filter:** Only imports data for specific Somali regions: Awdal, Togdheer, Woqooyi Galbeed, Sanaag, Sool, Maroodi Jeex, Saaxil. Any data outside these regions is skipped.
  - **Region Mapping Filter:** Applies custom mapping rules for districts within the Woqooyi Galbeed region:
    - Districts containing "Hargeisa", "Hargeysa", "Gebiley", or "Gabiley" are reassigned to "Maroodi Jeex".
    - Districts containing "Berbera" are reassigned to "Saaxil".
    - Any remaining Woqooyi Galbeed data is excluded.
  - **Data Validation:** Skips rows without village names or invalid coordinates.
- **Status Determination:** Sets water source status based on the actual "functioning" field in the CSV (Working if "yes", Broken if "no").
- **Upsert Logic:** Uses database upsert operations to create new entities or update existing ones without creating duplicates.
- **Import Limit:** Restricts import to 1000 water sources total to manage data volume.

**Usage:**
```bash
npx tsx scripts/import_swims_data.ts
```

**CSV File:** Expects `SWIMS_LiveMap_Dataset_20251218-081345.csv` in the backend root directory.

**Dependencies:** Requires Prisma client and Node.js environment with dotenv configured.

### `seed_status.ts`

This script randomly assigns statuses to all existing water sources in the database. It's useful for testing or populating sample data with varied statuses, but does not import real data.

**Available Statuses:**
- Working
- Broken
- Low Water
- Dry
- Contaminated

**Usage:**
```bash
npx tsx scripts/seed_status.ts
```

**Note:** This script updates all water sources with random statuses, so use with caution in production environments. It does not import external data.

## Running Scripts

All scripts are written in TypeScript and can be executed using `npx ts-node` from the backend directory. Ensure the database is running and environment variables are properly configured before execution.