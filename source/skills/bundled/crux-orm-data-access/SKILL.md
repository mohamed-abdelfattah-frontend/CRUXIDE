---
name: crux-orm-data-access
description: Design maintainable ORM and data-access layers across Sequelize, Prisma, TypeORM, Mongoose, EF Core, Hibernate, SQLAlchemy, Django ORM, and Eloquent.
---

# CRUX ORM & Data Access

## Outcome

Design maintainable ORM and data-access layers across Sequelize, Prisma, TypeORM, Mongoose, EF Core, Hibernate, SQLAlchemy, Django ORM, and Eloquent.

## Version policy

Detect the repository language, framework, runtime, and toolchain versions before applying guidance. Preserve supported project conventions, avoid deprecated APIs in new code, and propose migrations separately with compatibility and rollback notes.

Last reviewed: 2026-09-16.

## Workflow

1. Detect the project ORM, version, database dialect, migration workflow, generated artifacts, and established repository boundaries before recommending changes.
2. Keep business rules independent from persistence models and expose deliberate data-access contracts, transaction ownership, and database-native escape hatches.
3. Model relations, constraints, cascades, precision, time zones, tenancy, deletion, pagination, projections, eager loading, and concurrency explicitly.
4. Inspect generated queries, eliminate N+1 behavior, parameterize raw access, prevent mass assignment, and verify authorization at the resource boundary.
5. Test mappings, migrations, transactions, concurrency, recovery, generated SQL, and performance using a representative supported database.

## Project control

- Treat this skill as optional guidance unless the project explicitly selects warning or strict enforcement.
- Project instructions and developer-authored overrides take precedence over CRUX recommendations.
- Do not install dependencies, enable hooks, change Git configuration, or mutate agent settings without explicit approval.
- Keep generated artifacts and caches outside the application build unless the developer explicitly chooses project sharing.
