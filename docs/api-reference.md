# REST API Reference Documentation

The OGAAL Backend API exposes endpoints to facilitate user authentication, location querying, water source status management, community reports, AI simulations, and admin analytics dashboards.

*   **Base URL**: `http://localhost:3001` or `https://ogaal-api.onrender.com` (Production)
*   **Response Format**: `application/json`

---

## 1. Authentication

### Register User
*   **Endpoint**: `POST /auth/register`
*   **Description**: Registers a new user (default role: `COMMUNITY_MEMBER`).
*   **Request Body**:
    ```json
    {
      "fullName": "Abdi Jama",
      "email": "abdi@ogaal.com",
      "password": "SecretPassword123"
    }
    ```
*   **Success Response (201)**:
    ```json
    {
      "message": "User registered successfully",
      "data": {
        "user": {
          "id": 2,
          "email": "abdi@ogaal.com",
          "fullName": "Abdi Jama",
          "role": "COMMUNITY_MEMBER"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```

### Register Admin User
*   **Endpoint**: `POST /auth/admin/register`
*   **Description**: Registers an administrative user.
*   **Request Body**:
    ```json
    {
      "fullName": "MOWRD Director",
      "email": "director@mowrd.gov.so",
      "password": "SecureDirectorPassword123"
    }
    ```

### User Login
*   **Endpoint**: `POST /auth/login`
*   **Description**: Authenticates users and generates a JWT.
*   **Request Body**:
    ```json
    {
      "email": "admin@ogaal.com",
      "password": "Ogaal@123"
    }
    ```
*   **Success Response (200)**:
    ```json
    {
      "message": "Login successful",
      "data": {
        "user": {
          "id": 1,
          "email": "admin@ogaal.com",
          "fullName": "Ogaal Admin",
          "role": "ADMIN"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```

---

## 2. Location Queries

### Get all Regions
*   **Endpoint**: `GET /api/regions`
*   **Response**: List of all geographical regions (e.g. Maroodi Jeex, Awdal, Sanaag).
    ```json
    [
      { "id": 1, "name": "Maroodi Jeex" },
      { "id": 2, "name": "Awdal" }
    ]
    ```

### Get all Districts
*   **Endpoint**: `GET /api/districts`
*   **Response**: List of all districts.
    ```json
    [
      { "id": 1, "name": "Hargeisa", "region_id": 1 },
      { "id": 2, "name": "Borama", "region_id": 2 }
    ]
    ```

### Get all Villages
*   **Endpoint**: `GET /api/villages`
*   **Response**: List of all villages and their AI drought risk levels.
    ```json
    [
      {
        "id": 1,
        "name": "Arabsiyo",
        "district_id": 1,
        "latitude": 9.68,
        "longitude": 43.76,
        "drought_risk_level": "Medium"
      }
    ]
    ```

---

## 3. Water Sources

### Get all Water Sources
*   **Endpoint**: `GET /api/water-sources`
*   **Query Parameters**:
    *   `village_id` (optional, number): Filter water sources by village.
*   **Response**:
    ```json
    [
      {
        "id": 1,
        "village_id": 1,
        "name": "Arabsiyo Borehole 1",
        "type": "Borehole",
        "status": "Working",
        "water_level": 82.5,
        "latitude": 9.681,
        "longitude": 43.762,
        "inspecting_agency": "Somaliland MOWRD",
        "establishing_agency": "UNICEF",
        "water_source_photo": null,
        "last_maintained": null,
        "village": {
          "id": 1,
          "name": "Arabsiyo",
          "district": {
            "id": 1,
            "name": "Hargeisa",
            "region": {
              "id": 1,
              "name": "Maroodi Jeex"
            }
          }
        }
      }
    ]
    ```

### Add a Water Source
*   **Endpoint**: `POST /api/water-sources`
*   **Request Body**:
    ```json
    {
      "village_id": 1,
      "name": "Gabilay Berkad East",
      "type": "Berkad",
      "status": "Working",
      "water_level": 100.0
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "id": 12
    }
    ```

---

## 4. Community Reports

