import { useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // login, register, home
  const [userEmail, setUserEmail] = useState("");

  const API = "http://localhost:5185";

      // Register handler
  const handleRegister = async (email, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { email, password });
      return { success: true, message: "נרשמת בהצלחה! עבור להתחברות" };
    } catch (err) {
      return { success: false, message: "ההרשמה נכשלה. נסה שוב" };
    }
  };

  // Login handler
  const handleLogin = async (email, password) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password }, { withCredentials: true });
      setUserEmail(email);
      setCurrentPage("home");
      return { success: true, message: "התחברת בהצלחה!" };
    } catch (err) {
      return { success: false, message: "ההתחברות נכשלה. בדוק את הפרטים" };
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentPage("login");
    setUserEmail("");
  };

  // Upload handler
  const handleUpload = async (file, column, value) => {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("ColumnName", column);
    formData.append("FilterValue", value);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/excel/upload`, formData, {
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

  return (
    <Home 
      email={userEmail}
      onLogout={handleLogout}
      onUpload={handleUpload}
    />
  );
}

export default App;