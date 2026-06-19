// app/dashboard/student/layout.tsx
'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, Settings, BarChart3, LogOut, Sparkles, User, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { authService } from '@/lib/auth';

// Simplified interface that matches your auth service User type
interface UserProfile {
  id: string;
  auth_id: string;
  email: string;
  name: string;
  role: string;
  university_id?: string;
  phone?: string;
  profile_image?: string;
  is_active: boolean;
  universities?: {
    name: string;
    code: string;
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = [
    { name: "Overview", href: "/dashboard/student", icon: Home },
    { name: "My Events", href: "/dashboard/student/my-events", icon: Users },
    { name: "Registrations", href: "/dashboard/student/registrations", icon: ClipboardList },
    { name: "Profile", href: "/dashboard/student/profile", icon: User },
  ];

  useEffect(() => {
    const checkAuthAndRole = () => {
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

        // Convert the User type to UserProfile type
        const userProfile: UserProfile = {
          id: currentUser.id?.toString() || '',
          auth_id: currentUser.id?.toString() || '',
          email: currentUser.email || '',
          name: currentUser.name || '',
          role: currentUser.role || 'student',
          // Use university id from the university object if available
          university_id: currentUser.university?.id?.toString(),
          phone: currentUser.phone,
          is_active: true,
          universities: currentUser.university ? {
            name: currentUser.university.name || '',
            code: currentUser.university.code || ''
          } : undefined
        };

        setUser(userProfile);
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndRole();
  }, [router]);

  const handleLogout = () => {
    try {
      authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 p-6 border-b border-slate-200 dark:border-slate-700">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Evex
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.name || 'User Name'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {user?.role || 'Student'}
                </p>
                {user?.universities && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {user.universities.name}
                  </p>
                )}
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 mt-2 text-slate-600 dark:text-slate-400"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}