import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/userAuthStore";
import { toast } from "sonner";

const SignOut = () => {
  const logOut = useAuthStore((state) => state.logOut);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Đăng xuất thành công!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Đăng xuất thất bại, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50"
    >
      {loading ? "Đang đăng xuất..." : "Log Out"}
    </button>
  );
};

export default SignOut;
