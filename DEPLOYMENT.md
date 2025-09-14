# SportsPickMind Deployment Guide

## Netlify Deployment (Recommended)

### Automatic Deployment from GitHub

1. **Log in to Netlify**: Go to [netlify.com](https://netlify.com) and log in with your GitHub account

2. **Create New Site**: 
   - Click "New site from Git"
   - Choose "GitHub" as your Git provider
   - Select the `sportspickmind-app` repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend/sportspickmind-frontend`
   - **Build command**: `pnpm install && pnpm run build`
   - **Publish directory**: `frontend/sportspickmind-frontend/dist`

4. **Environment Variables** (Optional):
   - Add your Adsterra ad keys if you have them:
     - `REACT_APP_ADSTERRA_HEADER_KEY`
     - `REACT_APP_ADSTERRA_SIDEBAR_KEY`
     - `REACT_APP_ADSTERRA_MOBILE_KEY`
     - `REACT_APP_ADSTERRA_CONTENT_KEY`

5. **Deploy**: Click "Deploy site"

### Manual Deployment (Alternative)

If automatic deployment doesn't work:

1. **Download the built files**:
   - The `dist` folder contains the production build
   - Located at: `frontend/sportspickmind-frontend/dist/`

2. **Manual Upload**:
   - Go to Netlify dashboard
   - Drag and drop the `dist` folder to deploy

## Vercel Deployment (Alternative)

### GitHub Integration

1. **Log in to Vercel**: Go to [vercel.com](https://vercel.com) and connect with GitHub

2. **Import Project**:
   - Click "New Project"
   - Import `sportspickmind-app` repository

3. **Configure Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend/sportspickmind-frontend`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**: Same as Netlify setup

5. **Deploy**: Click "Deploy"

## Local Development

### Prerequisites
- Node.js 18.x or higher
- pnpm package manager

### Setup
```bash
cd frontend/sportspickmind-frontend
pnpm install
pnpm run dev
```

### Build for Production
```bash
pnpm run build
```

## Features Included

✅ **Complete MERN Stack Application**
- React frontend with modern UI/UX
- Node.js backend with Express
- MongoDB Atlas database integration
- Real-time sports data from TheSportsDB API

✅ **AI Prediction Engine**
- Statistical analysis algorithms
- Machine learning-based predictions
- Confidence scoring system

✅ **Monetization Integration**
- Adsterra ad network components
- Sports betting affiliate programs
- Analytics tracking (Google Analytics, Facebook Pixel)

✅ **Enterprise Features**
- User authentication and profiles
- Responsive design for all devices
- Dark/light theme support
- Real-time RSS news feeds

✅ **SEO & Performance**
- Optimized build with code splitting
- Meta tags and social sharing
- Fast loading times
- Mobile-first design

## Live URLs

Once deployed, your application will be available at:
- **Netlify**: `https://[site-name].netlify.app`
- **Vercel**: `https://[project-name].vercel.app`

## Support

For deployment issues:
- Check build logs in your hosting platform
- Ensure all environment variables are set
- Verify Node.js version compatibility (18.x recommended)
