# Setup and Installation Guide

## Prerequisites

### System Requirements
- **Node.js:** 18.0 or higher
- **npm:** 9.0 or higher (or Yarn 3.6+, pnpm 8+)
- **Git:** For version control
- **Code Editor:** VS Code recommended
- **RAM:** 2GB minimum (4GB recommended)
- **Disk Space:** 1GB for node_modules

### Verify Installation

```bash
# Check Node.js version
node --version
# Should be v18.0.0 or higher

# Check npm version
npm --version
# Should be 9.0.0 or higher
```

## Development Environment Setup

### 1. Clone Repository

```bash
# Clone via HTTPS
git clone https://github.com/rachit/restaurant-reservation-bot.git
cd restaurant-reservation-bot

# Or clone via SSH
git clone git@github.com:rachit/restaurant-reservation-bot.git
cd restaurant-reservation-bot
```

### 2. Install Dependencies

```bash
# Using npm (recommended)
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

**Expected installation time:** 2-5 minutes

**What gets installed:**
- Next.js 16.1.6
- React 19
- TypeScript 5.7.3
- Tailwind CSS 3.4.17
- shadcn/ui components
- Radix UI libraries
- 40+ UI component libraries

### 3. Verify Installation

```bash
# Check if dependencies installed correctly
npm ls

# Should show dependency tree without errors
```

## Environment Configuration

### Environment Variables

No environment variables required for development. The app runs with sensible defaults.

For future integrations, create `.env.local`:

```bash
# Database (future)
DATABASE_URL=

# API Keys (future)
STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

# Email Service (future)
SENDGRID_API_KEY=
```

### Configuration Files

**`tailwind.config.ts`** - Tailwind CSS configuration
- Theme customization
- Colors, spacing, fonts

**`next.config.js`** - Next.js configuration
- Build optimization
- Environment setup

**`tsconfig.json`** - TypeScript configuration
- Compiler options
- Module resolution paths (@/components, @/lib)

**`components.json`** - shadcn/ui configuration
- Component output directory
- Style system settings

## Local Development

### Start Development Server

```bash
npm run dev
```

**Output:**
```
> dev
> next dev

  ▲ Next.js 16.1.6
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.1s
```

### Access Application

- **Local:** http://localhost:3000
- **Network:** Shown in terminal output
- **Mobile:** Use same network IP + port (e.g., 192.168.x.x:3000)

### Hot Reload

Changes to files automatically reload:
- React components (.tsx)
- Styles (.css)
- Configuration files

No need to restart server.

### Debug Mode

Enable detailed logging:

```typescript
// In components/ChatContainer.tsx
console.log("[v0] Debug:", variableName);
```

Check browser DevTools Console (F12):
- Verify component renders
- Check state updates
- Monitor network requests

## Project Structure Walkthrough

```
restaurant-reservation-bot/
├── app/
│   ├── layout.tsx          # Root layout wrapper
│   ├── page.tsx            # Home page (/ route)
│   ├── globals.css         # Global styles & theme
│   ├── favicon.ico
│   └── opengraph-image.jpg # Social sharing image
│
├── components/
│   ├── ChatContainer.tsx   # Main chat interface (state)
│   ├── ChatBubble.tsx      # Message display
│   ├── ChatInput.tsx       # Input field
│   ├── BookingSummary.tsx  # Booking confirmation
│   ├── theme-provider.tsx  # Theme context
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (40+ more)
│
├── lib/
│   ├── chatbot-logic.ts    # Conversation engine
│   └── utils.ts            # Utility functions (cn, etc.)
│
├── hooks/
│   ├── use-mobile.tsx      # Mobile detection hook
│   └── use-toast.ts        # Toast notifications hook
│
├── public/                 # Static assets
│   └── (images, fonts)
│
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # System design
│   ├── SETUP.md           # This file
│   ├── DEPLOYMENT.md      # Production guide
│   └── API.md             # API reference
│
├── node_modules/          # Dependencies (gitignored)
├── .next/                 # Build output (gitignored)
├── .env.local            # Env variables (gitignored)
├── .gitignore            # Git exclusions
│
├── package.json          # Dependencies & scripts
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
├── next.config.js        # Next.js config
├── components.json       # shadcn/ui config
│
├── README.md             # Project overview
└── .github/
    └── workflows/        # CI/CD pipelines (future)
```

## Common Development Tasks

### Adding a New Component

```bash
# Create component file
touch components/MyComponent.tsx
```

```typescript
// components/MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

```typescript
// Use in ChatContainer or other component
import { MyComponent } from '@/components/MyComponent';

export function ParentComponent() {
  return <MyComponent />;
}
```

### Updating Colors/Theme

