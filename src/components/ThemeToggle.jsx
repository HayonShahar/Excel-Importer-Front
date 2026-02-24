import { useEffect, useState } from "react";
import { applyTheme, getCurrentTheme, toggleTheme } from "../theme.js";

function IconSun({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

export default function ThemeToggle({ className = "", variant = "default" }) {
  const [theme, setTheme] = useState(() => getCurrentTheme());

  useEffect(() => {
    const onChange = (e) => setTheme(e?.detail?.theme ?? getCurrentTheme());
    window.addEventListener("themechange", onChange);
    return () => window.removeEventListener("themechange", onChange);
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? "מצב בהיר" : "מצב כהה";

  return (
    <button
      type="button"
      className={[
        "theme-toggle",
        `theme-toggle--${variant}`,
        className,
      ].filter(Boolean).join(" ")}
      onClick={() => setTheme(toggleTheme())}
      onContextMenu={(e) => {
        e.preventDefault();
        const system = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
        applyTheme(system, { persist: false });
        setTheme(system);
      }}
      aria-label={label}
      title={`${label} (קליק ימני: לפי מערכת)`}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {isDark ? <IconSun /> : <IconMoon />}
      </span>
      <span className="theme-toggle__text">{isDark ? "בהיר" : "כהה"}</span>
    </button>
  );
}

