"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";


  //  Scroll-reveal hook (mirrors SolutionsSection pattern)

function useScrollReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("ss3-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}


  //  Main Component

export default function SolutionSection3() {
  const textRef  = useScrollReveal(0);
  const imageRef = useScrollReveal(120);

  return (
    <>
      <style>{`
        /* ── Section ── */
        .ss3-section {
          width: 100%;
          padding: 100px 0 120px;
          background: #050508;
          position: relative;
          overflow: hidden;
        }

        /* faint ambient blob — mirrors solutions-section::before */
        .ss3-section::before {
          content: "";
          position: absolute;
          top: 10%;
          left: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .ss3-section::after {
          content: "";
          position: absolute;
          bottom: 5%;
          right: -6%;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Container ── */
        .ss3-inner {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 2.5rem;
        }

        /* ── Row: text left (35%) | image right (65%) ── */
        .ss3-row {
          display: grid;
          grid-template-columns: 35fr 65fr;
          gap: 56px;
          align-items: center;
        }

        /* ── Scroll reveal ── */
        .ss3-reveal {
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .ss3-reveal.ss3-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Text column ── */
        .ss3-text-col {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-right: 8px;
        }

        /* Eyebrow badge */
        .ss3-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1px solid rgba(108,99,255,0.35);
          background: rgba(108,99,255,0.08);
          backdrop-filter: blur(6px);
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(167,139,250,0.9);
          margin-bottom: 20px;
          width: fit-content;
        }

        .ss3-eyebrow-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167,139,250,0.8);
          animation: ss3-pulse 2s ease-in-out infinite;
        }

        @keyframes ss3-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* Title */
        .ss3-title {
          font-size: clamp(1.65rem, 2.8vw, 2.6rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .ss3-title-gradient {
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 45%, #c4b5fd 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Body paragraph */
        .ss3-body {
          font-size: clamp(0.875rem, 1.3vw, 1rem);
          line-height: 1.8;
          color: rgba(240, 240, 245, 0.6);
          font-weight: 400;
          margin-bottom: 0;
        }

        /* Bullet list */
        .ss3-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 28px;
        }

        .ss3-bullet {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .ss3-bullet-dot {
          flex-shrink: 0;
          margin-top: 8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #a78bfa);
          box-shadow: 0 0 6px rgba(108,99,255,0.55);
        }

        .ss3-bullet-text {
          font-size: 0.875rem;
          line-height: 1.75;
          color: rgba(240, 240, 245, 0.6);
          font-weight: 400;
        }

        .ss3-bullet-highlight {
          color: #a78bfa;
          font-weight: 500;
        }

        /* ── Image column ── */
        .ss3-image-col {
          position: relative;
        }

        .ss3-image-frame {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          box-shadow:
            0 2px 0 rgba(255,255,255,0.06),
            0 20px 60px rgba(0,0,0,0.6),
            0 4px 12px rgba(0,0,0,0.4);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }

        .ss3-image-frame:hover {
          transform: translateY(-4px);
          box-shadow:
            0 2px 0 rgba(255,255,255,0.08),
            0 32px 72px rgba(0,0,0,0.65),
            0 0 32px rgba(108,99,255,0.12);
        }

        .ss3-image {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 14px;
          filter: brightness(1) contrast(1.02);
        }

        /* top-edge shimmer — matches sol-image-shine */
        .ss3-image-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .ss3-row {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          /* On mobile, image goes above text */
          .ss3-image-col { order: 0; }
          .ss3-text-col  { order: 1; padding-right: 0; }

          .ss3-section {
            padding: 72px 0 80px;
          }
        }
      `}</style>

      <section
        className="ss3-section"
        id="solutions"
        aria-label="AI Intelligence Layer for Regulated Enterprises"
      >
        <div className="ss3-inner">
          <div className="ss3-row">

            {/* ── Text column (LEFT) ── */}
            <div ref={textRef} className="ss3-reveal ss3-text-col">
              {/* <div className="ss3-eyebrow">
                <span className="ss3-eyebrow-dot" />
                AI Intelligence
              </div> */}

              <h2 className="ss3-title">
                The AI Intelligence Layer for{" "}
                <span className="ss3-title-gradient">Enterprises</span>
              </h2>

              <p className="ss3-body">
                Nox AI continuously reasons across your Risks,
                 Regulations, Controls, Assets and Business context to deliver clarity,
                  reduce risk and build resilience.
              </p>

              <ul className="ss3-bullets">
                <li className="ss3-bullet">
                  <span className="ss3-bullet-dot" aria-hidden="true" />
                  <span className="ss3-bullet-text">
                    <span className="ss3-bullet-highlight">Regulations &amp; Controls</span> — continuously mapped and scored against your live compliance posture.
                  </span>
                </li>
                <li className="ss3-bullet">
                  <span className="ss3-bullet-dot" aria-hidden="true" />
                  <span className="ss3-bullet-text">
                    <span className="ss3-bullet-highlight">Assets &amp; Threats</span> — enterprise-wide visibility with real-time intelligence surfaced in context.
                  </span>
                </li>
                <li className="ss3-bullet">
                  <span className="ss3-bullet-dot" aria-hidden="true" />
                  <span className="ss3-bullet-text">
                    <span className="ss3-bullet-highlight">Evidence &amp; Business Context</span> — every finding grounded in traceable, auditable data.
                  </span>
                </li>
              </ul>
            </div>

            {/* ── Image column (RIGHT) ── */}
            <div ref={imageRef} className="ss3-reveal ss3-image-col">
              <div className="ss3-image-frame">
                <Image
                  src="/data/FinalSolutionImage.png"
                  alt="The AI Intelligence Layer for Regulated Enterprises — Nox AI platform overview"
                  width={820}
                  height={600}
                  className="ss3-image"
                  quality={95}
                />
                <div className="ss3-image-shine" />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
