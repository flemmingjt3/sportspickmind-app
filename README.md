# 🏈 SportsPickMind

> AI-Powered Sports Prediction Platform Built with 100% Free Resources

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/flemmingjt3/sportspickmind-app)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/flemmingjt3/sportspickmind-app)

## 🎯 Overview

SportsPickMind is a comprehensive sports prediction web application that generates AI-powered predictions for NFL, NBA, and MLB games. Built with modern web technologies and designed for scalability, the platform combines real-time sports data, machine learning algorithms, and strategic monetization features.

## ✨ Features

### 🤖 AI Prediction Engine
- Statistical analysis algorithms for game predictions
- Machine learning-based confidence scoring
- Historical data analysis and trend identification
- Weather and injury impact calculations

### 📱 Modern User Experience
- Responsive design with dark/light theme support
- Real-time game updates and live scores
- Interactive charts and data visualizations
- Smooth animations and micro-interactions

### 💰 Monetization Ready
- Adsterra ad network integration
- Sports betting affiliate programs (DraftKings, FanDuel, BetMGM)
- Google Analytics and Facebook Pixel tracking
- Revenue optimization and A/B testing capabilities

### 🔐 Enterprise Features
- JWT-based authentication system
- MongoDB Atlas database integration
- RESTful API with proper error handling
- Security middleware and input validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- pnpm package manager
- MongoDB Atlas account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/flemmingjt3/sportspickmind-app.git
   cd sportspickmind-app
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend/sportspickmind-frontend
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Add your MongoDB connection string and API keys
   
   # Frontend
   cp frontend/sportspickmind-frontend/.env.example frontend/sportspickmind-frontend/.env
   # Add your Adsterra ad keys and analytics IDs
   ```

4. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend/sportspickmind-frontend
   pnpm run dev
   ```

5. **Open your browser**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing with protected routes

### Backend Stack
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Data Sources
- **TheSportsDB API** - Sports data and statistics
- **RSS Feeds** - Real-time sports news
- **OpenWeatherMap** - Weather data for outdoor games
- **Custom Algorithms** - AI prediction engine

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Base directory**: `frontend/sportspickmind-frontend`
   - **Build command**: `pnpm install && pnpm run build`
   - **Publish directory**: `frontend/sportspickmind-frontend/dist`
3. Add environment variables
4. Deploy automatically on every push

### Vercel (Alternative)
1. Import project from GitHub
2. Configure settings:
   - **Framework**: Vite
   - **Root Directory**: `frontend/sportspickmind-frontend`
   - **Build Command**: `pnpm run build`
3. Add environment variables
4. Deploy with automatic previews

## 📊 Live Demo

Once deployed, your application will be available at:
- **Netlify**: `https://[site-name].netlify.app`
- **Vercel**: `https://[project-name].vercel.app`

## 📋 Documentation

- [📖 Deployment Guide](DEPLOYMENT.md) - Step-by-step deployment instructions
- [📊 Project Summary](PROJECT_SUMMARY.md) - Comprehensive feature overview
- [🔧 API Documentation](docs/) - Backend API reference

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using 100% free and open-source resources**
