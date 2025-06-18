# HRIS Backend - Express TypeScript Prisma PostgreSQL

A comprehensive Human Resource Information System (HRIS) backend built with Express.js, TypeScript, Prisma ORM, and PostgreSQL. This modular system supports 12 different HR modules and can be easily extended or modified.

## 🏗️ Architecture

The application follows a modular architecture with the following structure:

```
src/
├── index.ts                          # Main application entry point
├── types/                            # Shared TypeScript types
├── utils/                            # Utility functions
├── shared/                           # Shared middleware and services
│   └── middleware/                   # Authentication, error handling, etc.
└── modules/                          # Feature modules
    ├── auth/                         # Authentication & Authorization
    ├── personnel-information-management/  # Employee management
    ├── timekeeping-attendance/       # Time tracking
    ├── leave-management/             # Leave requests
    ├── payroll-management/           # Payroll processing
    ├── recruitment/                  # Hiring process
    ├── online-job-application-portal/ # Public job applications
    ├── performance-management/       # Performance reviews
    ├── report-generation/            # Reports and analytics
    ├── learning-development/         # Training and development
    ├── system-administration/        # System configuration
    ├── employee-self-service/        # Employee portal
    └── health-wellness/              # Health and wellness
```

## 🚀 Features

### Core Features
- **Modular Architecture**: Each HR module is independent and can be enabled/disabled
- **Role-Based Access Control**: Granular permissions for different user roles
- **JWT Authentication**: Secure token-based authentication
- **Database Management**: Prisma ORM with PostgreSQL
- **API Documentation**: RESTful API endpoints
- **Error Handling**: Comprehensive error handling and logging
- **Validation**: Input validation and sanitization
- **Pagination**: Built-in pagination for large datasets

### HR Modules
1. **Personnel Information Management** - Employee records, profiles, history
2. **Timekeeping & Attendance** - Time tracking, schedules, DTR
3. **Leave Management** - Leave requests, balances, approvals
4. **Payroll Management** - Salary processing, deductions, loans
5. **Recruitment** - Job postings, applications, interviews
6. **Online Job Application Portal** - Public job applications
7. **Performance Management** - Reviews, KPIs, assessments
8. **Report Generation** - Analytics, reports, exports
9. **Learning & Development** - Training programs, courses
10. **System Administration** - Users, roles, permissions
11. **Employee Self Service** - Employee portal features
12. **Health & Wellness** - Health programs, wellness tracking

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- pnpm (recommended) or npm

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hris-backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database and configuration details:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/hris_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   
   # Seed the database with initial data
   pnpm db:seed
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🗄️ Database Setup

### Using PostgreSQL with pgAdmin4

1. **Install PostgreSQL** and **pgAdmin4**
2. **Create a new database** named `hris_db`
3. **Update the DATABASE_URL** in your `.env` file
4. **Run the database commands**:
   ```bash
   pnpm db:generate
   pnpm db:push
   pnpm db:seed
   ```

### Database Schema

The application uses Prisma with a comprehensive schema that includes:
- User management and authentication
- Personnel information and employment history
- Department and organizational structure
- Timekeeping and attendance tracking
- Leave management and balances
- Payroll processing and deductions
- Recruitment and job applications
- Performance reviews and assessments
- Training programs and learning management
- System administration and audit logs

## 🔐 Authentication

The system uses JWT tokens for authentication. Default users are created during seeding:

- **Admin**: `admin` / `Admin123!`
- **HR Manager**: `hr_manager` / `HR123!`
- **Employee**: `employee` / `Employee123!`

### API Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/change-password` - Change password (protected)
- `POST /api/auth/logout` - User logout (protected)

### Personnel Management
- `GET /api/personnel` - Get all personnel (paginated)
- `GET /api/personnel/:id` - Get personnel by ID
- `POST /api/personnel` - Create new personnel
- `PUT /api/personnel/:id` - Update personnel
- `DELETE /api/personnel/:id` - Delete personnel
- `GET /api/personnel/stats` - Get personnel statistics

### Other Modules
Each module has its own set of endpoints following RESTful conventions.

## 📑 Available APIs by Module

### System Administration

#### User Management
| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | `/api/system/users`                      | List all users                              |
| GET    | `/api/system/users/:id`                  | Get user details by ID                      |
| POST   | `/api/system/users`                      | Create a new user                           |
| PUT    | `/api/system/users/:id`                  | Update user details                         |
| DELETE | `/api/system/users/:id`                  | Disable (soft delete) a user                |
| PATCH  | `/api/system/users/:id/password`         | Change a user's password                    |
| PATCH  | `/api/system/users/:id/roles`            | Assign roles to a user (replace all roles)  |

#### Role Management
| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | `/api/system/roles`                      | List all roles                              |
| GET    | `/api/system/roles/:id`                  | Get role details by ID                      |
| POST   | `/api/system/roles`                      | Create a new role                           |
| PUT    | `/api/system/roles/:id`                  | Update role details                         |
| DELETE | `/api/system/roles/:id`                  | Delete a role                               |
| PATCH  | `/api/system/roles/:id/permissions`      | Assign permissions to a role (replace all)  |

#### Permission Management
| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | `/api/system/permissions`                | List all possible permissions (from enum)   |

#### Audit Trail
| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | `/api/system/audit-logs`                 | List audit logs (supports filters)          |
| GET    | `/api/system/audit-logs/:id`             | Get details of a specific audit log         |

---

You can use these APIs with a valid JWT access token and the required permissions. See the earlier sections for usage examples and authentication details.

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with initial data
pnpm db:studio        # Open Prisma Studio

# Testing & Linting
pnpm test             # Run tests
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
```

### Adding New Modules

1. **Create module directory** in `src/modules/`
2. **Create controller** with business logic
3. **Create routes** with proper permissions
4. **Import routes** in `src/index.ts`
5. **Add module configuration** if needed

### Module Structure Example

```
src/modules/your-module/
├── your-module.controller.ts    # Business logic
├── your-module.routes.ts        # Route definitions
├── your-module.service.ts       # Service layer (optional)
├── your-module.types.ts         # Module-specific types (optional)
└── your-module.validation.ts    # Validation schemas (optional)
```

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** with granular permissions
- **Input validation** and sanitization
- **Rate limiting** to prevent abuse
- **CORS protection** for cross-origin requests
- **Helmet.js** for security headers
- **Password hashing** with bcrypt
- **SQL injection protection** via Prisma ORM

## 📊 Monitoring & Logging

- **Morgan** for HTTP request logging
- **Custom error handling** with detailed error messages
- **Audit logging** for sensitive operations
- **Health check endpoint** at `/health`

## 🚀 Deployment

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
JWT_REFRESH_SECRET="your-production-refresh-secret"
PORT=3000
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Module Management

The system is designed to be modular, allowing you to:

- **Enable/disable modules** by commenting out route imports
- **Add new modules** following the established pattern
- **Modify existing modules** without affecting others
- **Customize permissions** per module
- **Extend functionality** with additional features

Each module is self-contained with its own:
- Controllers for business logic
- Routes for API endpoints
- Permissions for access control
- Types for TypeScript support
- Validation for data integrity

This modular approach ensures the system remains maintainable and scalable as your HR needs evolve. 