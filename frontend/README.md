# Bond Yield Calculator - Frontend

React + TypeScript + Vite frontend for the Bond Yield Calculator application.

## Setup

```bash
npm install
npm run dev       # Start dev server at http://localhost:5173
npm run build     # Build for production
npm run preview   # Preview production build
```

## Scripts

| Script          | Description                   |
| --------------- | ----------------------------- |
| `npm run dev`   | Start Vite dev server         |
| `npm run build` | Type-check and build for prod |
| `npm run lint`  | Run ESLint                    |
| `npm run test`  | Run Jest tests                |

## Project Structure

```
src/
  main.tsx                        # App entry point
  App.tsx                         # Root component
  router.tsx                      # React Router configuration
  config.ts                       # API base URL and app config
  pages/
    CalculatorPage.tsx            # Main bond calculator page
    FaqPage.tsx                   # FAQ / educational content page
  components/
    calculator/
      BondCalculatorForm.tsx      # Input form for bond parameters
      CashFlowTable.tsx           # Period-by-period cash flow schedule
      ResultsPanel.tsx            # Displays calculated yield results
    layout/
      Header.tsx                  # App header with navigation
      Footer.tsx                  # App footer
      Layout.tsx                  # Page layout wrapper
    ui/
      LoadingSpinner.tsx          # Loading state indicator
      StatusBadge.tsx             # Premium / Discount / Par badge
      Tooltip.tsx                 # Info tooltip component
  hooks/
    useBondCalculator.ts          # Custom hook for calculation state & API calls
  services/
    api.ts                        # Axios instance configuration
    bondApi.ts                    # Bond calculation API calls
  schemas/
    bondCalculator.schema.ts      # Zod validation schema for form inputs
  types/
    bond.types.ts                 # TypeScript types for bond data
  data/
    faqData.ts                    # FAQ content data
```

## Tech Stack

- **React 19** with TypeScript
- **Vite** for bundling and dev server
- **Tailwind CSS v4** for styling
- **React Router v7** for client-side routing
- **Zod** for form input validation
- **Axios** for HTTP requests
- **Sonner** for toast notifications
- **Jest** + **React Testing Library** for tests
