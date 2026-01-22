# Quick Start & Usage Guide

Complete guide to setup and use this boilerplate.

---

## ✅ Prerequisites

- Node.js ≥20.0.0
- npm ≥10.0.0 or Yarn ≥1.22.0

Check: `node --version && npm --version`  
Or: `node --version && yarn --version`

---

## 🚀 Setup

### Option 1: Automated (Recommended)

```bash
./setup.sh              # Auto-detects npm or Yarn
npm run dev             # or: yarn dev
```

### Option 2: Manual

**Using npm:**
```bash
npm install
cat env.example.txt > .env
npm run dev
```

**Using Yarn:**
```bash
yarn install
cat env.example.txt > .env
yarn dev
```

⚠️ **Edit `.env` and change `JWT_SECRET_KEY`**

---

## 🧪 Test

```bash
# Health check
curl http://localhost:3000/health

# Get all items
curl http://localhost:3000/api/v1/example

# Create item
curl -X POST http://localhost:3000/api/v1/example \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"My first item"}'
```

---

## 🏗️ Create Your First Component

### 1. Create Files

```bash
mkdir -p src/components/todos
```

### 2. Controller (`src/components/todos/Todo.controller.ts`)

```typescript
import { Request, Response } from 'express';
import BaseController from '@lib/base/BaseController';
import { ErrorResponse } from '@util/responseUtils';
import { validateObject } from '@util/validationUtils';

class TodoController extends BaseController {
    public async getAll(req: Request, res: Response) {
        try {
            const todos = [
                { id: 1, title: 'Learn API', done: false },
                { id: 2, title: 'Build Feature', done: true }
            ];
            this.successHandler(res, 'Success', todos);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }

    public async create(req: Request, res: Response) {
        try {
            const validation = validateObject(req.body, {
                title: { required: true, type: 'string', minLength: 3 }
            });

            if (!validation.isValid) {
                this.badRequestResponse(res, 'Validation failed', 40001, validation.errors);
                return;
            }

            const todo = {
                id: Date.now(),
                title: req.body.title,
                done: false
            };

            this.successHandler(res, 'Created', todo);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }
}

export default new TodoController();
```

### 3. Router (`src/components/todos/index.ts`)

```typescript
import express from 'express';
import TodoController from './Todo.controller';

const router = express.Router();

router.get('/', TodoController.getAll.bind(TodoController));
router.post('/', TodoController.create.bind(TodoController));

export default router;
```

### 4. Register (`src/components/routes.ts`)

```typescript
import todoRouter from './todos';

// Add this line
router.use('/todos', todoRouter);
```

### 5. Test

```bash
# Get todos
curl http://localhost:3000/api/v1/todos

# Create todo
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"My first todo"}'
```

---

## 📘 Common Patterns

### Validation

```typescript
const validation = validateObject(req.body, {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'password' },
    age: { type: 'number', min: 18, max: 100 }
});

if (!validation.isValid) {
    this.badRequestResponse(res, 'Validation failed', 40001, validation.errors);
    return;
}
```

### Get Parameters

```typescript
const id = this.getParamId(req);              // /:id
const page = this.getQueryValue(req, 'page'); // ?page=1
const name = this.getBodyValue(req, 'name');  // body.name
```

### Responses

```typescript
this.successHandler(res, 'Success', data);
this.badRequestResponse(res, 'Error message', 40001);
this.unauthorizedResponse(res, { code: 401, message: 'Unauthorized' });
this.notFoundResponse(res, 'Not found');
this.handleError(res, error);
```

### Authentication

Enable in `routes.ts`:

```typescript
import authMiddleware from '@middleware/authMiddleware';

router.use(authMiddleware);  // All routes below require JWT
router.use('/protected', protectedRouter);
```

