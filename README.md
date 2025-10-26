

## Overview

# Next.js 14 Blog Application

A modern, full-stack blog application built with Next.js 14, TypeScript, tRPC, and PostgreSQL.

##  Features

- ✅ Server-side rendering with Next.js 14 App Router
- ✅ Type-safe API with tRPC
- ✅ PostgreSQL database with Neon
- ✅ Category management
- ✅ Comment system with approval workflow
- ✅ Markdown/rich text content
- ✅ SEO-friendly URLs with slugs
- ✅ Admin dashboard for content management
- ✅ Responsive design with Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Neon PostgreSQL account 

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd blog-spot
npm install
#to run application 
npm run dev
```
Visit http://localhost:3000 to see your application.

## Environment Setup

This project requires environment variables to be set up. Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
# Required: Neon PostgreSQL database connection string
# Format: postgresql://username:password@hostname:port/database
NEON_DATABASE_URL=your_neon_database_connection_string
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
## Tech stack
```
Framework: Next.js 14 (App Router)
Language: TypeScript
Database: PostgreSQL (Neon)
ORM: Drizzle ORM
API: tRPC + REST
Styling: Tailwind CSS
UI Components: Radix UI
Forms: React Hook Form
```
