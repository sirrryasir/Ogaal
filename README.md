# OGAAL: Somaliland Water Intelligence & Early Warning Platform

<p align="center">
  <img src="docs/ogaal_dashboard_preview.png" alt="OGAAL Dashboard Preview" width="100%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"/>
</p>

**OGAAL** (Somali for *Aware*, *Informed*, or *Vigilant*) is an integrated, real-time water intelligence monitoring and drought early warning platform custom-built for Somaliland. 

Designed in alignment with the **Ministry of Water Resources Development (MOWRD)**, OGAAL leverages the **SWIMS (Somaliland Water Information Management System)** dataset to collect live water telemetry, handle emergency SMS and paginated USSD reports from remote villages, and display real-time geographic status maps and automated drought risk predictions.

---

## 🚀 Key Features

*   **Offline Reporting (USSD & SMS Gateway)**: Provides GSM-based paginated USSD menus (`*789#`) in Somali, allowing rural communities to check water availability and report failures (e.g. well damage, dried-up sources) using simple feature phones. Integrates the Telesom SMS REST client with secure dynamic MD5 signing keys.
*   **Administrative Web Portal (Next.js)**: A secure portal for MOWRD officials and NGOs to monitor live maps, approve incoming reports, assign targeted relief interventions (planned, in progress, completed), and view comprehensive status analytics.
*   **Inspector Mobile App (React Native & Expo)**: Enables field inspectors to view local water source maps, submit verified reports, and capture photos of water source structures.
*   **AI Drought Early Warning Engine**: Simulates fluctuating weather indicators (soil moisture, temperature, humidity, water level) across Somaliland villages and auto-generates critical alerts and SMS advisories when drought risk rises to "High" or "Severe".

---

## 🛠️ Technology Stack

| Component | Framework / Technology | Purpose |
| :--- | :--- | :--- |
| **Backend API** | Express.js, TypeScript, Node.js | Core logic, USSD handler, SMS engine, AI simulator |
| **Database** | PostgreSQL, Prisma ORM | Data persistence, location modeling, relational schemas |
| **Web Portal** | Next.js 15, TailwindCSS, Lucide Icons | Admin interface, Leaflet map nodes, analytics |
| **Mobile App** | React Native, Expo, TypeScript | Field inspector tools, local caching |
| **Integrations**| Telesom API, SWIMS CSV Dataset | Mobile USSD sessions, dynamic MD5 SMS Auth, CSV seeding |

---

## 📂 Repository Structure

```
ogaal/
├── backend/            # Express.js REST API & USSD server
│   ├── prisma/         # PostgreSQL schema & database seed scripts
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

## 📖 In-Depth Documentation

We have prepared comprehensive guides for every layer of the OGAAL platform inside the `docs/` folder:

1.  **[System Architecture & Database Design](docs/architecture.md)**: Explore the visual architecture, Prisma DB entities, enumeration types, and Somaliland's 4-tier location hierarchy mapping.
2.  **[AI Early Warning & Simulation System](docs/ai-early-warning.md)**: Learn how OGAAL processes telemetry indicators, computes drought probabilities, and triggers proactive alerts.
3.  **[REST API Reference](docs/api-reference.md)**: Detailed routes, body parameters, and JSON payloads for user authentication, water sources, alerts, reports, and analytics.
4.  **[USSD Menu & SMS Gateways](docs/ussd-system.md)**: Read about Somali USSD navigation trees, paginated USSD menu builders, and Telesom's dynamic MD5 salted gateway client.

---

## ⚙️ Quick Start & Installation

### Prerequisites
*   Node.js (v18.0 or higher)
*   PostgreSQL running locally or on the cloud
*   pnpm (recommended) or npm

### Step 1: Backend Setup
1.  Navigate into `backend/` and install dependencies:
    ```bash
    cd backend
    pnpm install
    ```
2.  Configure your environment in `backend/.env`:
    ```ini
    DATABASE_URL="postgresql://postgres:password@localhost:5432/ogaal"
    JWT_SECRET="your-jwt-auth-secret-key"
    PORT=3001
    
    # Telesom SMS Credentials
    TELESOM_USERNAME="your-username"
    TELESOM_PASSWORD="your-password"
    TELESOM_SENDER_ID="Ogaal1"
    ```
3.  Apply Prisma migrations to initialize the database:
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Import the Somaliland MOWRD SWIMS dataset:
    ```bash
    pnpm run db:import  # Executes scripts/import_swims_data.ts
    ```
5.  Start the development backend server:
    ```bash
    pnpm run dev
    ```

### Step 2: Next.js Web Dashboard Setup
1.  Navigate to `web/` and install dependencies:
    ```bash
    cd ../web
    pnpm install
    ```
2.  Run the Next.js development server:
    ```bash
    pnpm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) to access the landing page, Admin portal, and USSD simulator.

### Step 3: Expo Mobile App Setup
1.  Navigate to `mobile/` and install dependencies:
    ```bash
    cd ../mobile
    pnpm install
    ```
2.  Launch the Expo development server:
    ```bash
    npx expo start
    ```

---

## 🛡️ License

Created and engineered by **Yasir (@sirrryasir)**.

Copyright © 2026. All rights reserved. Registered under the Somaliland Ministry of Water Resources Development initiatives.
