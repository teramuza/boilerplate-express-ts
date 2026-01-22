# Contributing Guide

Thank you for your interest in contributing! This guide covers development setup, coding standards, architecture details, and maintenance procedures.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Coding Standards](#coding-standards)
4. [Project Architecture](#project-architecture)
5. [Maintenance Guide](#maintenance-guide)
6. [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

- Node.js ≥20.0.0 (LTS)
- npm ≥10.0.0 or Yarn ≥1.22.0
- Git

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub
# Click the "Fork" button at https://github.com/teramuza/boilerplate-ts-express

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/boilerplate-ts-express.git
cd boilerplate-ts-express

# 3. Add upstream remote
git remote add upstream https://github.com/teramuza/boilerplate-ts-express.git

# 4. Install dependencies
npm install             # or: yarn install

# 5. Setup environment
./setup.sh              # Auto-detects npm or Yarn

# 6. Create feature branch
git checkout -b feature/your-feature
```

---

## Development Workflow

### 1. Keep Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Make Changes

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes, then check quality
npm run lint
npm run format
npm run type-check
```

### 3. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format: <type>(<scope>): <subject>
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in logging"
git commit -m "docs: update API documentation"
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

### 4. Push and Create PR

```bash
git push origin feature/amazing-feature
```

Then create a Pull Request on GitHub.

---

## Coding Standards

### TypeScript

**✅ Do:**
```typescript
// Use explicit types
const getUser = (id: number): Promise<User> => { };

// Define interfaces
interface User {
    id: number;
    name: string;
    email: string;
}

// Avoid 'any', use 'unknown' if needed
const handleData = (data: unknown) => { };
```

**❌ Don't:**
```typescript
// Avoid 'any'
const getUser = (id: any): any => { };

// Avoid implicit types
const data = fetch(); // What type is this?
```

### Path Aliases

Always use path aliases:

```typescript
// ✅ Good
import BaseController from '@lib/base/BaseController';
import ErrorCodes from '@constant/ErrorCodes';

// ❌ Bad
import BaseController from '../../../lib/base/BaseController';
```

### Controllers

Extend `BaseController` and export singleton:

```typescript
class MyController extends BaseController {
    public async getData(req: Request, res: Response) {
        try {
            // Use helper methods
            const id = this.getParamId(req);
            
            // Your logic
            const data = await fetchData(id);
            
            // Use response methods
            this.successHandler(res, 'Success', data);
        } catch (error) {
            this.handleError(res, error as ErrorResponse);
        }
    }
}

export default new MyController();
```

### Error Handling

Always wrap in try-catch:

```typescript
public async action(req: Request, res: Response) {
    try {
        // Your logic
    } catch (error) {
        this.handleError(res, error as ErrorResponse);
    }
}
```

### Code Style

Run Prettier before committing:

```bash
npm run format
```

**Configuration:**
- Indentation: 4 spaces
- Quotes: Single quotes
- Semicolons: Required
- Line width: 80 characters

### File Naming

- **Controllers**: `User.controller.ts`
- **Services**: `user.service.ts`
- **Utils**: `tokenUtils.ts`
- **Constants**: `ErrorCodes.ts`

---

## Project Architecture

### Directory Structure

```
src/
├── components/          # Feature modules (domain-driven)
│   ├── example/
│   │   ├── Example.controller.ts
│   │   └── index.ts    # Routes
│   └── routes.ts       # Main router
│
├── lib/base/           # Base classes
│   ├── BaseController.ts     # Request handling helpers
│   └── ResponseHandler.ts    # Response formatting
│
├── utils/              # Pure utility functions
│   ├── validationUtils.ts
│   ├── passwordUtils.ts
│   ├── tokenUtils.ts
│   └── logging.ts
│
├── middlewares/        # Express middlewares
│   └── authMiddleware.ts
│
├── constants/          # Application constants
│   ├── HTTPCodes.ts
│   └── ErrorCodes.ts
│
├── interfaces/         # TypeScript interfaces
├── types/             # TypeScript type definitions
└── server.ts          # Application entry point
```

### Component Pattern

Each component follows this structure:

```
components/users/
├── index.ts              # Router (exports Express router)
├── User.controller.ts    # Controller (extends BaseController)
├── User.service.ts       # Business logic (optional)
└── User.type.ts          # Types/interfaces (optional)
```

### Base Classes

**BaseController** provides:
- `getParamId()`, `getQueryId()` - Extract IDs
- `getParamValue()`, `getQueryValue()`, `getBodyValue()` - Extract values
- `successHandler()` - Success responses
- `badRequestResponse()`, `unauthorizedResponse()`, etc. - Error responses
- `handleError()` - Centralized error handling

**ResponseHandler** provides:
- Consistent response formatting
- Error logging
- Status code management

### Request Flow

```
Request
  ↓
Router (routes.ts)
  ↓
Middleware (authMiddleware, etc.)
  ↓
Component Router (index.ts)
  ↓
Controller (*.controller.ts)
  ├─→ Validation (validationUtils)
  ├─→ Service Layer (optional)
  └─→ Response (ResponseHandler methods)
  ↓
Response
```

### Design Principles

1. **Single Responsibility** - Each file has one clear purpose
2. **DRY** - Use base classes and utilities
3. **Type Safety** - Leverage TypeScript strict mode
4. **Error Handling** - Consistent error responses
5. **Validation** - Validate all inputs
6. **Security** - JWT, bcrypt, helmet, rate limiting

---

## Maintenance Guide

### Monthly Tasks

**Using npm:**
```bash
# 1. Check for updates
npm run check-updates

# 2. Review changes (check CHANGELOGs)
# Visit npm pages of packages with major updates

# 3. Update dependencies
npm run update-deps

# 4. Security audit
npm audit

# 5. Test everything
npm run build
npm run type-check
npm test
```

**Using Yarn:**
```bash
# 1. Check for updates
yarn outdated

# 2. Review changes (check CHANGELOGs)

# 3. Update dependencies
yarn upgrade

# 4. Security audit
yarn audit

# 5. Test everything
yarn build
yarn type-check
yarn test
```

### Updating Dependencies

**Safe updates** (respects semver):
```bash
npm run update-deps
```

**Major version updates** (manual):
```bash
# Update specific package
npm install typescript@latest

# Check breaking changes
# Read CHANGELOG
# Update code if needed
```

### Security Updates

```bash
# Check vulnerabilities
npm audit

# Auto-fix (if possible)
npm audit fix

# Force fix (⚠️ may break things)
npm audit fix --force
```

### Node.js Updates

This project uses Node.js LTS (v20.x).

Using nvm:
```bash
# Install latest LTS
nvm install --lts

# Use it
nvm use --lts

# Set as default
nvm alias default node
```

### Version Management

**package.json versioning:**
- `^5.0.0` - Compatible with 5.x.x (default)
- `~5.0.0` - Compatible with 5.0.x only
- `5.0.0` - Exact version (locked)

**Always commit `package-lock.json`** for reproducible builds.

### Performance Monitoring

**Production checklist:**
- [ ] `NODE_ENV=production`
- [ ] `DEV_MODE=false`
- [ ] Use compiled code (`npm run serve`)
- [ ] Enable rate limiting
- [ ] Use process manager (PM2)

**Metrics to track:**
- Response time (avg, p95, p99)
- Error rate (4xx, 5xx)
- Requests per second
- CPU & memory usage

### Troubleshooting

**Port in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
npm run type-check
npm run build
```

**Memory issues:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Run `npm run lint` (passes)
- [ ] Run `npm run format` (applied)
- [ ] Run `npm run type-check` (passes)
- [ ] Tested changes thoroughly
- [ ] Updated documentation if needed
- [ ] Updated CHANGELOG.md if applicable

### PR Title Format

```
feat: add user profile endpoints
fix: resolve CORS issue in production
docs: update quick start guide
refactor: simplify error handling
```

### PR Description

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. Maintainer reviews PR
2. Address feedback
3. Approval → Merge
4. Delete feature branch

---

## Code of Conduct

Be respectful and professional:
- ✅ Welcoming and inclusive
- ✅ Respectful of differing viewpoints
- ✅ Accepting constructive criticism
- ✅ Focusing on what's best for the community

---

## Questions?

- Open an issue with "question" label
- Check existing documentation
- Review closed issues

---

**Thank you for contributing!** 🙏
