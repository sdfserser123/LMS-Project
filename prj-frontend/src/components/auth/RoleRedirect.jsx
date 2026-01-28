import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/userAuthStore";

export const RoleRedirect = () => {
  const { accessToken, user, loading, refresh } = useAuthStore();

  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Chưa đăng nhập
  if (!accessToken || !user) {
    refresh();
    console.log(accessToken)
    return <Navigate to="/login" replace />;
  }

  // Điều hướng theo role
  switch (user.role) {
    case "admin":
      return <Navigate to="/admin" replace />;
    case "instructor":
      return <Navigate to="/instructor" replace />;
    case "student":
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/unauthorized" replace />;
  }
};
