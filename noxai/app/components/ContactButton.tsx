"use client";

import React from "react";

interface ContactButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
}

export default function ContactButton({
  href = "#contact",
  onClick,
  className = "",
}: ContactButtonProps) {
  const Tag = href ? "a" : "button";

  return (
    <>
      <style>{`
        .contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          border-radius: 999px;
          background: rgba(10, 10, 18, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-family: var(--font-sans, "Inter", sans-serif);
          font-size: 0.9375rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-decoration: none;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition:
            background 300ms ease,
            border-color 300ms ease,
            box-shadow 300ms ease,
            transform 200ms ease;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        /* Subtle inner shimmer */
        .contact-btn::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.06) 0%,
            transparent 60%
          );
          pointer-events: none;
        }

        .contact-btn:hover {
          background: rgba(30, 28, 50, 0.9);
          border-color: rgba(108, 99, 255, 0.65);
          box-shadow:
            0 0 18px rgba(108, 99, 255, 0.28),
            0 0 40px rgba(108, 99, 255, 0.12),
            inset 0 0 12px rgba(108, 99, 255, 0.06);
          transform: translateY(-1px);
        }

        .contact-btn:active {
          transform: translateY(0px) scale(0.98);
        }

        /* Arrow icon animation */
        .contact-btn .btn-arrow {
          display: inline-flex;
          align-items: center;
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .contact-btn:hover .btn-arrow {
          transform: translateX(5px);
        }

        /* Text span */
        .contact-btn .btn-text {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <Tag
        href={href}
        onClick={onClick}
        className={`contact-btn ${className}`}
        id="contact-us-btn"
      >
        <span className="btn-text">Contact Us</span>
        <span className="btn-arrow" aria-hidden="true">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.5 8.5H13.5M13.5 8.5L9.5 4.5M13.5 8.5L9.5 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </Tag>
    </>
  );
}
