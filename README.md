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

### Personnel Information Management Administration

#### Dashboard
| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | `/api/personnel/dashboard`               | Get dashboard statistics and summaries       |

#### Personnel 201 File
| Method | Endpoint                                 | Description                                 |
|--------|------------------------------------------|---------------------------------------------|
| GET    | `/api/personnel`                         | List all personnel records                   |
| POST   | `/api/personnel`                         | Create a new personnel record                |
| GET    | `/api/personnel/:id`                     | Get personnel details by ID                   |
| PUT    | `/api/personnel/:id`                     | Update personnel details                      |
| DELETE | `/api/personnel/:id`                     | Archive/remove a personnel record             |

##### Subsections (General Info, Employment, Membership, etc.)
| Method | Endpoint                                                    | Description                                 |
|--------|-------------------------------------------------------------|---------------------------------------------|
| GET    | `/api/personnel/:id/employment-records`                     | Get employment records for personnel        |
| POST   | `/api/personnel/:id/employment-records`                     | Add employment record                       |
| GET    | `/api/personnel/:id/membership-data`                        | Get membership data (GSIS, Pag-Ibig, etc)   |
| POST   | `/api/personnel/:id/membership-data`                        | Add membership data                         |
| GET    | `/api/personnel/:id/merits-violations`                      | Get merits & violations                     |
| POST   | `/api/personnel/:id/merits-violations`                      | Add merit or violation                      |
| GET    | `/api/personnel/:id/admin-cases`                            | Get administrative cases                    |
| POST   | `/api/personnel/:id/admin-cases`                            | Add administrative case                     |

#### Requests Management
| Method | Endpoint                                                    | Description                                 |
|--------|-------------------------------------------------------------|---------------------------------------------|
| GET    | `/api/personnel/requests`                                   | List all requests                           |
| GET    | `/api/personnel/requests/:id`                               | Get request details                         |
| POST   | `/api/personnel/requests`                                   | Create a new request                        |
| PUT    | `/api/personnel/requests/:id`                               | Update a request                            |
| DELETE | `/api/personnel/requests/:id`                               | Delete/cancel a request                     |

##### Request Types (examples)
| Method | Endpoint                                                    | Description                                 |
|--------|-------------------------------------------------------------|---------------------------------------------|
| GET    | `/api/personnel/requests/:id/leaves`                        | Get leave requests for personnel            |
| GET    | `/api/personnel/requests/:id/dtr-adjustments`               | Get DTR adjustment requests                 |
| GET    | `/api/personnel/requests/:id/certifications`                | Get certification requests                  |
| GET    | `/api/personnel/requests/:id/membership-forms`              | Get membership form requests                |
| GET    | `/api/personnel/requests/:id/monetizations`                 | Get monetization requests                   |
| GET    | `/api/personnel/requests/:id/documents`                     | Get document requests                       |

#### Personnel Movement
| Method | Endpoint                                                    | Description                                 |
|--------|-------------------------------------------------------------|---------------------------------------------|
| GET    | `/api/personnel/:id/movements`                              | List all movements for personnel            |
| POST   | `/api/personnel/:id/movements`                              | Add a new personnel movement                |
| GET    | `/api/personnel/:id/movements/:movementId`                  | Get details of a specific movement          |
| PUT    | `/api/personnel/:id/movements/:movementId`                  | Update a personnel movement                 |
| DELETE | `/api/personnel/:id/movements/:movementId`                  | Delete a personnel movement                 |

*Note: Endpoints and features may be expanded as development progresses.*

## 🔧 Development

### Available Scripts

```