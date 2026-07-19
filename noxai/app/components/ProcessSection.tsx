"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface Step {
  id: number;
  number: string;
  label: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    id: 1,
    number: "01",
    label: "Connect",
    icon: (
      <svg className="proc-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    id: 2,
    number: "02",
    label: "Reason",
    icon: (
      <svg className="proc-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2a10 10 0 1 0 10 10" />
        <path d="M12 6v2M12 16v2M6 12H4M20 12h-2" />
        <path d="m8.46 8.46-1.41-1.41M16.95 16.95l-1.41-1.41M16.95 7.05l-1.41 1.41M8.46 15.54l-1.41 1.41" />
      </svg>
    ),
  },
  {
    id: 3,
    number: "03",
    label: "Prioritize",
    icon: (
      <svg className="proc-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: 4,
    number: "04",
    label: "Act",
    icon: (
      <svg className="proc-tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}ms`;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { el.classList.add("proc-visible"); obs.unobserve(el); }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(2);
  const headingRef = useScrollReveal(0);
  const tabsRef   = useScrollReveal(150);

  return (
    <>
      <style>{`
        .proc-section {
          width: 100%;
          padding: 100px 0 120px;
          background: #050508;
          position: relative;
          overflow: hidden;
        }
        .proc-section::before {
          content: "";
          position: absolute;
          top: 20%; right: -8%;
          width: 560px; height: 560px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 68%);
          pointer-events: none;
        }
        .proc-section::after {
          content: "";
          position: absolute;
          bottom: 10%; left: -6%;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 68%);
          pointer-events: none;
        }
        .proc-inner {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto;
          padding: 0 2.5rem;
          display: flex; flex-direction: column;
          align-items: center; gap: 56px;
        }
        .proc-heading { text-align: center; max-width: 880px; }
        .proc-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 14px; border-radius: 999px;
          border: 1px solid rgba(108,99,255,0.35);
          background: rgba(108,99,255,0.08);
          backdrop-filter: blur(6px);
          font-size: 0.1rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(167,139,250,0.9); margin-bottom: 18px;
        }
        .proc-eyebrow-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167,139,250,0.8);
          animation: proc-pulse 2s ease-in-out infinite;
        }
        @keyframes proc-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }
        .proc-title {
          font-size: clamp(1.9rem, 3.8vw, 3rem);
          font-weight: 700; color: #fff;
          line-height: 1.16; letter-spacing: -0.03em;
          margin-bottom: 14px;
        }
        .proc-title-gradient {
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .proc-subtitle {
          font-size: clamp(0.88rem, 1vw, 1.02rem);
          color: rgba(240,240,245,0.55);
          line-height: 1.7; margin: 0 auto;
        }
        .proc-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          cursor: pointer;
          transition: all 0.28s cubic-bezier(0.22,1,0.36,1);
          color: rgba(200,190,240,0.5);
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
        }
        .proc-tab::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(108,99,255,0.12), rgba(167,139,250,0.06));
          opacity: 0;
          transition: opacity 0.28s ease;
        }
        .proc-tab:hover::before { opacity: 1; }
        .proc-tab:hover { color: rgba(200,190,240,0.85); }
        .proc-tab.proc-tab--active {
          background: rgba(108,99,255,0.15);
          border-color: rgba(108,99,255,0.5);
          color: rgba(196,181,253,0.95);
          box-shadow: 0 0 18px rgba(108,99,255,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
        }
        .proc-tab-icon {
          width: 16px; height: 16px;
          flex-shrink: 0;
          transition: color 0.28s ease;
        }
        .proc-tab-number {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          opacity: 0.7;
        }
        .proc-tab-label { font-weight: 600; }
        /* ── Unified card: tabs + image share one border ── */
        .proc-card {
          width: 100%;
          border-radius: 18px;
          border: 1px solid rgba(108,99,255,0.25);
          background: rgba(8,7,22,0.75);
          backdrop-filter: blur(14px);
          box-shadow:
            0 2px 0 rgba(255,255,255,0.05),
            0 28px 80px rgba(0,0,0,0.6),
            0 0 48px rgba(108,99,255,0.1);
          overflow: hidden;
        }
        /* Tab bar sits at the top of the card */
        .proc-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-bottom: 1px solid rgba(108,99,255,0.15);
          background: rgba(6,5,18,0.6);
        }
        /* Divider between tabs and image */
        .proc-card-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(108,99,255,0.25) 50%, transparent 100%);
        }
        /* Image area */
        .proc-image-wrap {
          position: relative;
          width: 100%;
          line-height: 0;
        }
        .proc-image {
          display: block;
          width: 100%;
          height: auto;
        }
        .proc-image-shine {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.3) 50%, transparent 100%);
          pointer-events: none;
        }
        /* ── Step highlight overlays ── */
        .proc-highlight {
          position: absolute;
          top: 4%; bottom: 4%;
          border-radius: 14px;
          border: 2px solid rgba(108,99,255,0);
          background: rgba(108,99,255,0);
          pointer-events: none;
          transition:
            border-color 0.4s cubic-bezier(0.22,1,0.36,1),
            background   0.4s cubic-bezier(0.22,1,0.36,1),
            box-shadow   0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .proc-highlight--active {
          border-color: rgba(167,139,250,0.65);
          background: rgba(108,99,255,0.08);
          box-shadow:
            0 0 0 4px rgba(108,99,255,0.07),
            inset 0 0 28px rgba(108,99,255,0.07),
            0 0 32px rgba(167,139,250,0.18);
        }
        /* Horizontal positions per step (left% + width%) */
        .proc-hl-1 { left: 1%;   width: 30%; }
        .proc-hl-2 { left: 34%;  width: 24%; }
        .proc-hl-3 { left: 59%;  width: 20%; }
        .proc-hl-4 { left: 78%;  width: 21%; }
        .proc-reveal {
          opacity: 0; transform: translateY(30px);
          transition:
            opacity 0.75s cubic-bezier(0.22,1,0.36,1),
            transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .proc-reveal.proc-visible { opacity: 1; transform: translateY(0); }
        @media (max-width: 720px) {
          .proc-section { padding: 64px 0 72px; }
          .proc-inner { padding: 0 1.25rem; gap: 36px; }
          .proc-tabs { flex-wrap: wrap; gap: 6px; }
          .proc-tab { flex: 1 1 calc(50% - 6px); padding: 10px 12px; font-size: 0.78rem; }
          .proc-tab-number { display: none; }
        }
        @media (max-width: 420px) {
          .proc-tab { flex: 1 1 100%; }
        }
      `}</style>

      <section className="proc-section" id="process" aria-label="How Nox7.ai works">
        <div className="proc-inner">

          <div ref={headingRef} className="proc-heading proc-reveal">
            <h2 className="proc-title">
              The missing intelligence layer between{" "}
              <span className="proc-title-gradient">Cyber systems</span>
              {" "}and{" "}
              <span className="proc-title-gradient">Cyber decisions</span>
            </h2>
            <p className="proc-subtitle">
              It connects existing Risks, regulatories, controls and asset data,
              then applies AI reasoning to explain what changed and what is exposed.
            </p>
          </div>

          {/* ── Unified card: tab bar + image in one border ── */}
          <div ref={tabsRef} className="proc-card proc-reveal">
            {/* Tab bar */}
            <nav className="proc-tabs" role="tablist" aria-label="Process steps">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  role="tab"
                  aria-selected={activeStep === step.id}
                  aria-controls="proc-panel"
                  id={`proc-tab-${step.id}`}
                  className={`proc-tab ${activeStep === step.id ? "proc-tab--active" : ""}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  {step.icon}
                  <span className="proc-tab-number">{step.number}</span>
                  <span className="proc-tab-label">{step.label}</span>
                </button>
              ))}
            </nav>

            {/* Image panel */}
            <div
              className="proc-image-wrap"
              id="proc-panel"
              role="tabpanel"
              aria-labelledby={`proc-tab-${activeStep}`}
            >
              <Image
                src="/data/ProcessSection1.png"
                alt="Nox7.ai process diagram - Connect, Reason, Prioritize, Act"
                width={1200}
                height={600}
                className="proc-image"
                quality={95}
                priority={false}
              />
              {/* Step highlight overlays */}
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  aria-hidden="true"
                  className={`proc-highlight proc-hl-${step.id}${
                    activeStep === step.id ? " proc-highlight--active" : ""
                  }`}
                />
              ))}
              <div className="proc-image-shine" aria-hidden="true" />
            </div>
            {/* Footer process image — sits flush below the section */}
      <div style={{ width: "90%", lineHeight: 0, background: "#050508" }}>
        <Image
          src="/data/FooterProcess.png"
          alt="Nox7.ai process footer diagram"
          width={1920}
          height={400}
          style={{ width: "100%", height: "auto", display: "block",margin:"20px 50px" }}
          quality={95}
        />
      </div>
          </div>
        </div>
      </section>

     
    </>
  );
}
