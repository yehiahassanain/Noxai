"use client";

import React from "react";

export default function Footer() {
  return (
    <>
      <style>{`
        .site-footer {
          width: 100%;
          background: #050508;
          margin-top: 80px;
        }
        .footer-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .footer-content {
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding-top: 32px;
          padding-bottom: 64px;
        }
        .footer-text {
          font-size: 0.875rem;
          color: rgba(240, 240, 245, 0.55);
          font-family: var(--font-sans, "Inter", sans-serif);
          letter-spacing: 0.03em;
        }
      `}</style>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-content">
            <div className="footer-text">
              &copy; 2026 Nox7.ai
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
