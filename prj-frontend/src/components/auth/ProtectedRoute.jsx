import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/userAuthStore";
import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = ({allowedRoles}) => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  

  useEffect(() => {
    const init = async () => {
      try {
        if (!accessToken) {
          await refresh();
        }

        if (accessToken && !user) {
          await fetchMe();
        }
      } finally { 
        setStarting(false);
      }
    };

    init();
  }, []);

  if (loading || starting) {
    return <div>Đang tải trang...</div>;
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};