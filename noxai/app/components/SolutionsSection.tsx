"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

/* ─────────────────────────────────────────
   Types & Data
───────────────────────────────────────── */
interface Bullet {
  text: string;
  highlight?: string; // word(s) to color in purple
}

interface Solution {
  id: number;
  image: string;
  imageAlt: string;
  title: string;
  bullets: Bullet[];
}

const solutions: Solution[] = [
  {
    id: 1,
    image: "/data/FirstDescription.png",
    imageAlt: "Cyber Reasoning Engine interface showing live regulatory data",
    title: "A Cyber Reasoning Engine, Not a Chatbot",
    bullets: [
      {
        text: "Reasons over live regulatory obligations, control state, and security data in plain language.",
        highlight: "live regulatory obligations",
      },
      {
        text: "Ask why a score changed, what a regulatory update means for your controls, or what to prioritize today.",
        highlight: "regulatory update",
      },
      {
        text: "Every answer is grounded in live, scored data — not static documentation.",
        highlight: "live, scored data",
      },
      {
        text: "AI explains. The rules engine scores. Everything is fully traceable.",
        highlight: "fully traceable",
      },
    ],
  },
];

/* ─────────────────────────────────────────
   Scroll reveal hook
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
          el.classList.add("sol-visible");
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

/* ─────────────────────────────────────────
   Highlight helper — wraps matched text in a <mark>
───────────────────────────────────────── */
function HighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  if (!highlight) return <>{text}</>;
  const parts = text.split(highlight);
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <mark className="sol-mark">{highlight}</mark>
      {parts.slice(1).join(highlight)}
    </>
  );
}

/* ─────────────────────────────────────────
   Single row
───────────────────────────────────────── */
function SolutionRow({
  solution,
  reverse,
}: {
  solution: Solution;
  reverse: boolean;
}) {
  const imgRef = useScrollReveal(0);
  const txtRef = useScrollReveal(120);

  return (
    <div className={`sol-row ${reverse ? "sol-row--reverse" : ""}`}>
      {/* ── Image (large) ── */}
      <div ref={imgRef} className="sol-reveal sol-image-col">
        <div className="sol-image-frame">
          <Image
            src={solution.image}
            alt={solution.imageAlt}
            width={760}
            height={500}
            className="sol-image"
            priority={solution.id === 1}
            quality={95}
          />
          {/* subtle reflection line at top of frame */}
          <div className="sol-image-shine" />
        </div>
      </div>

      {/* ── Text (compact) ── */}
      <div ref={txtRef} className="sol-reveal sol-text-col">
        <h2 className="sol-title">{solution.title}</h2>

        <ul className="sol-bullets">
          {solution.bullets.map((b, i) => (
            <li key={i} className="sol-bullet">
              <span className="sol-bullet-dot" aria-hidden="true" />
              <span className="sol-bullet-text">
                <HighlightedText text={b.text} highlight={b.highlight} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main export
───────────────────────────────────────── */
export default function SolutionsSection() {
  return (
    <>
      <style>{`
        /* ── Section ── */
        .solutions-section {
          width: 100%;
          padding: 100px 0 120px;
          background: #050508;
          position: relative;
          overflow: hidden;
        }

        /* faint ambient blob */
        .solutions-section::before {
          content: "";
          position: absolute;
          top: 10%;
          right: -10%;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(108,99,255,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        /* ── Container ── */
        .solutions-inner {
          position: relative;
          z-index: 1;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 2.5rem;
        }

        /* ── Row ── */
        .sol-row {
          display: grid;
          /* Image 60% — text 40% */
          grid-template-columns: 60fr 40fr;
          gap: 64px;
          align-items: center;
          margin-bottom: 110px;
        }

        .sol-row:last-child {
          margin-bottom: 0;
        }

        /* Reversed: text left, image right */
        .sol-row--reverse {
          grid-template-columns: 40fr 60fr;
        }
        .sol-row--reverse .sol-image-col { order: 2; }
        .sol-row--reverse .sol-text-col  { order: 1; }

        /* ── Scroll reveal ── */
        .sol-reveal {
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sol-reveal.sol-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Image column ── */
        .sol-image-col {
          position: relative;
        }

        .sol-image-frame {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          /* Crisp dark shadow — no coloured glow so the image reads clearly */
          box-shadow:
            0 2px 0 rgba(255,255,255,0.06),
            0 20px 60px rgba(0,0,0,0.6),
            0 4px 12px rgba(0,0,0,0.4);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease;
        }

        .sol-image-frame:hover {
          transform: translateY(-4px);
          box-shadow:
            0 2px 0 rgba(255,255,255,0.08),
            0 32px 72px rgba(0,0,0,0.65),
            0 0 32px rgba(108,99,255,0.12);
        }

        .sol-image {
          display: block;
          width: 100%;
          height: auto;
          border-radius: 14px;
          /* ensure full brightness — no dimming */
          filter: brightness(1) contrast(1.02);
        }

        /* top-edge shimmer */
        .sol-image-shine {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%);
        }

        /* ── Text column ── */
        .sol-text-col {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-left: 8px;
        }

        /* Title */
        .sol-title {
          font-size: clamp(1.35rem, 2vw, 1.9rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.25;
          letter-spacing: -0.02em;
          margin-bottom: 28px;
        }

        /* Bullet list */
        .sol-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .sol-bullet {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        /* Dot */
        .sol-bullet-dot {
          flex-shrink: 0;
          margin-top: 7px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #a78bfa);
          box-shadow: 0 0 6px rgba(108,99,255,0.55);
        }

        /* Bullet text */
        .sol-bullet-text {
          font-size: 0.875rem;
          line-height: 1.75;
          color: rgba(240, 240, 245, 0.6);
          font-weight: 400;
        }

        /* Highlighted words inside bullets */
        .sol-mark {
          background: none;
          color: #a78bfa;
          font-weight: 500;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .sol-row,
          .sol-row--reverse {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .sol-row--reverse .sol-image-col { order: 0; }
          .sol-row--reverse .sol-text-col  { order: 1; }

          .sol-text-col {
            padding-left: 0;
          }

          .solutions-section {
            padding: 72px 0 80px;
          }
        }
      `}</style>

      <section
        className="solutions-section"
        id="solutions"
        aria-label="Solutions"
      >
        <div className="solutions-inner">
          {solutions.map((solution, index) => (
            <SolutionRow
              key={solution.id}
              solution={solution}
              reverse={index % 2 !== 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}
