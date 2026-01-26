import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/logInPage";
import { TestPage } from "./pages/TestPage";
import  AddUserPage  from "./pages/admin/AddUserPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private routes */}
          <Route element={<ProtectedRoute/>}>
            <Route path="/" element={<TestPage/>} />
            <Route path="/adduser" element={<AddUserPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
