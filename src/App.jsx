import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5185";

let authToken = null;
export function setAuthToken(token) {
  authToken = token;
}

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

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

  const handleRegister = async (email, password) => {
    try {
      await axios.post(`${API}/api/auth/register`, { email, password });
      return { success: true, message: "נרשמת בהצלחה! עבור להתחברות" };
    } catch (err) {
      return { success: false, message: "ההרשמה נכשלה. נסה שוב" };
    }
  };

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

  const handleLogout = async () => {
    setAuthToken(null);
    try {
      await axios.post(`${API}/api/auth/logout`, {}, { withCredentials: true });
    } catch {
    }
    setCurrentPage("login");
    setUserEmail("");
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

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

      const jsonData = JSON.parse(res.data.json);

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

  return (
    <DashboardLayout userEmail={userEmail} onLogout={handleLogout} onNavigate={handleNavigate} activeItem="excel">
      <ExcelImport onUpload={handleUpload} />
    </DashboardLayout>
  );
}

export default App;