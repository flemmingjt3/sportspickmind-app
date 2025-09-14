import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Trophy, 
  Target,
  Calendar,
  Mail,
  Bell,
  Shield,
  Edit,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    favoriteTeams: ['Kansas City Chiefs', 'Los Angeles Lakers', 'New York Yankees'],
    notifications: {
      predictions: true,
      news: true,
      gameUpdates: false
    },
    privacy: {
      publicProfile: false,
      shareStats: true
    }
  });

  const [stats] = useState({
    totalPredictions: 156,
    correctPredictions: 112,
    accuracy: 71.8,
    streak: 5,
    favoritesSport: 'NFL',
    joinDate: '2024-01-15'
  });

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setIsEditing(false);
  };

  const updateNotificationSetting = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key, value) => {
    setProfileData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Profile
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage your account settings and preferences
              </p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Profile Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    ) : (
                      <p className="text-lg font-medium">{profileData.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    ) : (
                      <p className="text-lg">{profileData.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Member Since</Label>
                    <p className="text-lg">
                      {new Date(stats.joinDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalPredictions}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Predictions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.accuracy}%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.streak}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.correctPredictions}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Correct Picks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Favorite Teams */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Favorite Teams</CardTitle>
                  <CardDescription>
                    Teams you follow for personalized predictions and news
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profileData.favoriteTeams.map((team, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {team}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Add Team
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="predictions-notifications">Prediction Updates</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get notified when new predictions are available
                      </p>
                    </div>
                    <Switch
                      id="predictions-notifications"
                      checked={profileData.notifications.predictions}
                      onCheckedChange={(checked) => updateNotificationSetting('predictions', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="news-notifications">Sports News</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Breaking news about your favorite teams
                      </p>
                    </div>
                    <Switch
                      id="news-notifications"
                      checked={profileData.notifications.news}
                      onCheckedChange={(checked) => updateNotificationSetting('news', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="game-notifications">Game Updates</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Live scores and game results
                      </p>
                    </div>
                    <Switch
                      id="game-notifications"
                      checked={profileData.notifications.gameUpdates}
                      onCheckedChange={(checked) => updateNotificationSetting('gameUpdates', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Privacy
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public-profile">Public Profile</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Make your profile visible to other users
                      </p>
                    </div>
                    <Switch
                      id="public-profile"
                      checked={profileData.privacy.publicProfile}
                      onCheckedChange={(checked) => updatePrivacySetting('publicProfile', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="share-stats">Share Statistics</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Allow others to see your prediction accuracy
                      </p>
                    </div>
                    <Switch
                      id="share-stats"
                      checked={profileData.privacy.shareStats}
                      onCheckedChange={(checked) => updatePrivacySetting('shareStats', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Prediction Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {stats.accuracy}%
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {stats.correctPredictions} out of {stats.totalPredictions} predictions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {stats.streak}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Consecutive correct predictions
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Favorite Sport</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {stats.favoritesSport}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Most predicted sport
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>App Preferences</CardTitle>
                <CardDescription>
                  Customize your SportsPickMind experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Default Sport</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Choose which sport to show by default
                  </p>
                  <select className="w-full p-2 border rounded-md">
                    <option value="all">All Sports</option>
                    <option value="nfl">NFL</option>
                    <option value="nba">NBA</option>
                    <option value="mlb">MLB</option>
                  </select>
                </div>

                <div>
                  <Label className="text-base font-medium">Time Zone</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    All times will be displayed in your local time zone
                  </p>
                  <select className="w-full p-2 border rounded-md">
                    <option value="auto">Auto-detect</option>
                    <option value="EST">Eastern Time</option>
                    <option value="CST">Central Time</option>
                    <option value="MST">Mountain Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <Label className="text-base font-medium">Theme</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Choose your preferred color scheme
                  </p>
                  <select className="w-full p-2 border rounded-md">
                    <option value="system">System</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
