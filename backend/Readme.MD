# OGAAL PLATFORM - Backend API with Authentication EXPRESS/TYPESCRIPT

A TypeScript Express.js backend application for the OGAAL PLATFORM with user authentication, using Prisma ORM and PostgreSQL.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- TypeScript support
- CORS enabled
- Health check endpoint
- Report management
- Water source management
- USSD integration
- API routes

## Project Structure

```
src/
├── app.ts              # Express app configuration
├── server.ts           # Server entry point
├── controllers/        # Route handlers
│   ├── apiController.ts
│   ├── authController.ts
│   ├── reportController.ts
│   ├── ussdController.ts
│   └── waterSourceController.ts
├── routes/             # API routes
│   ├── apiRoutes.ts
│   ├── authRoutes.ts
│   ├── reportRoutes.ts
│   ├── ussdRoutes.ts
│   └── waterSourceRoutes.ts
├── middlewares/        # Custom middlewares
│   └── authMiddleware.ts
├── models/             # Data models
│   └── authModel.ts
├── config/             # Configuration files
│   └── prisma.ts
├── types/              # TypeScript type definitions
│   └── express.d.ts
prisma/
├── schema.prisma       # Database schema
├── seed.ts             # Database seeding
└── migrations/         # Database migrations
scripts/
├── import_swims_data.ts
├── SCRIPT.MD
└── seed_status.ts
```

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn

## Installation

Follow these step-by-step instructions to set up the backend:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs all necessary dependencies including Express, Prisma, bcrypt, jsonwebtoken, etc.

### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

### Step 4: Configure Prisma

Prisma is already initialized. The schema is defined in `prisma/schema.prisma`.

### Step 5: Set Up the Database

Create and apply the initial database migration:

```bash
npx prisma migrate dev --name init
```

This will:
- Create migration SQL files
- Apply migrations to your database
- Generate the Prisma Client

### Step 6: Generate Prisma Client

```bash
npx prisma generate
```

### Step 7: Verify Database Connection (Optional)

```bash
# Push schema to database
npx prisma db push

# Open Prisma Studio to view data
npx prisma studio
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

The server will start on port 3000 (or the port specified in `.env`).

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user-id",
        "email": "user@example.com"
      },
      "token": "jwt-token"
    }
  }
  ```

#### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user-id",
        "email": "user@example.com"
      },
      "token": "jwt-token"
    }
  }
  ```

### Health Check
- **GET** `/health`
- **Response:**
  ```json
  {
    "status": "OK",
    "message": "Server is running"
  }
  ```

### Reports
- **GET** `/api/reports` - Get all reports
- **POST** `/api/reports` - Create a report
- **GET** `/api/reports/:id` - Get report by ID
- **PUT** `/api/reports/:id` - Update report
- **DELETE** `/api/reports/:id` - Delete report

### Water Sources
- **GET** `/api/water-sources` - Get all water sources
- **POST** `/api/water-sources` - Create a water source
- **GET** `/api/water-sources/:id` - Get water source by ID
- **PUT** `/api/water-sources/:id` - Update water source
- **DELETE** `/api/water-sources/:id` - Delete water source

### USSD
- **POST** `/ussd` - Handle USSD requests

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply database migrations
- `npx prisma generate` - Generate Prisma Client

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT token generation
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-restart

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `PORT` | Server port | 3000 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if any)
5. Submit a pull request

## License

No licence for now

ISC

## CREATED AND INSTRUCTURED BY SALMAN ABDIKADIR ALI (BAASHE)
