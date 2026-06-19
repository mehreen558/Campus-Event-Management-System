// app/dashboard/student/profile/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Save, Edit, Mail, Building, Calendar, Phone, Plus, X, Bell, Shield } from "lucide-react";
import { User as UserIcon } from "lucide-react";
import { authService, User as UserType } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface University {
  id: string;
  name: string;
  code: string;
}

interface Stats {
  events_attended: number;
  events_registered: number;
  total_events: number;
}

interface Settings {
  notifications: boolean;
  emailNotifications: boolean;
  privacy: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    university_name: "none"
  });
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    emailNotifications: false,
    privacy: "public"
  });
  const [customUniversity, setCustomUniversity] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [stats, setStats] = useState<Stats>({
    events_attended: 0,
    events_registered: 0,
    total_events: 0
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check authentication using Django backend
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Get user from auth service
        const currentUser = authService.getUser();
        if (!currentUser || currentUser.role !== 'student') {
          router.push('/dashboard');
          return;
        }

        setUser(currentUser);

        // Fetch universities list from Django backend
        const universitiesResponse = await apiClient.get<University[]>('/universities/');
        if (universitiesResponse.data) {
          setUniversities(universitiesResponse.data);
        }

        // Set profile data
        setProfile({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          university_name: currentUser.university?.name || "none"
        });

        // Fetch user stats
        await fetchUserStats();

      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const fetchUserStats = async () => {
    try {
      const statsResponse = await apiClient.get<Stats>('/users/profile/stats/');
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const updateData = {
        name: profile.name.trim(),
        phone: profile.phone.trim() || null,
        university_id: profile.university_name !== "none" 
          ? universities.find(u => u.name === profile.university_name)?.id 
          : null
      };

      const response = await apiClient.put('/users/profile/', updateData);
      
      if (!response.error) {
        // Update local user data - convert null to undefined for phone
        const updatedUser: UserType = {
          ...user,
          name: updateData.name,
          phone: updateData.phone || undefined, // Convert null to undefined
          university: profile.university_name !== "none" 
            ? universities.find(u => u.name === profile.university_name)
            : undefined
        };
        
        // Update auth service user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error(response.error);
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await apiClient.put('/users/settings/', settings);
      
      if (!response.error) {
        alert('Settings saved successfully!');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently removed.")) {
      return;
    }

    if (!confirm("FINAL WARNING: This will permanently delete your account and all your data. This cannot be reversed.")) {
      return;
    }

    setDeleting(true);
    try {
      const response = await apiClient.delete('/users/profile/');
      
      if (!response.error) {
        authService.logout();
        alert('Your account has been successfully deleted.');
        window.location.href = '/';
      } else {
        throw new Error(response.error);
      }
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      alert(`Error: ${error.message}. Please contact support.`);
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "", // Convert undefined to empty string
        university_name: user.university?.name || "none"
      });
    }
    setShowCustomInput(false);
    setCustomUniversity("");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Tabs */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {activeTab === 'profile' ? 'Profile' : 'Settings'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            {activeTab === 'profile' ? 'Manage your personal information' : 'Manage your account settings and preferences'}
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-4">
          <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={handleSaveSettings} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'profile' ? (
            /* Profile Tab Content */
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Personal Information</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Update your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <UserIcon className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input 
                      id="name" 
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      disabled={!isEditing}
                      className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input 
                      id="email" 
                      value={profile.email}
                      disabled
                      className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Phone className="h-4 w-4" />
                      Phone
                    </Label>
                    <Input 
                      id="phone" 
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      disabled={!isEditing}
                      className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="university" className="flex items-center gap-2 text-slate-900 dark:text-white">
                      <Building className="h-4 w-4" />
                      University
                    </Label>
                    {isEditing ? (
                      <Select 
                        value={profile.university_name} 
                        onValueChange={(value) => setProfile({...profile, university_name: value})}
                      >
                        <SelectTrigger className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                          <SelectItem value="none">No university selected</SelectItem>
                          {universities.map((uni) => (
                            <SelectItem key={uni.id} value={uni.name}>
                              {uni.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        value={profile.university_name === "none" ? "Not specified" : profile.university_name}
                        disabled
                        className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Settings Tab Content */
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Push Notifications</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive notifications in your browser
                      </p>
                    </div>
                    <Switch 
                      id="notifications"
                      checked={settings.notifications}
                      onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Receive event updates via email
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy
                  </CardTitle>
                  <CardDescription>
                    Manage your privacy preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="privacy">Profile Privacy</Label>
                    <Select 
                      value={settings.privacy}
                      onValueChange={(value) => setSettings({...settings, privacy: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="university">University Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
                  <CardDescription className="text-red-600/70 dark:text-red-400/70">
                    Permanent and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-600 dark:text-red-400">Delete Account</h4>
                      <p className="text-sm text-red-600/70 dark:text-red-400/70">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-800"
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                    >
                      {deleting ? "Deleting..." : "Delete Account"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-xl font-bold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Student</p>
                {profile.university_name && profile.university_name !== "none" && (
                  <Badge variant="secondary" className="mt-2">
                    {profile.university_name}
                  </Badge>
                )}
                <div className="flex items-center gap-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeTab === 'profile' && (
            <>
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Event Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Registered</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {stats.events_registered}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Attended</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {stats.events_attended}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Available Events</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {stats.total_events}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-900 dark:text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600" asChild>
                    <a href="/dashboard/student/my-events">View My Events</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-slate-300 dark:border-slate-600" asChild>
                    <a href="/events">Browse Events</a>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}