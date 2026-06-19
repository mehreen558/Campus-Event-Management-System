// app/dashboard/student/page.tsx
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { authService, User } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  upcomingEvents: number;
  eventsAttended: number;
  registrationRate: string;
  hoursEngaged: number;
}

interface Event {
  id: string;
  title: string;
  date_time: string;
  status: string;
}

interface Registration {
  id: string;
  event: Event;
  status: string;
  registered_at: string;
}

export default function OverviewPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEvents: 0,
    eventsAttended: 0,
    registrationRate: "0%",
    hoursEngaged: 0
  });
  const [recentEvents, setRecentEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Check authentication using Django backend
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Get user from auth service (set during login)
        const currentUser = authService.getUser();
        if (!currentUser || currentUser.role !== 'student') {
          router.push('/dashboard');
          return;
        }

        setUser(currentUser);

        // Fetch user's registrations from Django backend
        const registrationsResponse = await apiClient.get<Registration[]>('/registrations/my-registrations/');
        
        if (registrationsResponse.data) {
          const registrations = registrationsResponse.data;

          // Calculate stats
          const upcoming = registrations.filter(reg => 
            new Date(reg.event.date_time) > new Date() && reg.status === 'registered'
          ).length;
          
          const attended = registrations.filter(reg => 
            reg.status === 'attended'
          ).length;

          const totalEvents = registrations.length;
          const rate = totalEvents > 0 ? Math.round((attended / totalEvents) * 100) : 0;

          setStats({
            upcomingEvents: upcoming,
            eventsAttended: attended,
            registrationRate: `${rate}%`,
            hoursEngaged: attended * 3 // Assuming 3 hours per event
          });

          // Set recent events (last 3)
          setRecentEvents(registrations.slice(0, 3).map(reg => ({
            name: reg.event.title,
            date: reg.event.date_time,
            status: reg.status === 'attended' ? 'Attended' : 'Registered'
          })));
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const statsConfig = [
    { label: "Upcoming Events", value: stats.upcomingEvents.toString(), icon: Calendar, description: "Events you're attending" },
    { label: "Events Attended", value: stats.eventsAttended.toString(), icon: Users, description: "Total events participated" },
    { label: "Attendance Rate", value: stats.registrationRate, icon: TrendingUp, description: "Of registered events" },
    { label: "Hours Engaged", value: stats.hoursEngaged.toString(), icon: Clock, description: "This semester" },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Welcome back, {user?.name || 'Student'}!
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {user?.university?.name ? `Here's what's happening with your events at ${user.university.name}.` : "Here's what's happening with your events."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, index) => (
          <Card key={index} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Your recent event activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.length > 0 ? recentEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {event.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'Registered' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {event.status}
                  </span>
                </div>
              )) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">
                  No recent events found.
                </p>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/dashboard/student/my-events">
                View All Events
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start gap-3" asChild>
              <a href="/events">
                <Calendar className="h-4 w-4" />
                Browse Events
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <a href="/dashboard/student/my-events">
                <Users className="h-4 w-4" />
                My Events
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <a href="/dashboard/student/profile">
                <Users className="h-4 w-4" />
                Update Profile
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}