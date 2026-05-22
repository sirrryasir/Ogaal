# System Architecture & Database Design

The **OGAAL Platform** (Somali for *Aware* or *Informed*) is a comprehensive, multi-channel water resources monitoring and early warning system designed for Somaliland. By leveraging modern web, mobile, and USSD interfaces, OGAAL bridges the gap between offline communities, field workers, government officials, and NGOs.

---

## 1. System Overview

OGAAL is designed with a decoupled, modular monorepo architecture:

```mermaid
graph TD
    %% Clients
    USSD[USSD Interface via Telesom] -->|HTTP POST| BE[Express.js Backend API]
    Web[Next.js Dashboard] -->|REST API| BE
    Mobile[React Native/Expo Mobile App] -->|REST API| BE
    
    %% Backend & Processing
    BE -->|Prisma ORM| DB[(PostgreSQL Database)]
    BE -->|Telesom SMS Gateway| SMS[SMS Gateway]
    BE -->|AI early warning simulator| AI[AIEarly Warning Engine]
    
    %% Notifications
    SMS -->|Unicode SMS| UserPhone[User's Mobile Phone]
    AI -->|Trigger| Alerts[Alert Management]
```

### Component Breakdown
*   **Backend (Express + TypeScript + Prisma)**: The central brain of the platform. Exposes clean REST API endpoints for the dashboard and mobile app, processes live USSD sessions from telecom gateways, executes AI risk early-warnings, and triggers real-time SMS broadcasts.
*   **Web Portal (Next.js 15 + TailwindCSS + Lucide)**: An administrative dashboard used by the Somaliland Ministry of Water Resources Development (MOWRD), NGOs, and administrative teams to track water point statuses, manage relief interventions, view analytics, and respond to community reports.
*   **Mobile App (React Native + Expo)**: Used by field inspectors and local community leaders to check local water points, submit detailed verified reports, upload site photos, and view regional drought statuses offline or online.
*   **USSD Interface (Express)**: An offline channel designed for remote community members to check local water points and report issues using simple GSM feature phones, working in complete harmony with the **Telesom SMS Gateway**.

---

## 2. Database Schema (Prisma)

The PostgreSQL database schema is structured around location hierarchies, water sources, report states, and analytical models:

```mermaid
erDiagram
    REGION ||--o{ DISTRICT : "contains"
    DISTRICT ||--o{ VILLAGE : "contains"
    VILLAGE ||--o{ WATER_SOURCE : "hosts"
    VILLAGE ||--o{ REPORT : "located in"
    VILLAGE ||--o{ ALERT : "affects"
    VILLAGE ||--o{ AI_PREDICTION : "analyzes"
    VILLAGE ||--o{ INTERVENTION : "supports"
    
    WATER_SOURCE ||--o{ REPORT : "has"
    WATER_SOURCE ||--o{ INTERVENTION : "requires"
    WATER_SOURCE ||--o{ SENSOR_READING : "tracks"
    
    NGO ||--o{ USER : "employs"
    NGO ||--o{ INTERVENTION : "deploys"
    
    USER ||--o{ REPORT : "submits"
    
    REGION {
        Int id PK
        String name UK
    }
    DISTRICT {
        Int id PK
        String name
        Int region_id FK
    }
    VILLAGE {
        Int id PK
        String name
        Int district_id FK
        Float latitude
        Float longitude
        String drought_risk_level
    }
    WATER_SOURCE {
        Int id PK
        Int village_id FK
        String name
        String type
        String status
        Float water_level
        String inspecting_agency
        String establishing_agency
        String water_source_photo
        DateTime last_maintained
    }
    USER {
        Int id PK
        String fullName
        String email UK
        String password
        UserRole role
        Int ngo_id FK
    }
    NGO {
        Int id PK
        String name UK
        String description
        String contact
    }
    REPORT {
        Int id PK
        Int user_id FK
        Int village_id FK
        Int water_source_id FK
        Int region_id FK
        Int district_id FK
        String reporter_phone
        String reporter_name
        String reporter_type
        String content
        ReportStatus status
        String issue_type
        Boolean is_verified
        DateTime timestamp
    }
    INTERVENTION {
        Int id PK
        Int ngo_id FK
        Int water_source_id FK
        Int village_id FK
        String type
        String description
        String status
        DateTime start_date
        DateTime end_date
    }
    ALERT {
        Int id PK
        Int village_id FK
        String message
        String severity
        Boolean is_active
        DateTime created_at
    }
    SENSOR_READING {
        Int id PK
        Int water_source_id FK
        Float soil_moisture
        Float temperature
        Float humidity
        Float water_level
        DateTime timestamp
    }
    AI_PREDICTION {
        Int id PK
        Int village_id FK
        DateTime prediction_date
        Float drought_risk
        String predicted_level
        Float confidence_score
    }
```

### Enumeration Models
1.  **User Roles (`UserRole`)**:
    *   `ADMIN`: Full platform configuration and user management.
    *   `GOVERNMENT`: Somaliland MOWRD personnel with view-only or verification access.
    *   `NGO_WORKER`: Relief agency staff tracking and adding interventions.
    *   `COMMUNITY_MEMBER`: Field agents and localized monitors.
2.  **Report Statuses (`ReportStatus`)**:
    *   `WORKING`: Water source is fully operational.
    *   `BROKEN`: Pump, generator, or pipe structure is damaged.
    *   `DRY`: The water source has completely run dry.
    *   `LOW_WATER`: Water table is dropping rapidly.
    *   `CONTAMINATION`: Water quality has degraded or become unsafe.

---

## 3. Location Hierarchy

All operations in OGAAL drill down using Somaliland's administrative hierarchy:
$$\text{Region} \rightarrow \text{District} \rightarrow \text{Village} \rightarrow \text{Water Source}$$

*   **SWIMS Alignment**: The database maps regions into six key Somaliland administrative zones imported directly from MOWRD SWIMS datasets:
    1.  **Awdal**
    2.  **Maroodi Jeex** (mapped from Hargeisa/Gebiley)
    3.  **Saaxil** (mapped from Berbera)
    4.  **Togdheer**
    5.  **Sanaag**
    6.  **Sool**

---

## 4. Key Integrations
1.  **Telesom USSD Channel**: Receives session traffic from Telesom mobile gateways and decodes paginated choices dynamically.
2.  **Telesom SMS REST Client**: Sends automated unicode alerts using MD5 salted dynamic authorization headers:
    $$\text{authKey} = \text{MD5}(\text{username} + \text{password} + \text{YYYY-MM-DD})$$
3.  **SWIMS Dataset Importer**: Imports clean CSV records matching historical water source coordinates, maintaining data integrity by pruning, mapping, and linking location dependencies automatically.