Use token:

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/v1/protected
```

Access user:

```typescript
const userId = req.user?.id;
```

---

## 🚢 Production Build

**Using npm:**
```bash
npm run build
npm run prepare:prod
# Edit .env with production values
npm run serve
```

**Using Yarn:**
```bash
yarn build
yarn prepare:prod
# Edit .env with production values
yarn serve
```

**Or with PM2:**
```bash
npm install -g pm2      # or: yarn global add pm2
pm2 start dist/server.js --name api
```

---

## 🔧 Useful Commands

**With npm:**
```bash
npm run dev              # Development server
npm run build            # Compile TypeScript
npm run lint             # Check code quality
npm run format           # Auto-format code
npm run check-updates    # Check outdated packages
```

**With Yarn:**
```bash
yarn dev                 # Development server
yarn build               # Compile TypeScript
yarn lint                # Check code quality
yarn format              # Auto-format code
yarn outdated            # Check outdated packages
```

---

## 🆘 Troubleshooting

**Port in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Module not found:**
```bash
# Restart dev server (Ctrl+C then npm run dev)
```

---

## 📚 Next Steps

- Read [README.md](README.md) for complete documentation
- See [CONTRIBUTING.md](CONTRIBUTING.md) for architecture details
- Add database: Sequelize, Prisma, or TypeORM
- Add validation: Zod or Joi
- Setup testing: Jest + Supertest

---

## 🎨 Using Path Aliases

Import with clean paths:

```typescript
// ✅ Good
import BaseController from '@lib/base/BaseController';
import ErrorCodes from '@constant/ErrorCodes';
import { ErrorResponse } from '@util/responseUtils';

// ❌ Bad
import BaseController from '../../../lib/base/BaseController';
```

**Available aliases:**
- `@component/*` → `src/components/*`
- `@constant/*` → `src/constants/*`
- `@lib/*` → `src/lib/*`
- `@middleware/*` → `src/middlewares/*`
- `@util/*` → `src/utils/*`

---

## 📝 API Response Formats

### Success Response
```json
{
  "message": "Success message",
  "data": { "id": 1, "name": "Item" }
}
```

### Error Response
```json
{
  "type": "bad_request",
  "error": {
    "message": "Validation failed",
    "code": 40001,
    "info": { "field": "email", "message": "Invalid format" }
  }
}
```

---

## 🔐 Configuration

### Environment Variables

Edit `.env` file:

```env
NODE_ENV=development          # development | production
APP_PORT=3000                 # Server port
JWT_SECRET_KEY=your-secret    # ⚠️ CHANGE THIS
DEV_MODE=true                 # Enable logging
```

**⚠️ Important:** Always change `JWT_SECRET_KEY` before deployment!

---

## 📦 Package Managers

### Using npm or Yarn

Both package managers are supported. The `setup.sh` script auto-detects which one you have.

**Switch from npm to Yarn:**
```bash
rm package-lock.json
yarn install
```

**Switch from Yarn to npm:**
```bash
rm yarn.lock
npm install
```

**Best Practice:** Keep only one lock file per project.

---

## 🔧 All Available Commands

### Development
```bash
npm run dev              # Start dev server (hot reload)
yarn dev                 # Same with Yarn

npm run start            # Run with ts-node
yarn start               # Same with Yarn
```

### Build & Production
```bash
npm run build            # Compile TypeScript → JavaScript
npm run clean            # Remove dist folder
npm run serve            # Run production build
```

### Code Quality
```bash
npm run type-check       # TypeScript type checking
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run lint             # Run type-check + format-check
```

### Environment Management
```bash
npm run prepare:dev      # Copy .env.development → .env
npm run prepare:prod     # Copy .env.production → .env
```

### Maintenance
```bash
npm run check-updates    # Check for outdated packages
npm run update-deps      # Update dependencies
npm audit                # Security vulnerability check

# Or with Yarn
yarn outdated            # Check for outdated packages
yarn upgrade             # Update dependencies
yarn audit               # Security check
```

---

## 🛡️ Security Features

- **Helmet** - Security headers
- **Rate Limiting** - 100 requests per 15 minutes (production)
- **JWT Authentication** - Ready to use
- **Bcrypt** - Password hashing
- **Input Validation** - Built-in utilities
- **CORS** - Cross-origin resource sharing
- **Body Limit** - 10MB request size limit

---

## 📊 Health Check Endpoint

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-22T10:00:00.000Z",
  "uptime": 123.45,
  "environment": "development",
  "version": "1.0.0"
}
```

---

## 🔍 Maintenance

### Monthly Tasks

```bash
# 1. Check for updates
npm run check-updates

# 2. Review changes (check package CHANGELOGs)

# 3. Update dependencies
npm run update-deps

# 4. Security audit
npm audit

# 5. Test everything
npm run build
npm run type-check
```

---

**Done!** You now have a complete guide. Start building! 🚀

**For architecture details:** See [CONTRIBUTING.md](CONTRIBUTING.md)

