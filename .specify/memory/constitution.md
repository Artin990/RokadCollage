<!-- Sync Impact Report
Version change: [CONSTITUTION_VERSION] -> 1.0.0
Modified principles:
  - Initialized Constitution for Rokad Collage Academic Platform
Added sections:
  - Core Principles (Architectural Separation, Security-First, Spec & Documentation Driven, Data Integrity, Clean Code & Modularity)
  - Technology Stack & Constraints (Node.js ESM + Express 5, React 19 + Vite 7, MongoDB)
  - Development Workflow & Quality Gates
  - Governance
Removed sections:
  - None (Template placeholders instantiated)
Follow-up TODOs:
  - None
-->

# Rokad Collage Constitution

## Core Principles

### I. Architectural Separation
The codebase MUST maintain a clean separation between the backend service (`API/`) and the administrative client (`Admin/`). The API MUST operate as a headless RESTful service communicating strictly via JSON, while the Admin dashboard consumes API contracts without server-side coupling.

### II. Security-First & Input Validation (NON-NEGOTIABLE)
All incoming API requests MUST be strictly validated using centralized validation schemas (Joi / express-validator) before reaching business logic controllers. Passwords MUST be hashed using bcrypt. Sensitive routes MUST require valid JWT authentication, and security protections (CORS, rate limiting) MUST remain enforced on all endpoints.

### III. Spec & Documentation Driven
Every API route MUST be documented via Swagger/OpenAPI annotations. Any new feature or modification MUST start with a specification (`/speckit-specify`) and technical plan (`/speckit-plan`) before code is written, ensuring unambiguous API contracts between backend and frontend.

### IV. Data Integrity & Schema Consistency
Database access via Mongoose MUST adhere to strongly typed, validated schemas with appropriate indexing. Data mutations MUST handle edge cases gracefully, preventing orphaned records or corrupted states. Global error handling middleware MUST sanitize error outputs in production.

### V. Clean Code & Modular Component Architecture
Code MUST follow modern ECMAScript standards (ES Modules). Backend logic MUST be structured into cohesive modules/controllers/services. Frontend components in React MUST remain modular, utilizing Redux Toolkit for shared state and Formik/Yup for structured form handling.

## Technology Stack & Standards

- **Backend Runtime**: Node.js (ES Modules, `type: "module"`)
- **Backend Framework**: Express 5.x with Mongoose 8.x for MongoDB
- **Security & Validation**: JWT, bcryptjs, Joi, express-rate-limit, cors
- **API Documentation**: Swagger JSDoc & Swagger UI Express
- **Frontend Stack**: React 19, Vite 7, TailwindCSS 4, Material UI / Lucide React
- **Frontend State & Forms**: Redux Toolkit, React Router 7, Formik, Yup

## Development Workflow & Quality Gates

1. **Specification Before Implementation**: No code modification without corresponding spec/task checklist.
2. **Build Verification**: Frontend changes MUST pass `npm run build` without compilation or bundling errors.
3. **Endpoint Validation**: Backend changes MUST verify request/response schemas and update Swagger definitions.
4. **Convergence Check**: Use `/speckit-converge` to verify all acceptance criteria and tasks are satisfied.

## Governance

This Constitution supersedes informal agreements. Any amendment to these principles requires:
1. Documentation of the rationale and proposed change.
2. Review against existing API contracts and database schema integrity.
3. Version increment according to Semantic Versioning (MAJOR for breaking governance changes, MINOR for new principles/stacks, PATCH for clarifications).

**Version**: 1.0.0 | **Ratified**: 2026-10-06 | **Last Amended**: 2026-10-06
