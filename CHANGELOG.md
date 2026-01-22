# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-22

### Added
- Initial release of Boilerplate-Express-TS
- BaseController with helper methods for parameter extraction
- ResponseHandler for centralized response handling
- Authentication middleware with JWT support
- Password hashing utilities with bcrypt
- Token generation and verification utilities
- Logging system with environment-based configuration
- Path aliases for clean imports
- Example CRUD component demonstrating best practices
- Security middleware (Helmet)
- Rate limiting for API protection
- CORS support
- TypeScript strict mode configuration
- Hot reload development setup with Nodemon
- Prettier code formatting configuration
- Environment-based configuration (.env files)
- Comprehensive documentation (README, QUICK_START, PROJECT_INFO)
- Automated setup script (setup.sh)
- Node.js LTS version specification (.nvmrc)
- MIT License
- Contributing guidelines
- Error codes and HTTP status codes constants
- Global error handler
- 404 handler for undefined routes
- Health check endpoint with system information
- Body size limiting (10MB)
- Request logging in development mode

### Dependencies
- express ^4.21.1
- typescript ^5.7.2
- cors ^2.8.5
- helmet ^8.0.0
- express-rate-limit ^7.4.1
- bcrypt ^5.1.1
- jsonwebtoken ^9.0.2
- dotenv ^16.4.5
- ts-node ^10.9.2
- nodemon ^3.1.7
- prettier ^3.4.2
- tsconfig-paths ^4.2.0

### Scripts
- `npm run dev` - Development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm run serve` - Run production build
- `npm run clean` - Remove build artifacts
- `npm run type-check` - TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run lint` - Run all code quality checks
- `npm run check-updates` - Check for outdated dependencies
- `npm run update-deps` - Update dependencies

### Security
- Helmet middleware for security headers
- Rate limiting (100 req/15min in production)
- JWT-based authentication
- Bcrypt password hashing with salt rounds
- Environment variable validation
- Body size limiting
- CORS configuration

## [Unreleased]

### Completed
- [x] Database integration examples (Sequelize with PostgreSQL)
- [x] Environment variable constants (centralized ENV keys)
- [x] Validation utility functions

### Planned Features
- [ ] Validation library integration (Zod, Joi)
- [ ] Testing setup (Jest, Supertest)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Docker configuration
- [ ] CI/CD pipeline examples
- [ ] Advanced logging (Winston, Pino)
- [ ] Caching layer (Redis)
- [ ] File upload handling (Multer)
- [ ] WebSocket support (Socket.io)
- [ ] Background job processing (Bull)
- [ ] Email service integration
- [ ] Monitoring and metrics (Prometheus)
- [ ] Error tracking (Sentry)

---

## Version History

### Version Numbering

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

### How to Update

1. Check what's changed: `npm run check-updates`
2. Review this CHANGELOG for breaking changes
3. Update dependencies: `npm run update-deps`
4. Test your application thoroughly
5. Update your code for any breaking changes

### Maintenance Schedule

- **Security updates**: Applied immediately
- **Dependency updates**: Monthly review
- **Feature releases**: As needed
- **LTS support**: Following Node.js LTS schedule

---

[1.0.0]: https://github.com/teramuza/Boilerplate-Express-TS/releases/tag/v1.0.0
