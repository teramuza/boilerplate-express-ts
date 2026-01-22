# Boilerplate-Express-TS

Express.js boilerplate with TypeScript, Sequelize ORM, JWT authentication, and security best practices.

[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.7.2-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/teramuza/Boilerplate-Express-TS?style=social)](https://github.com/teramuza/Boilerplate-Express-TS/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/teramuza/Boilerplate-Express-TS)](https://github.com/teramuza/Boilerplate-Express-TS/issues)
[![GitHub Forks](https://img.shields.io/github/forks/teramuza/Boilerplate-Express-TS?style=social)](https://github.com/teramuza/Boilerplate-Express-TS/network/members)

---

## ✨ Features

- **TypeScript** - Strict mode with path aliases
- **Database** - Sequelize ORM with PostgreSQL (example model included)
- **Security** - Helmet, rate limiting, JWT authentication, bcrypt
- **Validation** - Built-in input validation utilities
- **Base Classes** - Reusable controllers and response handlers
- **Hot Reload** - Fast development with Nodemon
- **Production Ready** - Environment config, error handling, logging
- **LTS Packages** - Node.js v20+, stable dependencies
- **Maintainable** - Easy to update, clear architecture

---

## 🚀 Quick Start

```bash
# 1. Setup (automated)
./setup.sh

# 2. Start development
npm run dev         # or: yarn dev

# 3. Test API
curl http://localhost:3000/health
```

**Prerequisites:** Node.js ≥20.0.0, npm ≥10.0.0 or Yarn ≥1.22.0

**For detailed setup and usage:** See [QUICK_START.md](QUICK_START.md)

---

## 📁 Project Structure

```
src/
├── components/          # Feature modules
│   ├── example/        # Example CRUD (no database)
│   ├── users/          # User CRUD (with database)
│   └── routes.ts       # Main router
├── database/           # Database files
│   ├── models/        # Sequelize models
│   ├── migrations/    # Database migrations
│   └── seeders/       # Database seeders
├── config/            # Configuration files
├── lib/base/          # Base classes
├── utils/             # Utilities
├── middlewares/       # Express middlewares
├── constants/         # Constants & error codes
└── server.ts          # Entry point
```

---

## 🎯 What You Get

### Security
- Helmet for security headers
- Rate limiting (100 req/15min in production)
- JWT authentication ready
- Password hashing with bcrypt
- Input validation utilities

### Developer Experience
- Path aliases (`@lib/*`, `@util/*`, etc.)
- BaseController with helper methods
- Centralized error handling
- TypeScript strict mode
- Hot reload development

### Production Ready
- Environment-based configuration
- Health check endpoint
- Standardized API responses
- Logging system
- Example CRUD implementation

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run serve            # Run production build

# Code Quality
npm run lint             # Check types & formatting
npm run format           # Auto-format code
npm run type-check       # TypeScript validation

# Maintenance
npm run check-updates    # Check outdated packages
npm run update-deps      # Update dependencies
npm audit                # Security check
```

All commands work with both **npm** and **yarn**.

---

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Setup & usage guide (start here!)
- **[DATABASE.md](DATABASE.md)** - Database setup with Sequelize
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Architecture, development & maintenance
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[DOCS.md](DOCS.md)** - Documentation navigation

---

## 🚢 Deployment

```bash
# 1. Build
npm run build

# 2. Setup production environment
npm run prepare:prod

# 3. Edit .env with production values

# 4. Run
npm run serve

# Or use PM2
pm2 start dist/server.js --name api
```

**Full deployment guide:** See [QUICK_START.md](QUICK_START.md)

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development workflow
- Coding standards
- Project architecture
- Maintenance guide

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Teuku Raja**

- GitHub: [@teramuza](https://github.com/teramuza)
- Repository: [Boilerplate-Express-TS](https://github.com/teramuza/Boilerplate-Express-TS)

---

## 🆘 Support

- **Documentation:** [QUICK_START.md](QUICK_START.md) for usage guide
- **Issues:** [Report bugs or questions](https://github.com/teramuza/Boilerplate-Express-TS/issues)
- **Pull Requests:** [Contribute improvements](https://github.com/teramuza/Boilerplate-Express-TS/pulls)
- **Architecture:** [CONTRIBUTING.md](CONTRIBUTING.md) for technical details

---

## ⭐ Give it a Star!

If you find this boilerplate helpful, please consider giving it a star on GitHub!

---

**Built with best practices for Node.js, TypeScript, and Express.js**

**Version:** 1.0.0 | **Node.js:** ≥20.0.0 | **License:** MIT
