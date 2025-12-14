import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface UserStatus {
  onboarding_completed: boolean | null;
  access_approved: boolean | null;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [userStatus, setUserStatus] = useState<UserStatus>({ 
    onboarding_completed: null, 
    access_approved: null 
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      const { data } = await supabase
        .from('users')
        .select('onboarding_completed, access_approved')
        .eq('id', user.id)
        .maybeSingle();

      setUserStatus({
        onboarding_completed: data?.onboarding_completed ?? false,
        access_approved: data?.access_approved ?? false
      });
      setChecking(false);
    };

    if (user) {
      checkUserStatus();
    } else {
      setChecking(false);
    }
  }, [user]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if access is approved (skip for access-pending page)
  if (userStatus.access_approved === false && location.pathname !== '/access-pending') {
    return <Navigate to="/access-pending" replace />;
  }

  // If access approved but on access-pending page, redirect to appropriate page
  if (userStatus.access_approved === true && location.pathname === '/access-pending') {
    if (userStatus.onboarding_completed) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  // If onboarding not completed and not on onboarding page, redirect to onboarding
  if (userStatus.onboarding_completed === false && !location.pathname.startsWith('/onboarding') && location.pathname !== '/access-pending') {
    return <Navigate to="/onboarding" replace />;
  }

  // If onboarding completed and on onboarding page, redirect to dashboard
  if (userStatus.onboarding_completed === true && location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
