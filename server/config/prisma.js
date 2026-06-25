const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

// 1. Create a PostgreSQL connection pool using your existing environment variable
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it in the Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter directly into the PrismaClient constructor (Required in v7)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;