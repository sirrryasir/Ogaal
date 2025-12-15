const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = `
  CREATE TABLE IF NOT EXISTS water_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    village VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('working', 'low', 'no_water', 'broken')),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    source_id INTEGER REFERENCES water_sources(id),
    status VARCHAR(50) NOT NULL,
    note TEXT,
    submitted_by VARCHAR(50) DEFAULT 'community',
    approved BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS drought_predictions (
    id SERIAL PRIMARY KEY,
    village VARCHAR(255) NOT NULL,
    risk_level VARCHAR(50) NOT NULL,
    ai_message TEXT,
    rainfall FLOAT,
    confidence_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  -- Insert some mock data if empty
  INSERT INTO water_sources (name, lat, lng, village, status)
  SELECT 'Borehole Central', 9.56, 44.06, 'Hargeisa', 'working'
  WHERE NOT EXISTS (SELECT 1 FROM water_sources);

  INSERT INTO water_sources (name, lat, lng, village, status)
  SELECT 'Village Well 1', 9.55, 44.05, 'Hargeisa', 'low'
  WHERE NOT EXISTS (SELECT 1 FROM water_sources LIMIT 1 OFFSET 1);
`;

async function setup() {
  try {
    console.log("Running schema setup...");
    await pool.query(schema);
    console.log("Schema setup complete.");
  } catch (err) {
    console.error("Error setting up schema:", err);
  } finally {
    pool.end();
  }
}

setup();
