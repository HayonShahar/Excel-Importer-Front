import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "../../components/DashboardLayout";
import "../../styles/Settings.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5185";

function Settings({ userEmail: initialEmail, onLogout, onNavigate, onProfileUpdate }) {
  const [profile, setProfile] = useState({ email: initialEmail || "", role: "user" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", isError: false });

  // Edit email
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  // Change password (collapsible)
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API}/api/auth/me`, { withCredentials: true });
        if (!cancelled && res.data) {
          setProfile({ email: res.data.email || "", role: res.data.role || "user" });
          setNewEmail(res.data.email || "");
        }
      } catch {
        if (!cancelled) setProfile((p) => ({ ...p, email: initialEmail || "" }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [initialEmail]);

  const showMsg = (text, isError = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage({ text: "", isError: false }), 4000);
  };

  const handleSaveEmail = async () => {
    const trimmed = newEmail?.trim();
    if (!trimmed) {
      showMsg("נא להזין אימייל", true);
      return;
    }
    if (trimmed === profile.email) {
      setEditingEmail(false);
      return;
    }
    try {
      const res = await axios.put(`${API}/api/auth/me/email`, { newEmail: trimmed }, { withCredentials: true });
      setProfile((p) => ({ ...p, email: res.data.email }));
      onProfileUpdate?.(res.data.email);
      setEditingEmail(false);
      showMsg("האימייל עודכן בהצלחה");
    } catch (err) {
      showMsg(err.response?.data || "שגיאה בעדכון האימייל", true);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showMsg("נא למלא את כל השדות", true);
      return;
    }
    if (newPassword !== confirmPassword) {
      showMsg("הסיסמה החדשה אינה תואמת לאישור", true);
      return;
    }
    if (newPassword.length < 4) {
      showMsg("הסיסמה חייבת להכיל לפחות 4 תווים", true);
      return;
    }
    try {
      await axios.post(
        `${API}/api/auth/me/change-password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordOpen(false);
      showMsg("הסיסמה שונתה בהצלחה");
    } catch (err) {
      showMsg(err.response?.data || "שגיאה בשינוי הסיסמה", true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${API}/api/auth/me`, { withCredentials: true });
      setShowDeleteConfirm(false);
      onLogout();
    } catch (err) {
      showMsg(err.response?.data || "שגיאה במחיקת החשבון", true);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userEmail={profile.email} onLogout={onLogout} onNavigate={onNavigate} activeItem="settings">
        <div className="settings-page">
          <div className="settings-loading">טוען...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userEmail={profile.email} onLogout={onLogout} onNavigate={onNavigate} activeItem="settings">
      <div className="settings-page">
        <div className="settings-inner">
          <h1 className="settings-title">הגדרות</h1>

          {message.text && (
            <div className={`settings-message ${message.isError ? "error" : "success"}`}>
              {message.text}
            </div>
          )}

          <section className="settings-section">
            <h2 className="settings-section-title">פרופיל</h2>
            <div className="settings-grid">
              <div className="settings-row">
                <label className="settings-label">אימייל</label>
                <div className="settings-field">
                  {editingEmail ? (
                    <>
                      <input
                        type="email"
                        className="settings-input"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="אימייל"
                        autoFocus
                      />
                      <button type="button" className="settings-btn primary" onClick={handleSaveEmail}>שמור</button>
                      <button type="button" className="settings-btn secondary" onClick={() => { setEditingEmail(false); setNewEmail(profile.email); }}>ביטול</button>
                    </>
                  ) : (
                    <>
                      <span className="settings-value">{profile.email}</span>
                      <button type="button" className="settings-btn secondary" onClick={() => { setEditingEmail(true); setNewEmail(profile.email); }}>ערוך</button>
                    </>
                  )}
                </div>
              </div>
              <div className="settings-row">
                <label className="settings-label">תפקיד</label>
                <div className="settings-field">
                  <span className="settings-badge">{profile.role === "admin" ? "מנהל" : "משתמש"}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h2 className="settings-section-title">שינוי סיסמה</h2>
            <div className="settings-grid">
              <button
                type="button"
                className="settings-row settings-row-trigger"
                onClick={() => setPasswordOpen((o) => !o)}
                aria-expanded={passwordOpen}
              >
                <span className="settings-label">שינוי סיסמה</span>
                <div className="settings-field settings-field-trigger">
                  <span className="settings-value">{passwordOpen ? "סגור" : "לחץ לשינוי סיסמה"}</span>
                  <span className="settings-chevron" aria-hidden>{passwordOpen ? "▲" : "▼"}</span>
                </div>
              </button>
              {passwordOpen && (
                <form className="settings-password-form" onSubmit={handleChangePassword}>
                  <div className="settings-row">
                    <label className="settings-label">סיסמה נוכחית</label>
                    <div className="settings-field">
                      <input
                        type="password"
                        className="settings-input"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="סיסמה נוכחית"
                      />
                    </div>
                  </div>
                  <div className="settings-row">
                    <label className="settings-label">סיסמה חדשה</label>
                    <div className="settings-field">
                      <input
                        type="password"
                        className="settings-input"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="סיסמה חדשה"
                      />
                    </div>
                  </div>
                  <div className="settings-row">
                    <label className="settings-label">אישור סיסמה</label>
                    <div className="settings-field">
                      <input
                        type="password"
                        className="settings-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="הזן שוב את הסיסמה החדשה"
                      />
                    </div>
                  </div>
                  <div className="settings-row settings-row-submit">
                    <span className="settings-label" />
                    <div className="settings-field">
                      <button type="submit" className="settings-btn primary">עדכן סיסמה</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </section>

          <section className="settings-section">
            <h2 className="settings-section-title">חשבון</h2>
            <div className="settings-grid">
              <div className="settings-row">
                <label className="settings-label">פעולות</label>
                <div className="settings-field settings-field-actions">
                  <button type="button" className="settings-btn logout" onClick={onLogout}>התנתק</button>
                  <button type="button" className="settings-btn danger" onClick={() => setShowDeleteConfirm(true)}>מחק חשבון</button>
                </div>
              </div>
            </div>
          </section>

          {showDeleteConfirm && (
            <div className="settings-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
              <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <h3>מחיקת חשבון</h3>
                <p>פעולה זו תמחק את החשבון לצמיתות. האם להמשיך?</p>
                <div className="settings-modal-actions">
                  <button type="button" className="settings-btn danger" onClick={handleDeleteAccount}>
                    מחק חשבון
                  </button>
                  <button type="button" className="settings-btn secondary" onClick={() => setShowDeleteConfirm(false)}>
                    ביטול
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;
