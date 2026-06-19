'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Building2, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Shield,
  Activity,
  Eye
} from "lucide-react";

export default function AdminOverview() {
  const stats = [
    { 
      label: "Total Users", 
      value: "2,847", 
      icon: Users, 
      change: "+12%", 
      trend: "up",
      description: "Registered students & organizers"
    },
    { 
      label: "Active Events", 
      value: "156", 
      icon: Calendar, 
      change: "+8%", 
      trend: "up",
      description: "Currently ongoing events"
    },
    { 
      label: "Universities", 
      value: "24", 
      icon: Building2, 
      change: "+2", 
      trend: "up",
      description: "Partner universities"
    },
    { 
      label: "Pending Approvals", 
      value: "23", 
      icon: AlertTriangle, 
      change: "-5", 
      trend: "down",
      description: "Awaiting moderation"
    },
  ];

  const recentActivities = [
    { action: "New user registered", user: "Ali Ahmed", time: "2 min ago", type: "user" },
    { action: "Event created", user: "Tech Club LUMS", time: "15 min ago", type: "event" },
    { action: "University added", user: "Admin", time: "1 hour ago", type: "system" },
    { action: "Report resolved", user: "Admin", time: "2 hours ago", type: "moderation" },
  ];

  const quickActions = [
    { label: "Manage Users", href: "/dashboard/admin/users", icon: Users, color: "blue" },
    { label: "Event Moderation", href: "/dashboard/admin/events", icon: Calendar, color: "blue" },
    { label: "View Reports", href: "/dashboard/admin/reports", icon: BarChart3, color: "blue" },
    { label: "System Logs", href: "/dashboard/admin/logs", icon: Activity, color: "blue" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          System overview and management console
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
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
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
              Frequently used administrative tasks
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
                  <action.icon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{action.label}</span>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest system activities and changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <a href="/dashboard/admin/logs">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>
            Current system status and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <Shield className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">Operational</h4>
              <p className="text-sm text-green-700 dark:text-green-300">All systems normal</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Performance</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">99.8% Uptime</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Usage</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">2.4K Active Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}