import React from "react";
import { useState } from "react";
import "../styles/Auth.css";
import AuthShell from "../components/AuthShell";

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ isSuccess: false, text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const result = await onLogin(email, password);
  
    if (result.success) {
      setMessage({ isSuccess: true, text: result.message });
    } else {
      setMessage({ isSuccess: false, text: result.message });
    }
  
    setLoading(false);
  };

  return (
    <AuthShell
      variant="login"
      withImage
      title="ברוכים הבאים"
      subtitle="התחבר כדי להמשיך"
      message={message}
      form={
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>אימייל</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>סיסמה</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-forgotRow">
            <a className="auth-link" href="#" onClick={(e) => e.preventDefault()}>
              שכחת סיסמה?
            </a>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "מתחבר..." : "התחבר"}
            {loading && <span className="spinner"></span>}
          </button>
        </form>
      }
      footer={
        <div className="auth-switch">
          אין לך חשבון? <button onClick={onSwitchToRegister}>הירשם עכשיו</button>
        </div>
      }
    />
  );
}

export default Login;