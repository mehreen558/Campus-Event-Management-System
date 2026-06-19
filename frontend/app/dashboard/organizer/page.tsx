'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock,
  Plus,
  Eye,
  BarChart3,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function OrganizerOverview() {
  const stats = [
    { 
      label: "Total Events", 
      value: "8", 
      icon: Calendar, 
      change: "+2", 
      trend: "up",
      description: "Events created"
    },
    { 
      label: "Total Registrations", 
      value: "342", 
      icon: Users, 
      change: "+45", 
      trend: "up",
      description: "All-time registrations"
    },
    { 
      label: "Upcoming Events", 
      value: "3", 
      icon: Clock, 
      change: "-1", 
      trend: "down",
      description: "Scheduled events"
    },
    { 
      label: "Revenue", 
      value: "₨ 12,450", 
      icon: DollarSign, 
      change: "+18%", 
      trend: "up",
      description: "Total earnings"
    },
  ];

  const upcomingEvents = [
    { 
      id: 1, 
      title: "Tech Workshop: AI Fundamentals", 
      date: "2024-03-20", 
      registrations: 45, 
      capacity: 50,
      status: "almost_full"
    },
    { 
      id: 2, 
      title: "Networking Mixer", 
      date: "2024-03-25", 
      registrations: 23, 
      capacity: 100,
      status: "available"
    },
    { 
      id: 3, 
      title: "Career Development Seminar", 
      date: "2024-04-05", 
      registrations: 67, 
      capacity: 80,
      status: "available"
    },
  ];

  const quickActions = [
    { label: "Create New Event", href: "/dashboard/organizer/create-event", icon: Plus, color: "green" },
    { label: "Manage Events", href: "/dashboard/organizer/events", icon: Calendar, color: "blue" },
    { label: "View Registrations", href: "/dashboard/organizer/registrations", icon: Users, color: "purple" },
    { label: "Event Analytics", href: "/dashboard/organizer/analytics", icon: BarChart3, color: "orange" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'almost_full': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'almost_full': return 'Almost Full';
      case 'available': return 'Available';
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Organizer Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Manage your events and track performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className={`h-3 w-3 ${
                      stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                    }`} />
                    <span className={`text-xs ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.description}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <stat.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for event management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start gap-3 h-14"
                asChild
              >
                <a href={action.href}>
                  <action.icon className={`h-5 w-5 text-${action.color}-600`} />
                  <span className="font-medium">{action.label}</span>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your scheduled events requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {event.registrations}/{event.capacity} registered
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(event.status)}>
                    {getStatusText(event.status)}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/dashboard/organizer/events">
                <Eye className="h-4 w-4 mr-2" />
                View All Events
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest registrations and event updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: "New registration for AI Workshop", user: "Ali Ahmed", time: "5 min ago", type: "registration" },
              { action: "Event published: Networking Mixer", user: "System", time: "1 hour ago", type: "event" },
              { action: "Payment received for Career Seminar", user: "Sara Khan", time: "2 hours ago", type: "payment" },
              { action: "Event reminder sent", user: "System", time: "3 hours ago", type: "notification" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'registration' ? 'bg-green-500' :
                  activity.type === 'event' ? 'bg-blue-500' :
                  activity.type === 'payment' ? 'bg-purple-500' : 'bg-orange-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}