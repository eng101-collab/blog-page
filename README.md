

## Overview


## Environment Setup

This project requires environment variables to be set up. Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
# Required: Neon PostgreSQL database connection string
# Format: postgresql://username:password@hostname:port/database
NEON_DATABASE_URL=your_neon_database_connection_string

# This variable is also referenced in db.ts, adding for consistency
# Both variables should have the same value
NEON_NEON_DATABASE_URL=your_neon_database_connection_string

# Node Environment
# Options: development, production, test
NODE_ENV=development
```

### Getting a Neon Database URL

1. Sign up for a free account at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string from the dashboard
4. Paste it as the value for both `NEON_DATABASE_URL` and `NEON_NEON_DATABASE_URL` in your `.env` file

### Verifying Your Environment Setup

After setting up your `.env` file, you can verify your environment configuration by running:

```bash
npm run setup
```

This script will check if your `.env` file is properly configured and test the database connection.

### Initializing the Database

To initialize the database with the required tables and sample data, run:

```bash
npm run init-db
```
