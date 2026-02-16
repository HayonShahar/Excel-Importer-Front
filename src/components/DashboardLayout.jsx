import { useState } from "react";
import "../styles/Home.css";

const IconGear = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M19.78 19.78l-1.42-1.42M5.64 5.64L4.22 4.22" />
  </svg>
);

const IconHistory = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

const IconFilter = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconGrid = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconDoc = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconClose = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconLogOut = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export { IconGear, IconHistory, IconFilter, IconGrid, IconDoc };

export default function DashboardLayout({ userEmail, onLogout, onNavigate, activeItem = "home", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const displayName = userEmail ? (userEmail.split("@")[0] || userEmail) : "משתמש";

  // useEffect(() => {
  //   setSidebarOpen(false);
  // },[activeItem])
  return (
    <div className="dashboard-layout">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-content">
        <nav className="sidebar-nav">
          <div className="sidebar-items">
          <div className="sidebar-header">
            <IconDoc size={22} />
            <span>מערכת ניהול אקסל</span>
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="סגור">
              <IconClose size={18} />
            </button>
          </div>
            <button className={`sidebar-item ${activeItem === "home" ? "active" : ""}`} onClick={() => onNavigate("home")}>
              <IconGrid size={20} />
              <span>Dashboard</span>
            </button>
            <button className={`sidebar-item ${activeItem === "excel" ? "active" : ""}`} onClick={() => onNavigate("excel")}>
              <IconFilter size={20} />
              <span>סינון אקסל</span>
            </button>
            <button className={`sidebar-item ${activeItem === "exportToList" ? "active" : ""}`} onClick={() => onNavigate("exportToList")}>
              <IconGrid size={20} />
              <span>ייצוא לרשימה</span>
            </button>
            <button className={`sidebar-item ${activeItem === "settings" ? "active" : ""}`} onClick={() => onNavigate("settings")}>
              <IconGear size={20} />
              <span>הגדרות</span>
            </button>
          </div>
            <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="user-avatar">{displayName.charAt(0).toUpperCase()}</div>
              <span className="user-name">{displayName}</span>
            </div>
            <button className="sidebar-logout" onClick={onLogout}>
              <IconLogOut size={20} />
              <span>התנתק</span>
            </button>
          </div>
        </nav>
        </div>
      </aside>

      <main className="dashboard-main">
        {children}
      </main>

      {!sidebarOpen && (
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="פתח תפריט">
          <IconDoc size={24} />
        </button>
      )}
    </div>
  );
}
