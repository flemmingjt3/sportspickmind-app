import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calendar, 
  Newspaper, 
  TrendingUp, 
  User, 
  Settings,
  Trophy,
  Target,
  BarChart3,
  Zap,
  ChevronRight,
  Star,
  Clock,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Home,
      description: 'Overview and quick stats',
      badge: null
    },
    {
      title: 'Games',
      href: '/games',
      icon: Calendar,
      description: 'Live scores and schedules',
      badge: 'Live'
    },
    {
      title: 'Predictions',
      href: '/predictions',
      icon: TrendingUp,
      description: 'AI-powered game predictions',
      badge: 'AI'
    },
    {
      title: 'News',
      href: '/news',
      icon: Newspaper,
      description: 'Latest sports updates',
      badge: null
    }
  ];

  const userItems = [
    {
      title: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your account',
      badge: null
    },
    {
      title: 'My Predictions',
      href: '/my-predictions',
      icon: Target,
      description: 'Track your accuracy',
      badge: user?.stats?.accuracy ? `${user.stats.accuracy}%` : null
    },
    {
      title: 'Favorites',
      href: '/favorites',
      icon: Star,
      description: 'Your favorite teams',
      badge: user?.preferences?.favoriteTeams?.length || null
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'App preferences',
      badge: null
    }
  ];

  const quickStats = [
    {
      label: 'Predictions Made',
      value: user?.stats?.totalPredictions || 0,
      icon: Target,
      color: 'text-blue-600'
    },
    {
      label: 'Accuracy Rate',
      value: user?.stats?.accuracy ? `${user.stats.accuracy}%` : '0%',
      icon: BarChart3,
      color: 'text-green-600'
    },
    {
      label: 'Current Streak',
      value: user?.stats?.streak?.current || 0,
      icon: Zap,
      color: 'text-yellow-600'
    }
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: -320,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          className="fixed left-0 top-16 bottom-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 z-40 lg:relative lg:top-0 lg:z-0 overflow-y-auto"
        >
          <div className="p-6 space-y-8">
            {/* User Welcome Section */}
            {isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.username?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Welcome back!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {user.fullName || user.username}
                    </p>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg"
                    >
                      <stat.icon className={cn("h-4 w-4 mx-auto mb-1", stat.color)} />
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {stat.label.split(' ')[0]}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Main Navigation */}
            <div>
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Navigation
              </h2>
              <nav className="space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <motion.div
                      key={item.href}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      variants={itemVariants}
                    >
                      <Link
                        to={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setHoveredItem(item.href)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={cn(
                          "group flex items-center justify-between p-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                          active
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon className={cn(
                              "h-5 w-5 transition-colors",
                              active ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                            )} />
                          </motion.div>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className={cn(
                              "text-xs transition-colors",
                              active ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                            )}>
                              {item.description}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge 
                              variant={active ? "secondary" : "outline"}
                              className={cn(
                                "text-xs",
                                active ? "bg-white/20 text-white border-white/30" : ""
                              )}
                            >
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-all duration-200",
                            active ? "text-white" : "text-slate-400",
                            hoveredItem === item.href ? "translate-x-1" : ""
                          )} />
                        </div>
                        
                        {/* Active indicator */}
                        {active && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* User Section */}
            {isAuthenticated && (
              <div>
                <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                  Account
                </h2>
                <nav className="space-y-2">
                  {userItems.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    
                    return (
                      <motion.div
                        key={item.href}
                        custom={index + navigationItems.length}
                        initial="hidden"
                        animate="visible"
                        variants={itemVariants}
                      >
                        <Link
                          to={item.href}
                          onClick={onClose}
                          onMouseEnter={() => setHoveredItem(item.href)}
                          onMouseLeave={() => setHoveredItem(null)}
                          className={cn(
                            "group flex items-center justify-between p-3 rounded-xl transition-all duration-200",
                            active
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium text-sm">{item.title}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {item.description}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <Badge variant="outline" className="text-xs">
                                {item.badge}
                              </Badge>
                            )}
                            <ChevronRight className={cn(
                              "h-3 w-3 transition-all duration-200 text-slate-400",
                              hoveredItem === item.href ? "translate-x-1" : ""
                            )} />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 border-t border-slate-200 dark:border-slate-700"
            >
              <div className="text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Powered by AI • Real-time Data
                </div>
                <div className="flex items-center justify-center space-x-1 text-xs text-slate-400">
                  <Activity className="h-3 w-3" />
                  <span>All systems operational</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
