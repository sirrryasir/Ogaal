# OGAAL: Somaliland Water Intelligence and Early Warning Platform

OGAAL is an integrated water intelligence monitoring, drought early warning, and decision support platform developed in alignment with the Somaliland Ministry of Water Resources Development. The platform aggregates live water source telemetry, manages offline emergency reporting via USSD and SMS, and provides real-time status dashboards for administrative and field coordination.

The system incorporates a specialized Python-based decision intelligence engine that evaluates localized water stress ratios, computes infrastructure failure countdowns, and prioritizes site-specific investment and rehabilitation plans.

---

## System Functions

*   **USSD and SMS Offline Reporting**: A GSM-based, paginated USSD interface (`*789#`) in Somali that allows rural communities to query water source status and report infrastructure failures. The system utilizes Telesom SMS integration secured with dynamic MD5-signed API keys.
*   **Next.js Administrative Portal**: A centralized management interface for ministry officials and NGOs. Features interactive Leaflet maps, community report verification queues, structured relief intervention status trackers (Planned, In Progress, Completed), and regional water telemetry analytics.
*   **Expo Mobile Application**: A React Native mobile app for field inspectors to coordinate site surveys, verify offline community alerts, and upload localized telemetry logs.
*   **Decision Intelligence and Water Stress Analytics**: A Python-based engine (`app/`) that calculates:
    *   **Stress Ratio (SR)**: Area-level water stress assessment based on demand and environmental indicators.
    *   **Failure Countdown**: Environmental depletion and telemetry calculations indicating days remaining before a water source is exhausted.
    *   **Investment Prioritization**: Algorithmic scoring and ranking of water source repair and construction works based on local urgency, population density, and budget constraints.
*   **Telemetry and Drought Modeling Engine**: A simulator module that evaluates regional environmental indicators (soil moisture, temperature, humidity, and water levels) to calculate local drought probability indices and dispatch automated SMS warnings.

---

## Technology Stack

| Component | Framework / Technology | Purpose |
| :--- | :--- | :--- |
| **Backend API** | Express.js, TypeScript, Node.js | Core application logic, USSD sessions, SMS gateway client, and telemetry simulator |
| **Decision Engine** | FastAPI, Python 3.10 | High-performance calculation of water stress models, priority scores, and failure timelines |
| **Database** | PostgreSQL, Prisma ORM | Relational data persistence and Somaliland geographical hierarchy mapping |
| **Web Portal** | Next.js 15, TailwindCSS | Administrative dashboard, geospatial mapping, and status reporting |
| **Mobile App** | React Native, Expo, TypeScript | Field inspector workflow, local caching, and offline data sync |
| **Integrations**| Telesom REST API, SWIMS Dataset | USSD session management, MD5-signed SMS gateway, and CSV telemetry import |

---

## Directory Structure

```
ogaal/
├── app/                # Python FastAPI decision engine
│   ├── api/            # API routing for stress calculations and failure countdowns
│   ├── domain/         # Core evaluation rules, priority scoring, and stress calculators
│   ├── schemas/        # Request and response data contracts
│   └── services/       # Explanation builders and countdown evaluators
├── backend/            # Express.js REST API and USSD server
│   ├── prisma/         # PostgreSQL schema and database seed scripts
│   ├── scripts/        # SWIMS CSV dataset import and status check scripts
│   └── src/            # Controllers, routes, and custom middlewares
├── mobile/             # React Native/Expo mobile app for field inspectors
│   └── src/            # Screen navigation, onboarding, and Somali translations
├── web/                # Next.js 15 administrative portal dashboard
│   ├── app/            # Next.js App Router (Admin, Analytics, USSD Simulator)
│   ├── components/     # Reusable layout and dashboard components
│   └── lib/            # Data fetchers and analytics mappings
└── docs/               # Detailed technical documentation and API guides
    ├── architecture.md      # Decoupled system modules & relational schemas
    ├── ai-early-warning.md  # Predictive drought engine & risk update simulators
    ├── api-reference.md     # REST endpoint routes, body requests, and responses
    └── ussd-system.md       # Paginated Somali USSD menus & Telesom MD5 client
```

---

## Documentation

Comprehensive technical specifications are available in the `docs/` directory:

1.  **[System Architecture and Database Design](docs/architecture.md)**: Visual architectures, PostgreSQL entities, Prisma schemas, and the Somaliland 4-tier administrative location hierarchy.
2.  **[Drought Modeling and Simulation](docs/ai-early-warning.md)**: Specifications for the telemetry processing algorithms, environmental risk indexing, and alert dispatch triggers.
3.  **[REST API Reference](docs/api-reference.md)**: Route definitions, JWT authentication payloads, database query options, and JSON response models for all system layers.
4.  **[USSD Menu and SMS Gateways](docs/ussd-system.md)**: USSD session lifecycle logs, paginated menu utilities, and the MD5-authenticated Telesom API client wrapper.

---

## Installation and Setup

### Prerequisites
*   Node.js (v18.0 or higher)
*   Python (v3.10 or higher)
*   PostgreSQL instance (local or remote)
*   pnpm (recommended) or npm

### 1. Decision Engine Setup (Python)
1.  Navigate to the `app` directory:
    ```bash
    cd app
    ```
2.  Create a virtual environment and install dependencies:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    pip install fastapi uvicorn
    ```
3.  Start the FastAPI application:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

### 2. Backend Server Setup (Node.js)
1.  Navigate to the `backend` directory and install dependencies:
    ```bash
    cd ../backend
    pnpm install
    ```
2.  Create and configure `backend/.env`:
    ```ini
    DATABASE_URL="postgresql://postgres:password@localhost:5432/ogaal"
    JWT_SECRET="your-jwt-auth-secret-key"
    PORT=3001
    
    # Telesom SMS Credentials
    TELESOM_USERNAME="your-username"
    TELESOM_PASSWORD="your-password"
    TELESOM_SENDER_ID="Ogaal1"
    ```
3.  Deploy the Prisma schema to initialize your database:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Seed the database with the Somaliland MOWRD SWIMS dataset:
    ```bash
    pnpm run db:import
    ```
5.  Start the development API server:
    ```bash
    pnpm run dev
    ```

### 3. Next.js Web Dashboard Setup
1.  Navigate to the `web` directory and install dependencies:
    ```bash
    cd ../web
    pnpm install
    ```
2.  Run the Next.js development server:
    ```bash
    pnpm run dev
    ```
3.  Access the admin interface at [http://localhost:3000](http://localhost:3000).

### 4. Expo Mobile App Setup
1.  Navigate to the `mobile` directory and install dependencies:
    ```bash
    cd ../mobile
    pnpm install
    ```
2.  Start the Expo development server:
    ```bash
    npx expo start
    ```

---

## License and Credits

Developed and engineered by **Yasir (@sirrryasir)**.

Copyright © 2026. Registered in collaboration with the Somaliland Ministry of Water Resources Development. All rights reserved.
