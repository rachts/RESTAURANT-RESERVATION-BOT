# Setup and Installation Guide

This document describes how to set up the Restaurant Reservation Chatbot for local development and testing.

---

## Prerequisites

### System Requirements

* **Node.js:** 18.x or higher
* **Package Manager:** npm 9+ (or Yarn / pnpm equivalent)
* **Git:** Required for version control
* **Code Editor:** VS Code (recommended)
* **RAM:** Minimum 2 GB (4 GB recommended)
* **Disk Space:** ~1 GB for dependencies

### Verify Installation

```bash
node --version   # >= v18.0.0
npm --version    # >= v9.0.0
```

---

## Repository Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rachit/restaurant-reservation-bot.git
cd restaurant-reservation-bot
```

(SSH cloning can be used if configured.)

---

### 2. Install Dependencies

```bash
npm install
```

Alternative package managers:

```bash
yarn install
pnpm install
```

**Expected time:** 2–5 minutes

---

## Environment Configuration

No environment variables are required for local development.

For future integrations, create a `.env.local` file:

```bash
DATABASE_URL=
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=
SENDGRID_API_KEY=
```

---

## Running the Application

### Start Development Server

```bash
npm run dev
```

The application will be available at:

* **Local:** [http://localhost:3000](http://localhost:3000)

Hot reloading is enabled by default.

---

## Project Structure Overview

```
app/            # Next.js App Router
components/     # UI and chat components
lib/            # Chatbot logic and utilities
hooks/          # Custom React hooks
docs/           # Project documentation
public/         # Static assets
```

Refer to `ARCHITECTURE.md` for detailed component responsibilities.

---

## Common Development Tasks

### Modify Chatbot Responses

Edit logic in:

```text
lib/chatbot-logic.ts
```

### Update Menu Data

Menu definitions are located in the same file and can be extended safely without affecting flow logic.

### Update Styling

* Global styles: `app/globals.css`
* Tailwind configuration: `tailwind.config.ts`

---

## Production Build (Local Verification)

```bash
npm run build
npm start
```

This simulates the production environment locally.

---

## Testing Checklist

* Chat loads correctly on page load
* User input accepted and processed
* Reservation flow completes successfully
* Responsive layout on mobile screens
* No console errors

---

## Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Dependency Issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
npx tsc --noEmit
```

---

## Recommended VS Code Extensions

* Tailwind CSS IntelliSense
* ES7+ React Snippets
* Prettier

---

## Next Steps

* Review `ARCHITECTURE.md` to understand system design
* Customize chatbot logic and menu data
* Deploy using `DEPLOYMENT.md`

---

**Last Updated:** February 2026
**Maintained by:** Rachit
