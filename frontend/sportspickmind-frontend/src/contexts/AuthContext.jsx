import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set auth token in axios headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        setAuthToken(token);
        try {
          const response = await axios.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            // Invalid token, remove it
            setAuthToken(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          setAuthToken(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        setAuthToken(token);
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/auth/register', userData);

      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        setAuthToken(token);
        return { success: true, user };
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setAuthToken(null);
      setError(null);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put('/users/profile', profileData);

      if (response.data.success) {
        setUser(response.data.data.user);
        return { success: true, user: response.data.data.user };
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put('/users/preferences', preferences);

      if (response.data.success) {
        setUser(prevUser => ({
          ...prevUser,
          preferences: response.data.data.preferences
        }));
        return { success: true, preferences: response.data.data.preferences };
      } else {
        throw new Error(response.data.message || 'Preferences update failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Preferences update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Add favorite team
  const addFavoriteTeam = async (teamData) => {
    try {
      setError(null);
      
      const response = await axios.post('/users/favorite-teams', teamData);

      if (response.data.success) {
        setUser(prevUser => ({
          ...prevUser,
          preferences: {
            ...prevUser.preferences,
            favoriteTeams: response.data.data.favoriteTeams
          }
        }));
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to add favorite team');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add favorite team';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Remove favorite team
  const removeFavoriteTeam = async (teamId) => {
    try {
      setError(null);
      
      const response = await axios.delete(`/users/favorite-teams/${teamId}`);

      if (response.data.success) {
        setUser(prevUser => ({
          ...prevUser,
          preferences: {
            ...prevUser.preferences,
            favoriteTeams: response.data.data.favoriteTeams
          }
        }));
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Failed to remove favorite team');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to remove favorite team';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.put('/auth/change-password', {
        currentPassword,
        newPassword
      });

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Password change failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    addFavoriteTeam,
    removeFavoriteTeam,
    changePassword,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
