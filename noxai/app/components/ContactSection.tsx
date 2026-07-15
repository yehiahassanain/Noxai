"use client";

import React, { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface FormFields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

/* ─────────────────────────────────────────
   Validators
───────────────────────────────────────── */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\-\s().0-9]{7,20}$/;

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.name.trim() || fields.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }
  if (!fields.email.trim() || !emailRegex.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!fields.phone.trim() || !phoneRegex.test(fields.phone.trim())) {
    errors.phone =
      "Phone must be 7–20 characters (digits, spaces, +, -, (, ) only).";
  }
  if (!fields.message.trim() || fields.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

/* ─────────────────────────────────────────
   Scroll-reveal hook (same pattern as SolutionsSection)
───────────────────────────────────────── */
function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("cf-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

/* ─────────────────────────────────────────
   Spinner SVG
───────────────────────────────────────── */
function Spinner() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
      className="cf-spinner"
    >
      <circle
        cx="9"
        cy="9"
        r="7"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M9 2a7 7 0 0 1 7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export default function ContactSection() {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState<string>("");

  const headerRef = useScrollReveal(0);
  const formRef = useScrollReveal(120);

  /* derive errors only for touched fields */
  const allErrors = validate(fields);
  const displayErrors: FormErrors = {};
  (Object.keys(allErrors) as (keyof FormErrors)[]).forEach((k) => {
    if (touched[k]) displayErrors[k] = allErrors[k];
  });

  /* ── Field change ── */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  /* ── Mark field as touched on blur ── */
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }

  /* ── Submit — opens Gmail compose with form data pre-filled ── */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    /* Touch all fields so validation errors show */
    setTouched({ name: true, email: true, phone: true, message: true });

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) return;

    setSubmitStatus("loading");
    setServerError("");

    try {
      const to      = "MM@GridNox.ai";
      const subject = `New Contact Form Submission from ${fields.name.trim()}`;
      const body = [
        `Full Name:     ${fields.name.trim()}`,
        `Email Address: ${fields.email.trim()}`,
        `Phone Number:  ${fields.phone.trim()}`,
        ``,
        `Message:`,
        fields.message.trim(),
      ].join("\n");

      /* Build Gmail compose URL */
      const gmailUrl =
        `https://mail.google.com/mail/?view=cm&fs=1` +
        `&to=${encodeURIComponent(to)}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      /* Open Gmail compose in a new tab */
      window.open(gmailUrl, "_blank", "noopener,noreferrer");

      /* Mark success and clear the form */
      setSubmitStatus("success");
      setFields({ name: "", email: "", phone: "", message: "" });
      setTouched({});
    } catch {
      setServerError("Could not open Gmail. Please try again.");
      setSubmitStatus("error");
    }
  }

  const isLoading = submitStatus === "loading";

  return (
    <>
      <style>{`
        /* ── Section ── */
        .contact-section {
          width: 100%;
          padding: 100px 0 120px;
          background: #050508;
          position: relative;
          overflow: hidden;
        }

        /* Ambient blobs */
        .contact-section::before {
          content: "";
          position: absolute;
          top: -10%;
          left: -8%;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .contact-section::after {
          content: "";
          position: absolute;
          bottom: -5%;
          right: -8%;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Inner wrapper ── */
        .contact-inner {
          position: relative;
          z-index: 1;
          max-width: 580px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 48px;
        }

        /* ── Scroll reveal ── */
        .cf-reveal {
          opacity: 0;
          transform: translateY(32px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          width: 100%;
        }
        .cf-reveal.cf-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Header ── */
        .cf-header {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .cf-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(108, 99, 255, 0.35);
          background: rgba(108, 99, 255, 0.1);
          backdrop-filter: blur(8px);
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(167, 139, 250, 0.9);
        }

        .cf-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167, 139, 250, 0.8);
          animation: cfPulse 2s ease-in-out infinite;
        }

        @keyframes cfPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .cf-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.15;
          letter-spacing: -0.03em;
          margin: 0;
        }

        .cf-title-gradient {
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 40%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cf-subtitle {
          font-size: 0.95rem;
          line-height: 1.7;
          color: rgba(240, 240, 245, 0.55);
          max-width: 420px;
          text-align: center;
        }

        /* ── Card ── */
        .cf-card {
          width: 100%;
          background: rgba(13, 13, 20, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        /* Card top-edge shimmer */
        .cf-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(108,99,255,0.5) 50%, transparent 100%);
          pointer-events: none;
        }

        /* ── Form ── */
        .cf-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Field group ── */
        .cf-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cf-label {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(240, 240, 245, 0.5);
        }

        /* ── Input / Textarea ── */
        .cf-input,
        .cf-textarea {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f0f0f5;
          font-family: var(--font-sans, "Inter", sans-serif);
          font-size: 0.9375rem;
          outline: none;
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            background 220ms ease;
          -webkit-appearance: none;
          appearance: none;
        }

        .cf-input::placeholder,
        .cf-textarea::placeholder {
          color: rgba(240, 240, 245, 0.25);
        }

        .cf-input:hover,
        .cf-textarea:hover {
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
        }

        .cf-input:focus,
        .cf-textarea:focus {
          border-color: rgba(108, 99, 255, 0.65);
          background: rgba(108, 99, 255, 0.04);
          box-shadow:
            0 0 0 3px rgba(108, 99, 255, 0.12),
            0 0 16px rgba(108, 99, 255, 0.08);
        }

        /* Error state */
        .cf-input.cf-input--error,
        .cf-textarea.cf-input--error {
          border-color: rgba(239, 68, 68, 0.55);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
        }

        .cf-textarea {
          resize: vertical;
          min-height: 120px;
        }

        /* ── Inline error ── */
        .cf-error-msg {
          font-size: 0.78rem;
          color: #f87171;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cf-error-msg::before {
          content: "!";
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.2);
          font-size: 0.65rem;
          font-weight: 700;
          color: #f87171;
          flex-shrink: 0;
        }

        /* ── Submit button ── */
        .cf-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px 28px;
          border-radius: 12px;
          background: linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%);
          border: none;
          color: #ffffff;
          font-family: var(--font-sans, "Inter", sans-serif);
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition:
            opacity 250ms ease,
            transform 200ms ease,
            box-shadow 300ms ease;
          margin-top: 4px;
        }

        .cf-submit::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .cf-submit:hover:not(:disabled) {
          box-shadow:
            0 0 24px rgba(108, 99, 255, 0.45),
            0 0 48px rgba(108, 99, 255, 0.18);
          transform: translateY(-1px);
        }

        .cf-submit:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }

        .cf-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
        }

        /* ── Spinner ── */
        .cf-spinner {
          animation: cfSpin 0.75s linear infinite;
          flex-shrink: 0;
        }

        @keyframes cfSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Banner messages ── */
        .cf-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 0.875rem;
          line-height: 1.55;
          font-weight: 500;
          animation: cfBannerIn 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes cfBannerIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .cf-banner--success {
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
        }

        .cf-banner--error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .cf-banner-icon {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* ── Row layout for name + email ── */
        .cf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .cf-card {
            padding: 28px 20px;
          }
          .cf-row {
            grid-template-columns: 1fr;
          }
          .contact-section {
            padding: 72px 0 80px;
          }
        }
      `}</style>

      <section
        className="contact-section"
        id="contact"
        aria-label="Contact form"
      >
        <div className="contact-inner">
          {/* ── Header ── */}
          <div ref={headerRef} className="cf-reveal cf-header">
            {/* <div className="cf-eyebrow">
              <span className="cf-eyebrow-dot" />
              Get In Touch
            </div> */}
            <h2 className="cf-title">
              Let&apos;s{" "}
              <span className="cf-title-gradient">Start a Conversation</span>
            </h2>
            <p className="cf-subtitle">
              Ready to see Nox AI in action? Send us a message and our team
              will get back to you shortly.
            </p>
          </div>

          {/* ── Form Card ── */}
          <div ref={formRef} className="cf-reveal">
            <div className="cf-card">
              {/* Success banner */}
              {submitStatus === "success" && (
                <div
                  className="cf-banner cf-banner--success"
                  role="status"
                  aria-live="polite"
                  style={{ marginBottom: "24px" }}
                >
                  <svg
                    className="cf-banner-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M6 10.5L8.5 13L14 7.5"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Gmail has opened with your message pre-filled. Please review
                  and click &quot;Send&quot; in Gmail to deliver it to us.
                </div>
              )}

              {/* Error banner */}
              {submitStatus === "error" && serverError && (
                <div
                  className="cf-banner cf-banner--error"
                  role="alert"
                  aria-live="assertive"
                  style={{ marginBottom: "24px" }}
                >
                  <svg
                    className="cf-banner-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="9"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M10 6v5M10 13.5v.5"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {serverError}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="cf-form"
                noValidate
                aria-label="Contact form"
              >
                {/* Row: Name + Email */}
                <div className="cf-row">
                  {/* Full Name */}
                  <div className="cf-field">
                    <label htmlFor="cf-name" className="cf-label">
                      Full Name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      className={`cf-input${displayErrors.name ? " cf-input--error" : ""}`}
                      placeholder="Jane Smith"
                      value={fields.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby={
                        displayErrors.name ? "cf-name-error" : undefined
                      }
                    />
                    {displayErrors.name && (
                      <span id="cf-name-error" className="cf-error-msg" role="alert">
                        {displayErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="cf-field">
                    <label htmlFor="cf-email" className="cf-label">
                      Email Address <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      className={`cf-input${displayErrors.email ? " cf-input--error" : ""}`}
                      placeholder="jane@company.com"
                      value={fields.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      aria-required="true"
                      aria-describedby={
                        displayErrors.email ? "cf-email-error" : undefined
                      }
                    />
                    {displayErrors.email && (
                      <span id="cf-email-error" className="cf-error-msg" role="alert">
                        {displayErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="cf-field">
                  <label htmlFor="cf-phone" className="cf-label">
                    Phone Number <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cf-phone"
                    name="phone"
                    type="tel"
                    className={`cf-input${displayErrors.phone ? " cf-input--error" : ""}`}
                    placeholder="+1 (555) 000-0000"
                    value={fields.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    autoComplete="tel"
                    aria-required="true"
                    aria-describedby={
                      displayErrors.phone ? "cf-phone-error" : undefined
                    }
                  />
                  {displayErrors.phone && (
                    <span id="cf-phone-error" className="cf-error-msg" role="alert">
                      {displayErrors.phone}
                    </span>
                  )}
                </div>

                {/* Message */}
                <div className="cf-field">
                  <label htmlFor="cf-message" className="cf-label">
                    Message <span aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="cf-message"
                    name="message"
                    className={`cf-textarea${displayErrors.message ? " cf-input--error" : ""}`}
                    placeholder="Tell us about your organisation and how we can help…"
                    value={fields.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={5}
                    aria-required="true"
                    aria-describedby={
                      displayErrors.message ? "cf-message-error" : undefined
                    }
                  />
                  {displayErrors.message && (
                    <span id="cf-message-error" className="cf-error-msg" role="alert">
                      {displayErrors.message}
                    </span>
                  )}
                </div>

                {/* Submit */}
                <button
                  id="cf-submit-btn"
                  type="submit"
                  className="cf-submit"
                  disabled={isLoading}
                  aria-label={isLoading ? "Sending your message…" : "Send message"}
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M3.5 8.5H13.5M13.5 8.5L9.5 4.5M13.5 8.5L9.5 12.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
