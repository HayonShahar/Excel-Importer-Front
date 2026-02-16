import DashboardLayout, { IconGear, IconHistory, IconFilter, IconGrid } from "../components/DashboardLayout";

function Home({ userEmail, onLogout, onNavigate }) {
  return (
    <DashboardLayout userEmail={userEmail} onLogout={onLogout} onNavigate={onNavigate} activeItem="home">
      <div className="dashboard-content">
        <section className="welcome-section">
          <h1>ברוכים הבאים למערכת ניהול אקסל</h1>
          <p>בחר את הפעולה שברצונך לבצע</p>
        </section>

        <div className="action-cards">
          <article className="action-card" onClick={() => onNavigate("excel")}>
            <div className="action-card-icon blue"><IconFilter size={40} /></div>
            <h3>סינון קבצי אקסל</h3>
            <p>העלה קובץ אקסל וסנן נתונים לפי עמודות ומילות מפתח</p>
            <span className="action-link">כניסה ←</span>
          </article>

          <article className="action-card" onClick={() => onNavigate("exportToList")}>
            <div className="action-card-icon purple"><IconGrid size={40} /></div>
            <h3>ייצוא לרשימה</h3>
            <p>ייצא את הקובץ לרשימה מסודרת ונוחה לשימוש</p>
            <span className="action-link">כניסה ←</span>
          </article>

          <article className="action-card" onClick={() => onNavigate("settings")}>
            <div className="action-card-icon purple"><IconGear size={40} /></div>
            <h3>הגדרות</h3>
            <p>נהל את ההגדרות והעדפות המערכת שלך</p>
            <span className="action-link">כניסה ←</span>
          </article>
        </div>

        <section className="about-section">
          <h2>מידע על המערכת</h2>
          <p>מערכת זו מאפשרת לך לנהל ולסנן קבצי אקסל בצורה יעילה. העלה קבצים, בצע סינונים מתקדמים, וצפה בהיסטוריית הפעילות שלך.</p>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Home;