### Submit a Report
*   **Endpoint**: `POST /api/reports`
*   **Description**: Creates a water source failure or water scarcity report (submitted via App or USSD Simulator).
*   **Request Body**:
    ```json
    {
      "water_source_id": 1,
      "village_id": 1,
      "reporter_type": "User (App)",
      "content": "Generator pump failed. No water flow.",
      "status": "BROKEN"
    }
    ```
*   **Response**:
    ```json
    {
      "success": true,
      "id": 4
    }
    ```

### Get all Reports
*   **Endpoint**: `GET /api/reports`
*   **Response**: List of all reports ordered chronologically by timestamp (newest first).
    ```json
    [
      {
        "id": 4,
        "user_id": null,
        "village_id": 1,
        "water_source_id": 1,
        "reporter_phone": null,
        "reporter_name": null,
        "reporter_type": "User (App)",
        "content": "Generator pump failed. No water flow.",
        "status": "BROKEN",
        "issue_type": null,
        "is_verified": false,
        "timestamp": "2026-05-22T19:00:00.000Z",
        "village": {
          "id": 1,
          "name": "Arabsiyo"
        },
        "water_source": {
          "id": 1,
          "name": "Arabsiyo Borehole 1"
        }
      }
    ]
    ```

---

## 5. Alerts & Early Warnings

### Get all Alerts
*   **Endpoint**: `GET /api/alerts`
*   **Response**: List of all alerts and advisories generated by AI or Admins.
    ```json
    [
      {
        "id": 2,
        "village_id": 1,
        "message": "AI Prediction: Water tables dropping rapidly in Arabsiyo.",
        "severity": "Critical",
        "is_active": true,
        "created_at": "2026-05-22T18:50:00.000Z"
      }
    ]
    ```

### Create manual Alert
*   **Endpoint**: `POST /api/alerts`
*   **Request Body**:
    ```json
    {
      "village_id": 1,
      "message": "Notice: Main borehole down for scheduled maintenance tomorrow.",
      "severity": "Warning"
    }
    ```

---

## 6. Dashboard & Analytics

### Get Stats Overview
*   **Endpoint**: `GET /api/stats`
*   **Response**: Quick summary metrics for the homepage.
    ```json
    {
      "totalSources": 156,
      "pendingReports": 3,
      "criticalZones": 1,
      "recentReports": [ ... ]
    }
    ```

### Get Chart Analytics Data
*   **Endpoint**: `GET /api/analytics`
*   **Response**: Structured metrics grouped for visual chart mapping.
    ```json
    {
      "statusData": [
        { "status": "Working", "count": 128, "color": "#22c55e", "description": "Working" },
        { "status": "Broken", "count": 21, "color": "#ef4444", "description": "Broken" }
      ],
      "villageData": [
        { "village": "Borama Rural", "count": 14, "functional": 12, "nonFunctional": 2, "population": 7000 }
      ],
      "sourceTypeData": [
        { "type": "Borehole", "count": 82, "functional": 71 }
      ],
      "trendData": [
        { "month": "Jan", "functional": 150, "nonFunctional": 50, "repairs": 20 }
      ]
    }
    ```

### Get Admin Water Sources
*   **Endpoint**: `GET /api/admin/water-sources`
*   **Query Parameters**:
    *   `status` (optional): Filter by "functional", "needs_repair", or "non_functional".
    *   `type` (optional): Filter by type (e.g. "Borehole", "Berkad").
*   **Response**: Hierarchical tree of regions, districts, and villages containing summarized lists of water sources:
    ```json
    [
      {
        "region": "Maroodi Jeex",
        "totalSources": 24,
        "avgStatus": 88,
        "districts": [
          {
            "name": "Hargeisa",
            "totalSources": 24,
            "avgStatus": 88,
            "villages": [
              {
                "name": "Arabsiyo",
                "totalSources": 2,
                "avgStatus": 50,
                "functional": 1,
                "needsRepair": 0,
                "nonFunctional": 1,
                "sources": [
                  {
                    "id": 1,
                    "source_name": "Arabsiyo Borehole 1",
                    "water_source_type": "Borehole",
                    "status": "non_functional",
                    "lat": 9.68,
                    "lng": 43.76
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
    ```
