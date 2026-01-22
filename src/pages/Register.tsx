import React from "react";
import { useState } from "react";
import "../styles/Auth.css";

function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await onRegister(email, password);
    
    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setTimeout(() => onSwitchToLogin(), 2000);
    } else {
      setMessage({ type: "error", text: result.message });
    }
    
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h1>הרשמה</h1>
        <p className="subtitle">צור חשבון חדש</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>אימייל</label>
            <input 
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>סיסמה</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "נרשם..." : "הירשם"}
            {loading && <span className="spinner"></span>}
          </button>
        </form>

        <div className="auth-switch">
          כבר יש לך חשבון? <button onClick={onSwitchToLogin}>התחבר</button>
        </div>

        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;