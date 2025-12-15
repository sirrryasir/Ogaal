# Source Code Structure

This document explains the organization and purpose of the source code files in the `src/` directory.

## Directory Structure

```
src/
├── app.ts              # Main Express application setup
├── server.ts           # Server entry point and startup
├── controllers/        # Request handlers (controllers)
│   └── authController.ts
├── routes/             # Route definitions and middleware
│   └── authRoutes.ts
├── services/           # Business logic and external service integrations
│   └── authService.ts
├── middlewares/        # Custom Express middlewares
├── config/             # Configuration files and constants
└── generated/          # Auto-generated files (Prisma client)
```

## File Explanations

### app.ts
The main Express application file that:
- Configures the Express app instance
- Sets up global middlewares (CORS, JSON parsing, etc.)
- Registers route handlers
- Exports the configured app for use in server.ts

### server.ts
The server entry point that:
- Imports the configured Express app
- Sets the port from environment variables
- Starts the HTTP server
- Logs server startup information

### controllers/authController.ts
Handles HTTP requests for authentication endpoints:
- `register`: Processes user registration requests
- `login`: Processes user login requests
- Validates request data and calls appropriate service methods
- Returns appropriate HTTP responses with status codes

### routes/authRoutes.ts
Defines the routing for authentication endpoints:
- Maps HTTP methods and paths to controller methods
- Groups related routes under `/auth` prefix
- Can include route-specific middlewares (future use)

### services/authService.ts
Contains the core business logic for authentication:
- `register`: Creates new users with hashed passwords
- `login`: Validates credentials and generates JWT tokens
- Interacts with the database via Prisma client
- Handles password hashing and JWT generation

## Architecture Patterns

### MVC Pattern
The codebase follows a simplified MVC (Model-View-Controller) pattern:
- **Models**: Handled by Prisma ORM (database schemas)
- **Views**: JSON responses (API endpoints)
- **Controllers**: Handle requests and responses
- **Services**: Contain business logic

### Separation of Concerns
- **Routes**: Define endpoints and HTTP methods
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic and data operations
- **Models**: Define data structures (via Prisma schema)

### Dependency Injection
Services are instantiated as static classes to avoid dependency injection complexity, suitable for this small application.

## Data Flow

1. **Request** → Route handler matches URL and method
2. **Route** → Calls appropriate controller method
3. **Controller** → Validates request and calls service method
4. **Service** → Performs business logic and database operations
5. **Service** → Returns data to controller
6. **Controller** → Formats response and sends to client

## Error Handling

- Services throw descriptive error messages
- Controllers catch errors and return appropriate HTTP status codes
- Client receives consistent error response format

## Security Considerations

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for session management
- Input validation is performed at controller level
- CORS is configured for cross-origin requests

## Extensibility

The structure is designed to be easily extensible:
- Add new controllers in `controllers/` directory
- Add new routes in `routes/` directory
- Add new services in `services/` directory
- Add middlewares in `middlewares/` directory
- Update `app.ts` to register new routes

## Environment Configuration

- Environment variables are loaded via `dotenv`
- Database connection and JWT secrets are configurable
- Server port is configurable via `PORT` environment variable

## CREATED AND INSTRAUCTURED BY SALMAN ABDIKADIR ALI (BAASHE)