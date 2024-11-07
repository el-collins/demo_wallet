# Lendsqr Wallet Service Documentation

## Table of Contents

1. [Overview](#overview)
2. [Database Design](#database-design)
3. [API Documentation](#api-documentation)
4. [Architecture](#architecture)
5. [Setup Instructions](#setup-instructions)
6. [Testing](#testing)
7. [Deployment](#deployment)

## Overview

The Wallet Service is a microservice that enables users to perform financial transactions within the Lendsqr mobile lending application. It provides core functionality for wallet management, including account creation, funding, transfers, and withdrawals.

### Key Features

- User account creation with Adjutor Karma blacklist validation
- Wallet funding
- Wallet-to-wallet transfers
- Wallet Withdrawals
- Transaction history
- Faux token-based authentication

### Tech Stack

- Node.js (v18 LTS)
- TypeScript
- MySQL with KnexJS ORM
- Express.js
- Jest for testing

## Database Design

### Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Wallet : has
    User {
        uuid id PK
        string email
        string firstName
        string lastName
        string password
        string phoneNumber
        string role
        datetime createdAt
        datetime updatedAt
    }
    Wallet ||--o{ Transaction : contains
    Wallet {
        uuid id PK
        uuid userId FK
        decimal balance
        string status
        string currency
        datetime createdAt
        datetime updatedAt
    }
    Transaction {
        uuid id PK
        uuid walletId FK
        string type
        decimal amount
        string status
        string reference
        datetime createdAt
         datetime updatedAt
    }


```

### Database Schema Details

#### Users Table

- Primary store for user information
- Status tracks account state (active/suspended/blocked)
- Unique constraints on email and phone number

#### Wallets Table

- One-to-one relationship with users
- Balance stored as decimal(20,4) for precision
- Supports multiple currencies (defaulting to NGN)
- Status tracking for wallet state management

#### Transactions Table

- Comprehensive transaction logging
- Types: deposit, withdrawal, transfer
- Reference field ensures idempotency
- Metadata field stores transaction-specific details


## API Documentation

### Authentication
All endpoints except user creation require authentication via Bearer token.

### Endpoints

#### API VERSION
```
/api/v1/v1
```


#### User Management

```
POST /api/v1/v1/user/register
POST /api/v1/v1/user/login
GET /api/v1/v1/user/me
```

#### Wallet Operations
```
POST /api/v1/wallets/fund
POST /api/v1/wallets/transfer
POST /api/v1/wallets/withdraw
GET /api/v1/wallets
GET /api/v1/wallets/balance
GET /api/v1/wallets/transactions
GET /api/v1/wallets/all [Admin only]
```

## Architecture

### Service Layer Architecture

```plaintext
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Controllers   │ ──▶ │    Services     │ ──▶ │     Models      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                        │
         │                      │                        │
         ▼                      ▼                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Middleware    │     │  External APIs  │     │    Database     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Key Design Decisions

1. **Transaction Management**

   - All financial operations wrapped in database transactions
   - Rollback on any operation failure
   - Idempotency via transaction references

2. **Security**

   - Token-based authentication
   - Request validation middleware
   - Rate limiting for API endpoints
   - Secure password hashing

3. **Performance**

   - Database indexing strategy
   - Connection pooling

4. **Error Handling**
   - Centralized error handling
   - Standardized error responses
   - Detailed error logging

## Setup Instructions

1. **Prerequisites**

```bash
node -v  # Should be >= 18.0.0
npm -v   # Should be >= 8.0.0
```

2. **Environment Variables**

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=wallet_service
DB_PORT=29292
JWT_SECRET=your_secret
ADJUTOR_API_KEY=your_api_key
ADJUTOR_API_URL=https://api/v1.adjutor.lendsqr.com
```

3. **Database Setup**

```bash
npm install
npm run knex migrate:latest
```

4. **Running the Service**

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific tests
npm test -- -t "WalletService"
```

## Deployment

### Heroku Deployment

1. Create new Heroku app
2. Set environment variables
3. Connect GitHub repository
4. Enable automatic deploys

```bash
# Manual deployment
git push heroku main

# View logs
heroku logs --tail
```


## Future Improvements

1. Implement webhook notifications for transaction status
2. Add support for multiple currencies and exchange rates
3. Implement transaction limits and velocity checks
4. Add support for recurring transfers
5. Implement more comprehensive audit logging
