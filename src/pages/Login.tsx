import React from "react";
import { useState } from "react";
import "../styles/Auth.css";

function Login({ onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const result = await onLogin(email, password);
  
    // כאן מנהלים את ההודעה לפי מה שהגיע מהשרת
    if (result.success) {
      setMessage({ type: "success", text: result.message });
    } else {
      setMessage({ type: "error", text: result.message });
    }
  
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="auth-card">
        <h1>ברוכים הבאים</h1>
        <p className="subtitle">התחבר כדי להמשיך</p>
        
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
            {loading ? "מתחבר..." : "התחבר"}
            {loading && <span className="spinner"></span>}
          </button>
        </form>

        <div className="auth-switch">
          אין לך חשבון? <button onClick={onSwitchToRegister}>הירשם עכשיו</button>
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

export default Login;