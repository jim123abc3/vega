# Vega Portfolio Dashboard

A React + TypeScript application that visualises an investor’s portfolio with a donut chart, positions table, and historical value chart.

## Features

- **Authentication**

  - Simple login page using `localStorage` credentials.

- **Portfolio balance donut**

  - Donut chart that shows allocation **by asset** or **by asset class**, with a toggle in the header.
  - Clicking a slice highlights the corresponding position and keeps the historical chart in sync with the selected asset/class.

- **Positions table**

  - Tabular view of the current portfolio snapshot (as of a given date) with asset, class, quantity, price, value, and % of total.
  - Uses the same data as the donut so values always stay in sync.

- **Historical portfolio value**

  - Line chart showing total portfolio value over time, using synthetic price history from the mock API.
  - Range selector (1M / 6M / 1Y) to change the historical window.

- **Mock API layer**

  - Central API contract (`/assets`, `/prices`, `/portfolios`) describing methods, query parameters, and response shapes.
  - Mock implementations generate realistic assets, prices, and portfolio snapshots driven by shared date constants.

- **Theming**

  - Two themes (`brandA`, `brandB`) powered by CSS variables and Tailwind utility classes, switched via a theme toggle.
  - Charts and components read colours from CSS variables so themes stay visually consistent.

- **Error handling & loading states**

  - Data fetching via React Query with loading spinner and inline error messages for portfolio and historical data.

- **Testing**
  - Jest + React Testing Library tests for aggregation utilities and the main dashboard page.

---

## Getting started

### Prerequisites

- Node.js 18+
- npm (or pnpm/yarn)

### Installation

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

### Running tests

```bash
# run the test suite once
npm test

# watch mode
npm run test:watch
```

### Credentials

- username: vega-user
- password: pa$$word!
