// app/dashboard/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectToRoleDashboard = () => {
      try {
        // Check if user is authenticated using your Django backend auth
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Get user profile from localStorage (set during login)
        const user = authService.getUser();
        const role = user?.role || 'student';

        // Redirect to role-specific dashboard
        switch (role) {
          case 'student':
            router.push('/dashboard/student');
            break;
          case 'organizer':
            router.push('/dashboard/organizer');
            break;
          case 'admin':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/dashboard/student');
        }
      } catch (error) {
        console.error('Error redirecting:', error);
        router.push('/login');
      }
    };

    redirectToRoleDashboard();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}