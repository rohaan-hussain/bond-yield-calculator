# Bond Yield Calculator - Backend

NestJS backend API for calculating bond yields, total interest, bond status, and cash flow schedules.

## Setup

```bash
# Install dependencies
npm install

# Start development server (port 3001)
npm run start:dev

# Start production server
npm run build
npm run start:prod
```

## Scripts

| Script                | Description                       |
| --------------------- | --------------------------------- |
| `npm run start`       | Start the application             |
| `npm run start:dev`   | Start in watch mode               |
| `npm run start:debug` | Start in debug mode               |
| `npm run build`       | Build the application             |
| `npm run test`        | Run unit tests                    |
| `npm run test:watch`  | Run unit tests in watch mode      |
| `npm run test:cov`    | Run unit tests with coverage      |
| `npm run test:e2e`    | Run end-to-end tests              |
| `npm run lint`        | Lint and fix source files         |
| `npm run format`      | Format source files with Prettier |

## API Documentation

### Base URL

```
http://localhost:3001/api
```

CORS is enabled for all origins.

### POST /api/bond/calculate

Calculate bond yield metrics, bond status, and generate a cash flow schedule.

#### Request Body

| Field             | Type     | Constraints                   | Description                        |
| ----------------- | -------- | ----------------------------- | ---------------------------------- |
| `faceValue`       | `number` | Positive                      | The bond's face (par) value        |
| `couponRate`      | `number` | 0 - 100                       | Annual coupon rate as a percentage |
| `marketPrice`     | `number` | Positive                      | Current market price of the bond   |
| `yearsToMaturity` | `number` | Positive, max 100             | Years until the bond matures       |
| `couponFrequency` | `string` | `"annual"` or `"semi-annual"` | How often coupon payments are made |

#### Example Request

```json
{
  "faceValue": 1000,
  "couponRate": 5,
  "marketPrice": 950,
  "yearsToMaturity": 10,
  "couponFrequency": "annual"
}
```

#### Response (201 Created)

| Field              | Type     | Description                                                |
| ------------------ | -------- | ---------------------------------------------------------- |
| `currentYield`     | `number` | Current yield as a percentage (2 decimal places)           |
| `ytm`              | `number` | Yield to maturity as a percentage (2 decimal places)       |
| `totalInterest`    | `number` | Total interest over the bond's lifetime (2 decimal places) |
| `bondStatus`       | `string` | One of `"premium"`, `"discount"`, or `"par"`               |
| `cashFlowSchedule` | `array`  | Array of cash flow entries                                 |

Each cash flow entry contains:

| Field                | Type     | Description                                                |
| -------------------- | -------- | ---------------------------------------------------------- |
| `period`             | `number` | Period number (1-indexed)                                  |
| `paymentDate`        | `string` | ISO 8601 date string of the payment                        |
| `couponPayment`      | `number` | Coupon payment for the period                              |
| `cumulativeInterest` | `number` | Total interest accumulated up to this period               |
| `remainingPrincipal` | `number` | Remaining principal (face value until last period, then 0) |

#### Example Response

```json
{
  "currentYield": 5.26,
  "ytm": 5.66,
  "totalInterest": 500,
  "bondStatus": "discount",
  "cashFlowSchedule": [
    {
      "period": 1,
      "paymentDate": "2027-02-23T...",
      "couponPayment": 50,
      "cumulativeInterest": 50,
      "remainingPrincipal": 1000
    }
  ]
}
```

#### Error Responses

- **400 Bad Request**: Validation failed (missing fields, invalid values, out-of-range values)

## Calculations

- **Current Yield**: `(faceValue * couponRate / 100) / marketPrice * 100`
- **Yield to Maturity (YTM)**: Computed using the Newton-Raphson method for precise convergence
- **Total Interest**: `faceValue * couponRate / 100 * yearsToMaturity`
- **Bond Status**: `premium` if market price > face value, `discount` if less, `par` if equal

## Project Structure

```
src/
  main.ts                              # Application entry point
  app.module.ts                        # Root module
  config.ts                            # App configuration (port, CORS)
  bond/
    bond.module.ts                     # Bond feature module
    bond.controller.ts                 # Bond API controller
    bond.service.ts                    # Bond calculation service
    bond.service.spec.ts               # Unit tests
    dto/
      calculate-bond.dto.ts            # Request validation DTO
    interfaces/
      bond-result.interface.ts         # TypeScript interfaces
test/
  bond.e2e-spec.ts                     # End-to-end tests
  jest-e2e.json                        # E2E Jest config
```
