import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/logInPage";
import { TestPage } from "./pages/TestPage";
import { AdminDashboard } from "./pages/adminDashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<TestPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
