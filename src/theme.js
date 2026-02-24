const THEME_STORAGE_KEY = "excelImporterTheme";

/**
 * @typedef {"light" | "dark"} Theme
 */

/**
 * @returns {Theme}
 */
export function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

/**
 * @returns {Theme | null}
 */
export function getStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}

/**
 * @returns {Theme}
 */
export function getInitialTheme() {
  return getStoredTheme() ?? getSystemTheme();
}

/**
 * @param {Theme} theme
 * @param {{ persist?: boolean }} [opts]
 */
export function applyTheme(theme, opts = {}) {
  const persist = opts.persist ?? true;
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // TODO
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  }
}

/**
 * Initialize theme on first load.
 * @returns {Theme}
 */
export function initTheme() {
  const theme = getInitialTheme();
  applyTheme(theme, { persist: getStoredTheme() !== null });
  return theme;
}

/**
 * @returns {Theme}
 */
export function getCurrentTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

/**
 * @returns {Theme}
 */
export function toggleTheme() {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  applyTheme(next, { persist: true });
  return next;
}

