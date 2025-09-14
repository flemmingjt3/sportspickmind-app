import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import GamesPage from './components/GamesPage';
import GameDetails from './components/GameDetails';
import NewsPage from './components/NewsPage';
import PredictionsPage from './components/PredictionsPage';
import ProfilePage from './components/ProfilePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Analytics
import analytics from './utils/analytics';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Main App Layout
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <Navbar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <Sidebar 
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        }`}>
          <div className="pt-16"> {/* Account for fixed navbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Auth Layout (for login/register pages)
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mb-8">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-2xl"
            >
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                SM
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
            >
              SportsPickMind
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-blue-100 text-lg"
            >
              AI-Powered Sports Predictions
            </motion.p>
          </div>
          <LoadingSpinner size="lg" />
        </motion.div>
      </div>
  function App() {
  // Initialize analytics on app start
  React.useEffect(() => {
    analytics.init();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                } />
                <Route path="/register" element={
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                } />
                
                {/* Main App Routes */}
                <Route path="/" element={
                  <AppLayout>
                    <HomePage />
                  </AppLayout>
                } />
                
                <Route path="/games" element={
                  <AppLayout>
                    <GamesPage />
                  </AppLayout>
                } />
                
                <Route path="/games/:gameId" element={
                  <AppLayout>
                    <GameDetails />
                  </AppLayout>
                } />
                
                <Route path="/news" element={
                  <AppLayout>
                    <NewsPage />
                  </AppLayout>
                } />
                
                <Route path="/predictions" element={
                  <AppLayout>
                    <PredictionsPage />
                  </AppLayout>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                } />
                
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
