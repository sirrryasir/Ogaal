# AI Early Warning & Simulation System

OGAAL integrates a predictive model and automated alert dispatcher to act as a **Drought Early Warning System**. This framework leverages real-time reports, simulated weather parameters, and water levels to calculate drought risk and dispatch critical advisories before water points fail.

---

## 1. Predictive Risk Engine

The early warning engine operates on a multi-layered scoring matrix:

### Input Parameters
*   **Sensor Readings**: Live telemetry from water points (soil moisture, temperature, humidity, water level).
*   **Crowdsourced Reports**: USSD and field agent reports detailing drops in water levels or structural damages.
*   **Historical Trends**: Depletion rates of water resources in matching villages during dry seasons (Jilaal/Hagaa).

### Scoring Matrix

Risk levels are dynamically calculated and updated on a per-village basis using an algorithmic simulation of environmental parameters:

| Risk Level | Drought Probability Range | Critical Actions & System Triggers |
| :--- | :--- | :--- |
| **Low** | $0.0\% - 25.0\%$ | • Groundwater levels are stable.<br>• Generate general weather and conservation advisories. |
| **Medium** | $25.1\% - 50.0\%$ | • Prepare catchment systems.<br>• Monitor depletion trends. |
| **High** | $50.1\% - 80.0\%$ | • Automated critical alert generation.<br>• Initiate village-level water rationing.<br>• Notify local water committees via SMS. |
| **Severe** | $80.1\% - 100.0\%$ | • High-priority alerts generated.<br>• Auto-dispatch alerts to NGO and MOWRD portals.<br>• Direct SMS warning broadcasts to remote numbers. |

---

## 2. Dynamic Simulation Endpoint

The predictive model is driven by an AI simulator endpoint:
*   **Endpoint**: `POST /api/update-risk`
*   **Description**: Simulates shifting weather patterns, sensor readings, and water depletion rates across randomly selected villages.

### Simulation Logic Flow

```mermaid
flowchart TD
    Start[Trigger /api/update-risk] --> FetchLocations[Fetch all Villages & Water Sources]
    FetchLocations --> PickVillage[Pick Random Village]
    PickVillage --> PickRisk[Randomly Assign Risk: Low, Medium, High, Severe]
    
    %% Risk Evaluation
    PickRisk --> UpdateDB[Update Village in DB]
    UpdateDB --> CheckSeverity{Is Risk High or Severe?}
    
    %% High/Severe Flow
    CheckSeverity -->|Yes| CreateCriticalAlert[Create 'Critical' Alert]
    CreateCriticalAlert --> SelectCriticalMsg[Select Random Urgent Message]
    SelectCriticalMsg --> SaveAlert[Save Alert to DB]
    
    %% Low/Medium Flow
    CheckSeverity -->|No| AdvisoryChance{Roll 50% Probability}
    AdvisoryChance -->|Pass| CreateInfoAlert[Create 'Info' Advisory]
    CreateInfoAlert --> SelectAdvisoryMsg[Select Random Advisory Message]
    SelectAdvisoryMsg --> SaveAlert
    AdvisoryChance -->|Fail| AdjustWater[Adjust Water Levels]
    
    %% Water Source Adjustments
    SaveAlert --> AdjustWater
    AdjustWater --> PickSource[Pick Random Water Source]
    PickSource --> CalcDepletion[Simulate Depletion: +/- 5% change]
    CalcDepletion --> ClampLevel[Clamp Water Level between 0% and 100%]
    ClampLevel --> UpdateSource[Update Water Source in DB]
    UpdateSource --> ReturnJSON[Return JSON Summary response]
```

### Generated Messages & Advisories

Depending on the risk level generated during the simulation, OGAAL automatically dispatches customized advisories:

#### Critical Alerts (High/Severe)
*   *"Drought Risk escalated to Severe. Immediate water rationing required."*
*   *"AI Prediction: Water tables dropping rapidly in [Village Name]."*
*   *"Urgent: High drought conditions detected."*

#### Informational Advisories (Low/Medium)
*   *"AI Advisory: Predicted rainfall in 3 days. Prepare catchment systems."*
*   *"AI Advisory: Water usage optimization recommended."*
*   *"AI Advisory: Groundwater levels stable."*

---

## 3. Real-Time SMS Dispatch

When a high or severe risk event is registered:
1.  **Immediate Log Creation**: A database `Alert` record is generated with a `Critical` severity flag.
2.  **Dashboard Broadcaster**: The Web Portal receives the warning via real-time hooks, rendering red hazard zones on the map.
3.  **Telesom Integration**: If connected to field monitors, a unicode warning message is broadcasted to alert remote community members immediately.
