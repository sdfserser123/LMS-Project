import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/userAuthStore";

export const RoleRedirect = () => {
  const { accessToken, user, loading, refresh } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        await refresh(); // Thử lấy lại token/user khi vào root
      }
      setInitializing(false);
    };
    init();
  }, []);

  if (loading || initializing) {
    return <div>Đang kiểm tra phiên đăng nhập...</div>;
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  // Điều hướng theo role (giữ nguyên switch case của bạn)
  switch (user.role) {
    case "admin": return <Navigate to="/admin" replace />;
    case "student": return <Navigate to="/student" replace />;
    default: return <Navigate to="/unauthorized" replace />;
  }
};