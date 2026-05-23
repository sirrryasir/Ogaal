CREATE TABLE water_sources (
    id SERIAL PRIMARY KEY,

    name TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT,

    source_type TEXT NOT NULL CHECK (
        source_type IN ('WELL', 'BOREHOLE', 'BERKAD', 'SPRING')
    ),

    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,

    design_capacity_liters INTEGER NOT NULL,
    current_capacity_liters INTEGER NOT NULL,

    population_served INTEGER NOT NULL,

    installation_date DATE,
    operational_status TEXT NOT NULL CHECK (
        operational_status IN ('OPERATIONAL', 'LIMITED', 'NON_FUNCTIONAL')
    ),

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE daily_usage (
    id SERIAL PRIMARY KEY,

    water_source_id INTEGER NOT NULL
        REFERENCES water_sources(id)
        ON DELETE CASCADE,

    usage_date DATE NOT NULL,

    total_extracted_liters INTEGER NOT NULL,
    avg_flow_rate_lpm DECIMAL(6,2) NOT NULL,
    hours_of_operation INTEGER NOT NULL,

    downtime_hours INTEGER DEFAULT 0,

    recorded_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (water_source_id, usage_date)
);

CREATE TABLE water_quality_tests (
    id SERIAL PRIMARY KEY,

    water_source_id INTEGER NOT NULL
        REFERENCES water_sources(id)
        ON DELETE CASCADE,

    test_date DATE NOT NULL,

    ph DECIMAL(4,2),
    turbidity_ntu DECIMAL(6,2),
    salinity_ppm DECIMAL(8,2),

    contamination_risk TEXT CHECK (
        contamination_risk IN ('LOW', 'MEDIUM', 'HIGH')
    ),

    tested_by TEXT,
    remarks TEXT
);

CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,

    water_source_id INTEGER NOT NULL
        REFERENCES water_sources(id)
        ON DELETE CASCADE,

    intervention_type TEXT NOT NULL CHECK (
        intervention_type IN (
            'REPAIR',
            'CLEANING',
            'UPGRADE',
            'EMERGENCY_REFILL',
            'DECOMMISSION'
        )
    ),

    intervention_date DATE NOT NULL,
    resolved BOOLEAN DEFAULT TRUE,

    cost_usd DECIMAL(10,2),
    notes TEXT
);


CREATE TABLE climate_observations (
    id SERIAL PRIMARY KEY,

    district TEXT NOT NULL,
    observation_date DATE NOT NULL,

    rainfall_mm DECIMAL(8,2),
    temperature_c DECIMAL(5,2),
    soil_moisture_pct DECIMAL(5,2),
    evapotranspiration_mm DECIMAL(8,2),

    source TEXT CHECK (
        source IN ('SATELLITE', 'WEATHER_STATION', 'API')
    ),

    UNIQUE (district, observation_date)
);

INSERT INTO water_sources (name, district, village, source_type, latitude, longitude, design_capacity_liters, current_capacity_liters, population_served, operational_status)
VALUES 
('Wadajir Well', 'Hargeisa', 'Wadajir', 'WELL', 9.559, 44.062, 5000, 4800, 1200, 'OPERATIONAL'),
('Berbera Borehole', 'Berbera', 'Downtown', 'BOREHOLE', 10.435, 45.015, 8000, 7600, 2000, 'LIMITED');


INSERT INTO daily_usage (water_source_id, usage_date, total_extracted_liters, avg_flow_rate_lpm, hours_of_operation)
VALUES (1, CURRENT_DATE, 4000, 25.0, 12);


CREATE TABLE community_reports (
    id SERIAL PRIMARY KEY,
    water_source_id INTEGER NOT NULL REFERENCES water_sources(id) ON DELETE CASCADE,
    report_date TIMESTAMP DEFAULT NOW(),
    queue_length INTEGER,
    fetch_time_minutes INTEGER,
    complaints_count INTEGER
);

CREATE TABLE community_signals (
    id SERIAL PRIMARY KEY,
    water_source_id INTEGER NOT NULL REFERENCES water_sources(id) ON DELETE CASCADE,
    signal_date TIMESTAMP DEFAULT NOW(),
    queue_length_score INTEGER,
    fetch_time_score INTEGER,
    complaints_score INTEGER,
    overall_signal_score INTEGER
);

INSERT INTO water_sources (
    name, district, village, source_type,
    latitude, longitude,
    design_capacity_liters, current_capacity_liters,
    population_served, operational_status
) VALUES
-- 🔴 SOURCE 1: CRITICAL – NON FUNCTIONAL + HIGH POPULATION
('Balligubadle Central Borehole', 'Balligubadle', 'Central',
 'BOREHOLE', 9.015400, 43.220100,
 12000, 1200,
 4200, 'NON_FUNCTIONAL'),

-- 🟠 SOURCE 2: LIMITED CAPACITY – HIGH USAGE
('Qoolcad Berkad', 'Balligubadle', 'Qoolcad',
 'BERKAD', 9.028800, 43.245600,
 6000, 1800,
 2600, 'LIMITED'),

-- 🟡 SOURCE 3: OPERATIONAL BUT UNDER SIZED
('Ceel Yar Well', 'Balligubadle', 'Ceel Yar',
 'WELL', 9.045300, 43.198400,
 3000, 2100,
 1800, 'OPERATIONAL');

INSERT INTO daily_usage (
    water_source_id, usage_date,
    total_extracted_liters,
    avg_flow_rate_lpm,
    hours_of_operation,
    downtime_hours
) VALUES
-- Borehole barely working
(3, CURRENT_DATE, 900, 8.5, 6, 12),

-- Berkad overused
(4, CURRENT_DATE, 2200, 18.0, 14, 4),

-- Well at max stress
(5, CURRENT_DATE, 2000, 15.0, 12, 2);

INSERT INTO water_quality_tests (
    water_source_id, test_date,
    ph, turbidity_ntu, salinity_ppm,
    contamination_risk, tested_by
) VALUES
(3, CURRENT_DATE, 6.1, 18.4, 950, 'HIGH', 'NGO Lab'),
(4, CURRENT_DATE, 6.8, 11.2, 620, 'MEDIUM', 'District Health'),
(5, CURRENT_DATE, 7.1, 6.5, 410, 'LOW', 'District Health');

INSERT INTO community_signals (
    water_source_id,
    queue_length_score,
    fetch_time_score,
    complaints_score,
    overall_signal_score
) VALUES
-- EXTREME DISTRESS
(3, 10, 9, 10, 9),

-- HIGH DISTRESS
(4, 7, 7, 6, 7),

-- MODERATE
(5, 5, 4, 4, 5);

INSERT INTO climate_observations (
    district, observation_date,
    rainfall_mm,
    temperature_c,
    soil_moisture_pct,
    evapotranspiration_mm,
    source
) VALUES
('Balligubadle', CURRENT_DATE, 3.2, 39.6, 8.4, 7.9, 'SATELLITE');