**Option 1: Edit CSS Variables**
```css
/* app/globals.css */
:root {
  --primary: 15 100% 52%;  /* Change this */
}
```

**Option 2: Update Tailwind Config**
```typescript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
      }
    }
  }
}
```

### Modifying Chatbot Responses

```typescript
// lib/chatbot-logic.ts
export const generateBotResponse = (
  step: ReservationStep,
  input: string,
  // ... edit responses here
) => {
  switch (step) {
    case 'greeting':
      return {
        response: "Your custom greeting here",
        // ...
      };
  }
}
```

### Adding Menu Items

```typescript
// lib/chatbot-logic.ts
export const MENU_DATA = {
  vegetarian: {
    dishes: [
      'New Dish Here',
      // ... more dishes
    ],
    priceRange: '$8-$15'
  }
};
```

## Building for Production

### Build Process

```bash
npm run build
```

**Steps:**
1. Compiles TypeScript
2. Bundles React components
3. Optimizes CSS
4. Creates .next directory
5. Reports bundle size

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data ...
✓ Generating static pages (3/3)
✓ Finalizing page optimization ...

Route (pages)                              Size     First Load JS
┌ ○ / (static)                           xxx B        xxx kB
├─ /_app                                  xxx B        xxx kB
└─ 404                                    xxx B        xxx kB

✓ Build successful
```

### Start Production Server

```bash
npm start
```

Runs optimized production build locally at http://localhost:3000

## Testing

### Manual Testing Checklist

**Desktop:**
- [ ] Chat loads on page load
- [ ] Can type messages
- [ ] Bot responds to dates (today, tomorrow, Dec 25)
- [ ] Bot suggests times
- [ ] Can enter guest count
- [ ] Can select seating preference
- [ ] Booking confirms with reference
- [ ] Reset button works

**Mobile:**
- [ ] Layout responsive on 375px width
- [ ] Input field usable
- [ ] Messages visible and readable
- [ ] Scrolling smooth
- [ ] No horizontal scrolling
- [ ] Touch targets 44px+ (accessibility)

**Browser Compatibility:**
- [ ] Chrome/Edge 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Mobile Chrome/Safari

### Performance Testing

```bash
# Build size check
npm run build

# Check with Lighthouse (Chrome DevTools)
# Performance, Accessibility, SEO scores
```

## Troubleshooting

### Issue: Port 3000 Already in Use

```bash
# Use different port
npm run dev -- -p 3001

# Or kill process using port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

```bash
# Check compilation
npx tsc --noEmit

# Review errors in VS Code
# View problems: Ctrl+Shift+M (Windows/Linux) or Cmd+Shift+M (Mac)
```

### Issue: Styles Not Applied

```bash
# Rebuild Tailwind CSS
npm run build

# Check tailwind.config.ts includes all paths:
content: [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
]
```

### Issue: Hot Reload Not Working

```bash
# Restart dev server
Ctrl+C (stop server)
npm run dev (restart)

# Check file isn't ignored in .gitignore
```

## IDE Setup

### VS Code Recommended Extensions

1. **ES7+ React/Redux/React-Native snippets**
   - Author: dsznajder.es7-react-js-snippets

2. **Tailwind CSS IntelliSense**
   - Author: bradlc.vscode-tailwindcss

3. **TypeScript Vue Plugin**
   - Author: Vue

4. **Prettier - Code formatter**
   - Author: esbenp.prettier-vscode

### VS Code Settings

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Version Management

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Major version updates (breaking changes)
npm install package-name@next
```

### Lock File

- **package-lock.json** - Created by npm
- **Commit to git** for reproducible builds
- Ensures everyone installs same versions

## Git Workflow

### Initial Setup

```bash
# Configure git (if first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Clone repo
git clone <repo-url>
cd restaurant-reservation-bot
```

### Daily Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push to remote
git push origin main
```

### Branching

```bash
# Create feature branch
git checkout -b feature/new-feature

# Push branch
git push -u origin feature/new-feature

# Create pull request on GitHub
```

## Next Steps

1. **Customize Theme**
   - Edit colors in `app/globals.css`
   - Update fonts in `app/layout.tsx`

2. **Add Your Content**
   - Update menu items in `lib/chatbot-logic.ts`
   - Modify bot responses

3. **Deploy Application**
   - See `docs/DEPLOYMENT.md`
   - Deploy to Vercel, Netlify, or own server

4. **Add Integrations** (Future)
   - Database integration
   - Payment processing
   - Email notifications

## Getting Help

- **Documentation:** See `docs/` folder
- **Issues:** Check GitHub issues
- **Code:** Review component files with comments
- **TypeScript:** Hover over types in VS Code

---

**Happy coding! 🚀**
