# Bond Yield Calculator

A full-stack web application for calculating bond yields, built with React (frontend) and NestJS (backend).

## Features

- **Bond Yield Calculations**: Current Yield, Yield to Maturity (YTM), Total Interest Earned
- **Premium/Discount Indicator**: Shows whether a bond trades above or below face value
- **Cash Flow Schedule**: Period-by-period breakdown of coupon payments and cumulative interest
- **FAQ Page**: Educational content about bond yields and investing concepts

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React, TypeScript, Vite, Tailwind CSS |
| Backend    | NestJS, TypeScript                    |
| Validation | Zod (FE), class-validator (BE)        |
| Testing    | Jest, React Testing Library           |
| Tooling    | ESLint, Prettier, Husky, lint-staged  |

## Prerequisites

- Node.js >= 18
- npm >= 9

## Quick Start

### 1. Install root dependencies

```bash
npm install
```

### 2. Start the backend

```bash
cd backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3001/api`.

### 3. Start the frontend (in a separate terminal)

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## API

### POST /api/bond/calculate

**Request Body:**

```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": "annual"
}
```

**Response:**

```json
{
  "currentYield": 5.26,
  "ytm": 5.66,
  "totalInterest": 500,
  "bondStatus": "discount",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "2027-02-23",
      "couponPayment": 50,
      "cumulativeInterest": 50,
      "remainingPrincipal": 1000
    }
  ]
}
```

## Running Tests

```bash
# Backend unit tests
cd backend && npm run test

# Backend e2e tests
cd backend && npm run test:e2e

# Frontend tests
cd frontend && npm test
```

## Project Structure

```
bond-yield-calculator/
├── frontend/          React + Vite + Tailwind
├── backend/           NestJS REST API
├── .husky/            Git hooks (pre-commit)
├── .prettierrc        Prettier configuration
└── package.json       Root tooling (Husky, lint-staged, Prettier)
```
