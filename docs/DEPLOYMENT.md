# Deployment Guide

## Overview

The Restaurant Reservation Chatbot is built with Next.js and can be deployed to multiple hosting platforms. Each platform has different features, pricing, and complexity levels.

## Deployment Platforms Comparison

| Platform | Effort | Cost | Features | Scalability |
|----------|--------|------|----------|-------------|
| **Vercel** | Easiest | Free-$20/mo | Optimal for Next.js | Excellent |
| **Netlify** | Easy | Free-$19/mo | Good for static | Good |
| **Railway** | Medium | Pay-as-you-go | Simple deployment | Very Good |
| **Render** | Medium | Free-$7/mo | Good free tier | Good |
| **AWS** | Hard | Variable | Maximum flexibility | Excellent |
| **DigitalOcean** | Medium | $4-$12/mo | VPS-based | Good |

## Vercel Deployment (Recommended)

Vercel is the creator of Next.js and offers the best integration.

### Prerequisites
- GitHub account
- Repository pushed to GitHub
- Vercel account (free at vercel.com)

### Step 1: Push to GitHub

```bash
# Initialize git repo (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Restaurant Reservation Chatbot"

# Add GitHub as remote
git remote add origin https://github.com/yourusername/restaurant-reservation-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "New Project"
4. Select your repository: `restaurant-reservation-bot`
5. Click "Import"

### Step 3: Configure Project

**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

**Environment Variables:** (Leave empty for now, add as needed)

### Step 4: Deploy

Click "Deploy" and wait 2-3 minutes.

**Result:**
- Live URL: `https://restaurant-reservation-bot.vercel.app`
- Automatic deployments on git push
- Production, preview, and development environments

### Vercel Features

✅ **Automatic Updates**
- Redeploys on every push to main branch
- Preview deployments for pull requests

✅ **Global CDN**
- Automatically distributed globally
- Fast content delivery

✅ **Environment Variables**
- Manage through dashboard
- Automatic injection into builds

✅ **Monitoring**
- Analytics built-in
- Performance insights
- Error tracking

✅ **Custom Domain**
- Settings → Domains
- Add your custom domain (requires DNS configuration)

### Custom Domain Setup

```bash
# In Vercel Dashboard:
1. Go to Project Settings → Domains
2. Enter your domain (e.g., reservations.yourrestaurant.com)
3. Add DNS records shown in Vercel dashboard

# In your DNS provider (GoDaddy, Namecheap, etc.):
1. Add CNAME record pointing to Vercel
2. May take 24-48 hours to propagate

# Verify:
1. Visit your custom domain
2. Should show your chatbot
```

## Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and authorize
4. Select your repository

### Step 2: Configure Build

**Build Settings:**
- **Build command:** `npm run build`
- **Publish directory:** `.next`

**Environment Variables:**
- Add any needed variables

### Step 3: Deploy

Click "Deploy site"

**Result:**
- Live URL: `https://[random-name].netlify.app`
- Auto-deploys on git push

### Important Note

Netlify requires special configuration for Next.js apps:

```toml
# netlify.toml (add to root directory)
[build]
  command = "npm run build"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Railway Deployment

### Step 1: Create Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Authorize Railway with GitHub
4. Select your repository

### Step 3: Configure

Railway auto-detects Next.js:

**Environment Variables:**
```
NODE_ENV=production
```

### Step 4: Deploy

Click "Deploy Now"

**Result:**
- Live URL provided automatically
- Auto-deploys on push
- Free tier available ($5 credit/month)

## Render Deployment

### Step 1: Create Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: New Web Service

1. Dashboard → "New Web Service"
2. Connect GitHub repo
3. Select `restaurant-reservation-bot`

### Step 3: Configure

**Build & Deploy Settings:**
- **Runtime:** Node
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

### Step 4: Environment

- **Environment:** Production
- No environment variables needed initially

### Step 5: Deploy

Click "Create Web Service"

**Result:**
- Auto-deploys on git push
- Free tier includes free web service

## AWS Amplify Deployment

### Prerequisites
- AWS account
- AWS CLI configured

### Step 1: Create Amplify App

```bash
npm install -g @aws-amplify/cli

amplify configure

amplify init
```

### Step 2: Build Configuration

Create `amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: '.next'
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 3: Deploy

```bash
amplify publish
```

## Docker Deployment

### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### Create .dockerignore

```
node_modules
.next
.git
```

