'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/lib/types';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: User['role'][];
}

export default function AuthGuard({
  children,
  requireAuth = false,
  requiredRole = [],
}: AuthGuardProps) {
  const { user, isAuth, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !isAuth) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [loading, isAuth, user, requireAuth, requiredRole, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (requireAuth && !isAuth) {
    return null;
  }

  if (requiredRole.length > 0 && user && !requiredRole.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
