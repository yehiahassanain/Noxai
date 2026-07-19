"use client";

import React from "react";
import ContactButton from "./ContactButton";

export default function HeroSection() {
  return (
    <>
      <style>{`
        /* ── Hero wrapper ── */
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Background video ── */
        .hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          z-index: 0;
          /* Subtle desaturation to keep focus on text */
          filter: brightness(0.75) saturate(0.9);
        }

        /* ── Dark gradient overlay ── */
        .hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            160deg,
            rgba(5, 5, 8, 0.62) 0%,
            rgba(5, 5, 8, 0.72) 40%,
            rgba(5, 5, 8, 0.85) 100%
          );
        }

        /* Subtle radial vignette on top */
        .hero-overlay::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 80% 60% at 50% 50%,
            transparent 30%,
            rgba(5, 5, 8, 0.45) 100%
          );
        }

        /* ── Content ── */
        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 1.5rem;
          gap: 2.25rem;
          animation: heroFadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Eyebrow label ── */
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(108, 99, 255, 0.35);
          background: rgba(108, 99, 255, 0.1);
          backdrop-filter: blur(8px);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(167, 139, 250, 0.9);
          animation: heroFadeUp 1s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hero-eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167, 139, 250, 0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        /* ── Heading ── */
        .hero-heading {
          font-size: clamp(2.4rem, 5vw, 5rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #ffffff;
          max-width: 820px;
          animation: heroFadeUp 1s 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .hero-heading span.gradient-word {
          background: linear-gradient(
            135deg,
            #a78bfa 0%,
            #818cf8 40%,
            #c4b5fd 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Sub-text ── */
        .hero-subtext {
          font-size: clamp(1rem, 1vw, 1.15rem);
          color: rgba(240, 240, 245, 0.6);
          max-width: 780px;
          line-height: 1.7;
          font-weight: 400;
          animation: heroFadeUp 1s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── Button wrapper ── */
        .hero-cta {
          animation: heroFadeUp 1s 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* ── Scroll hint ── */
        .hero-scroll-hint {
          position: absolute;
          bottom: 2.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          animation: heroFadeUp 1.4s 0.8s ease both;
        }

        .hero-scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: scrollLine 1.8s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0%   { transform: scaleY(0); transform-origin: top; opacity: 0; }
          40%  { transform: scaleY(1); transform-origin: top; opacity: 1; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
      `}</style>

      <section className="hero-section" id="hero" aria-label="Hero section">
        {/* Background video */}
        <video
          className="hero-video"
          src="/data/BG1.mp4"
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
        />

        {/* Dark overlay */}
        <div className="hero-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="hero-content">
          
          {/* <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Nox7.ai
          </div> */}

          {/* Main heading */}
          <h1 className="hero-heading">
            The{" "}
            <span className="gradient-word">AI Intelligence Layer</span>
            <br />
            For Cyber Risks
          </h1>

          {/* Sub-text */}
          <p className="hero-subtext">
            Built for regulated enterprises and critical infrastructure operators that need continuous visibility across compliance,
             threats, assets, and Cyber risk with AI reasoning that is explainable, auditable, and defensible.
          </p>

          {/* CTA */}
          <div className="hero-cta">
            <ContactButton href="/contact" />
          </div>
        </div>

    
        {/* <div className="hero-scroll-hint" aria-hidden="true">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div> */}
      </section>
    </>
  );
}
