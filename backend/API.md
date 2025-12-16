# Ogaal Backend API Documentation

Base URL: `http://localhost:3001`

## Water Sources

### Get All Water Sources

- **URL**: `/api/water-sources`
- **Method**: `GET`
- **Description**: Retrieves a list of all water sources.
- **Response**: Array of water source objects.

### Create Water Source

- **URL**: `/api/water-sources`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "village_id": 1,
    "name": "New Borehole",
    "type": "Borehole",
    "latitude": 9.56,
    "longitude": 44.06
  }
  ```

### Update Status

- **URL**: `/api/water-sources/:id/status`
- **Method**: `PUT`
- **Body**:
  ```json
  {
    "status": "Broken"
  }
  ```
- **Status Options**: "Working", "Needed Maintenance", "Broken", "Low Water", "Dry".

### Delete Water Source

- **URL**: `/api/water-sources/:id`
- **Method**: `DELETE`

## Reports

### Get All Reports

- **URL**: `/api/reports`
- **Method**: `GET`
- **Description**: Retrieves all submitted reports.

### Create Report

- **URL**: `/api/reports`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "water_source_id": 1,
    "content": "Pump is making noise",
    "reporter_type": "App"
  }
  ```

### Verify Report (Approve)

- **URL**: `/api/reports/:id/verify`
- **Method**: `PUT`

### Delete Report (Reject)

- **URL**: `/api/reports/:id`
- **Method**: `DELETE`

## Authentication

- **URL**: `/api/auth/login`
- **URL**: `/api/auth/register`

## USSD Simulator

- **URL**: `/api/ussd`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "sessionId": "12345",
    "serviceCode": "*789#",
    "phoneNumber": "+252...",
    "text": "1*2"
  }
  ```
