# Crypto Portfolio Tracker Frontend

## 1. Introduction
This repository contains the React frontend for the Crypto Portfolio Tracker with Risk and Scam Analysis project. It delivers the user-facing dashboard for authentication, holdings, trade management, pricing views, risk alerts, exchange connections, notifications, profile management, and report exports.

## 2. Overview
The frontend provides:

- login, registration, and refresh-token aware session handling
- a dashboard view for portfolio summary and recent activity
- exchange connection forms for linking supported exchanges
- holdings, trades, pricing, and history views
- backend-driven risk alert presentation
- P&L and tax report screens with CSV export
- AI assistant and notification interfaces

## 3. Tech Stack
- React
- React Router
- Axios
- Tailwind CSS
- Recharts
- React Hot Toast
- Lucide React
- Create React App tooling

## 4. Architecture
The frontend is organized into:

- `pages` for route-level screens such as Dashboard, Holdings, Trades, Pricing, Risk Alerts, P&L Reports, Login, and Register
- `components` for reusable UI sections such as the exchange settings panel, notifications, charts, layout wrappers, and assistant widgets
- `context` for authentication and demo mode state
- `api` for Axios configuration and request helpers

High-level flow:

1. Users authenticate against the backend auth APIs.
2. Access and refresh tokens are stored in the browser.
3. Axios automatically attaches the access token and retries with refresh flow when needed.
4. Dashboard pages fetch backend APIs for holdings, prices, risk alerts, notifications, P&L, and profile data.

## 5. APIs
The frontend consumes these backend API groups:

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`

### Portfolio and Dashboard
- `GET /api/dashboard/summary`
- `GET /api/holdings`
- `GET /api/trades/get-trades`
- `POST /api/trades/add-trade`
- `PUT /api/trades/{id}`
- `DELETE /api/trades/{id}`

### Exchange and Pricing
- `GET /api/exchange-accounts`
- `POST /api/exchange-accounts`
- `DELETE /api/exchange-accounts/{exchange}`
- `GET /api/exchange-accounts/sync/{exchange}`
- `GET /api/pricing`
- `GET /api/prices`
- `GET /api/market/coins`

### Risk, Reports, and Utilities
- `GET /api/risk-alerts`
- `GET /api/pnl`
- `GET /api/pnl/export`
- `GET /api/tax/hints`
- `GET /api/notifications`
- `GET /api/notifications/unread-count`
- `POST /api/notifications/{id}/read`
- `POST /api/notifications/read-all`
- `GET /api/profile/get-profile`
- `POST /api/profile/update-profile`
- `POST /api/profile/change-password`
- `POST /api/profile/set-preferences`
- `POST /api/profile/delete-account`
- `POST /api/ai/chat`

## 6. Test Results
Current local verification status:

- `npm.cmd install` completed successfully
- `npm.cmd run build` completed successfully
- production build generated optimized frontend assets on April 4, 2026

Current note:
- the build reports one non-blocking ESLint warning in `src/pages/Dashboard.jsx` for an unused variable

## 7. Documentation: Postman & Swagger
- Swagger UI is not part of the frontend repository because API documentation belongs to the backend service layer.
- No Postman collection is currently committed in this repository.
- The frontend route and API usage currently align with the backend endpoints listed above.

Recommended next step:
- add linked backend Swagger documentation in the project docs
- add screenshots or flow diagrams for the main frontend pages

## 8. Future Enhancements
- improve responsive polish across all dashboard screens
- connect more exchange-specific onboarding flows
- add better empty states and error boundaries
- add automated frontend tests for auth, exchange connections, and reporting
- add live websocket or polling updates for price and notification refresh
- align every remaining page with a single consistent design system

## 9. Author - Ritesh Gupta
- Ritesh Gupta
