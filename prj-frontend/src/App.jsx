import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/logInPage";
import { TestPage } from "./pages/TestPage";
import  AddUserPage  from "./pages/admin/AddUserPage";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";
import { RoleRedirect } from "./components/auth/RoleRedirect";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<RoleRedirect />} />

          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/adduser" element={<AddUserPage />} />
          </Route>

          {/* Student */}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>

          <Route path="/unauthorized" element={<h1>403 - Không có quyền</h1>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