### Build & Run

```bash
# Build image
docker build -t restaurant-chatbot .

# Run container
docker run -p 3000:3000 restaurant-chatbot
```

### Deploy Docker

**Options:**
1. Docker Hub - Push image to hub
2. AWS ECR - Amazon Elastic Container Registry
3. Google Cloud Run - Serverless containers
4. DigitalOcean App Platform - Docker container hosting

## Self-Hosted (VPS)

### Prerequisites
- Server with Node.js 18+
- Ubuntu/Linux recommended
- SSH access
- Domain name (optional)

### Step 1: Setup Server

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx
```

### Step 2: Clone Repository

```bash
cd /home/apps
git clone https://github.com/yourname/restaurant-reservation-bot.git
cd restaurant-reservation-bot

npm install
npm run build
```

### Step 3: Setup PM2

```bash
# Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'chatbot',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster'
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Step 4: Setup Nginx

```nginx
# /etc/nginx/sites-available/chatbot
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 5: SSL Certificate

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

## Environment Variables

### During Development
```bash
# .env.local (not committed to git)
DATABASE_URL=
STRIPE_KEY=
```

### During Production
Set via platform dashboard:
- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Build & Deploy → Environment
- **AWS:** Amplify Console → Backend Environments
- **Self-hosted:** Update `.env` file on server

## Monitoring & Analytics

### Vercel Analytics
- Dashboard shows real-time metrics
- Page performance data
- Traffic statistics

### Custom Analytics (Add Later)
```typescript
// Track user behavior
import { analytics } from '@/lib/analytics';

analytics.track('booking_completed', {
  guests: reservationData.guests,
  date: reservationData.date
});
```

### Error Tracking (Future)
- Sentry integration
- Error reporting
- Performance monitoring

## Database Integration

When adding persistence, connect to:

**Recommended Options:**
1. **Supabase** - PostgreSQL + Auth
2. **Firebase** - Google-backed, real-time
3. **MongoDB Atlas** - NoSQL, free tier
4. **PlanetScale** - MySQL serverless

## Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Chat functionality works
- [ ] Responsive on mobile
- [ ] All links working
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled (automatic on most platforms)
- [ ] Performance acceptable (<2s load time)
- [ ] Analytics configured
- [ ] Backups enabled
- [ ] Monitoring active

## Domain Configuration

### DNS Setup Examples

**For Vercel:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**For Netlify:**
```
Type: CNAME
Name: www
Value: your-site.netlify.app
```

**For custom email + domain:**
Add MX records after CNAME

## Troubleshooting Deployments

### Build Fails
```bash
# Check build locally
npm run build

# View build logs on platform dashboard
# Common issues: Missing env vars, Node version mismatch
```

### Site Slow
- Check Lighthouse score
- Review network tab in DevTools
- Optimize images
- Enable CDN caching

### Database Connection Errors
- Verify DATABASE_URL is set
- Check firewall/security groups
- Test connection locally

### SSL Certificate Issues
- Most platforms auto-manage SSL
- Manual setup: Use Let's Encrypt
- Verify DNS propagation (use mxtoolbox.com)

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

## Scaling

As traffic grows:

1. **CDN** - Enable on your platform
2. **Caching** - Add Redis (future)
3. **Database** - Move to managed service
4. **Load Balancing** - Multiple server instances
5. **Optimization** - Image compression, code splitting

## Cost Estimation

**Small Traffic (<1,000 users/month):**
- Vercel Free: $0
- Netlify Free: $0
- Total: $0

**Medium Traffic (10,000-100,000 users/month):**
- Vercel Pro: $20/mo
- Database: $15/mo
- Domain: $12/year
- Total: ~$35/month

**Large Traffic (>1,000,000 users/month):**
- Vercel Pro+: $50+/mo
- Database: $50+/mo
- CDN: $20+/mo
- Total: $120+/month

## Next Steps After Deployment

1. **Setup Email Notifications**
   - SendGrid or Mailgun integration
   - Send confirmation emails

2. **Add Analytics**
   - Google Analytics
   - Mixpanel or Amplitude

3. **Database Integration**
   - Store bookings permanently
   - Add user accounts

4. **Payment Processing**
   - Stripe integration
   - Deposit system

5. **Admin Dashboard**
   - View bookings
   - Manage availability
   - Reports

---

**Deployed successfully? Share your live site!** 🎉
