'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  LogOut, 
  Sparkles,
  Plus,
  Megaphone,
  Ticket,
  ClipboardList,
  CheckCircle
} from "lucide-react";

export default function OrganizerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Organizer Navigation - Fixed routes
  const organizerNavigation = [
    { name: "Overview", href: "/dashboard/organizer", icon: Home },
    { name: "My Events", href: "/dashboard/organizer/events", icon: Calendar },
    { name: "Create Event", href: "/dashboard/organizer/create-event", icon: Plus },
    { name: "Registrations", href: "/dashboard/organizer/registrations", icon: CheckCircle },
    { name: "Attendees", href: "/dashboard/organizer/attendees", icon: Users },
    { name: "Promotions", href: "/dashboard/organizer/promotions", icon: Megaphone },
    { name: "Analytics", href: "/dashboard/organizer/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/organizer/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">
        <div className="flex flex-col h-full">
          {/* Logo & Organizer Badge */}
          <div className="flex items-center gap-2 p-6 border-b border-slate-200 dark:border-slate-700">
            <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                Evex
              </span>
              <div className="flex items-center gap-1 mt-1">
                <Ticket className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Organizer Panel</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {organizerNavigation.map((item) => {
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">O</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  Organizer Name
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  Verified Organizer
                </p>
              </div>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-3 mt-2 text-slate-600 dark:text-slate-400">
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