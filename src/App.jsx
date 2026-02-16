import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5185";

// Auth token for Bearer header (used when cookie isn't sent, e.g. cross-origin dev)
let authToken = null;
export function setAuthToken(token) {
  authToken = token;
}

// Axios defaults: always send credentials (cookies) for API calls
axios.defaults.withCredentials = true;

// Attach Bearer token to every request when available
axios.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// Global 401 handler: clear token and redirect to login when missing or expired
axios.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      setAuthToken(null);
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(err);
  }
);
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Settings from "./pages/settingsPage/Settings";
import ExcelImport from "./pages/ExcelImport";
import DashboardLayout from "./components/DashboardLayout";
import { ExportToList } from "./pages/exportToList/ExportToList";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const onUnauthorized = () => {
      setCurrentPage("login");
      setUserEmail("");
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

      // Register handler
  const handleRegister = async (email, password) => {
    try {
      await axios.post(`${API}/api/auth/register`, { email, password });
      return { success: true, message: "נרשמת בהצלחה! עבור להתחברות" };
    } catch (err) {
      return { success: false, message: "ההרשמה נכשלה. נסה שוב" };
    }
  };

  // Login handler
  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true });
      const token = res.data?.token;
      if (token) setAuthToken(token);
      setUserEmail(email);
      setCurrentPage("home");
      return { success: true, message: "התחברת בהצלחה!" };
    } catch (err) {
      return { success: false, message: "ההתחברות נכשלה. בדוק את הפרטים" };
    }
  };

  // Logout handler – clear token, call backend to clear cookie, then reset state
  const handleLogout = async () => {
    setAuthToken(null);
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
      // Ignore errors – still clear local state
    }
    setCurrentPage("login");
    setUserEmail("");
  };

  // Navigation handler (home, excel, settings)
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Export to list – parse Excel via backend (no filter)
  const handleExportToList = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API}/api/excel/export-to-list`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      console.log(res);
      console.log(res.data);
      console.log(res.data.json);
      const jsonData = JSON.parse(res.data.json);
      jsonData.forEach((item) => {
        if (item._images && item._images.length > 0) {
          item.תמונה = item._images[0];
        }
        delete item._images;
      });

      return {
        success: true,
        message: `נטענו בהצלחה ${jsonData.length} שורות`,
        data: jsonData
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "העלאת הקובץ נכשלה. נסה שוב"
      };
    }
  };

  // Upload handler (filter + download)
  const handleUpload = async (file, column, value) => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("ColumnName", column);
    formData.append("FilterValue", value);

    try {
      const res = await axios.post(`${API}/api/excel/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      // Parse JSON data
      const jsonData = JSON.parse(res.data.json);

      // Download Excel
      const link = document.createElement("a");
      link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${res.data.excelBase64}`;
      link.download = "filtered.xlsx";
      link.click();

      return { 
        success: true, 
        message: "הקובץ סונן והורד בהצלחה!",
        data: jsonData 
      };
    } catch (err) {
      return { success: false, message: "העלאת הקובץ נכשלה. נסה שוב" };
    }
  };

  // Render current page
  if (currentPage === "login") {
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentPage("register")}
      />
    );
  }

  if (currentPage === "register") {
    return (
      <Register 
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentPage("login")}
      />
    );
  }

  if (currentPage === "home") {
    return (
      <Home 
        userEmail={userEmail}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
    );
  }

  if (currentPage === "settings") {
    return (
      <Settings 
        userEmail={userEmail}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onProfileUpdate={setUserEmail}
      />
    );
  }

  if (currentPage === "exportToList") {
    return (
      <ExportToList
        userEmail={userEmail}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        onExportToList={handleExportToList}
      />
    );
  }

  // excel
  return (
    <DashboardLayout userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} activeItem="excel">
      <ExcelImport onUpload={handleUpload} />
    </DashboardLayout>
  );
}

export default App;