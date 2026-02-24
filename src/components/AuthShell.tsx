import React from "react";
import ThemeToggle from "./ThemeToggle.jsx";

type AuthMessage = { isSuccess: boolean, text: string };

type Props = {
  variant?: "login" | "register";
  brand?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  form: React.ReactNode;
  footer?: React.ReactNode;
  message?: AuthMessage;
  withImage?: boolean;
};

export default function AuthShell({
  variant,
  brand = "מערכת ניהול אקסל",
  title,
  subtitle,
  form,
  footer,
  message,
  withImage = false
}: Props) {
  const rootClassName = [
    "auth-page",
    variant ? `auth-page--${variant}` : "",
    withImage ? "auth-page--withImage" : ""
  ]
    .filter(Boolean)
    .join(" ");

  const card = (
    <div className="auth-card">
      <div className="auth-brand">{brand}</div>
      <h1>{title}</h1>
      {subtitle ? <p className="subtitle">{subtitle}</p> : null}

      {form}

      {footer}

      {message?.text ? (
        <div className={`${message.isSuccess ? "success" : "error"}-message`}>{message.text}</div>
      ) : null}
    </div>
  );

  if (!withImage) {
    return (
      <div className={rootClassName}>
        <ThemeToggle variant="auth" />
        {card}
      </div>
    );
  }

  return (
    <div className={rootClassName}>
      <ThemeToggle variant="auth" />
      <div className="auth-loginShell">
        <div className="auth-loginSplit">
          <div className="auth-loginFormPane">{card}</div>
          <div className="auth-loginImagePane" aria-hidden="true">
            <div className="auth-loginImage">
              <div className="loginImage-text">
                <div className="loginImage-textTop">
                  <div className="loginImage-badge">
                    <span className="loginImage-badgeDot" />
                    <span className="loginImage-badgeText">Excel Importer</span>
                  </div>
                </div>

                <div className="loginImage-textBottom">
                  <h2 className="loginImage-text-title">R.E.F.I.N.E</h2>
                  <p className="loginImage-text-subtitle">
                    Raw Excel Filtered Into Neat Export
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

