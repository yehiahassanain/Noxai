"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";


  //  Nav link definitions

interface NavLink {
  label: string;
  href: string;
  /** If true, performs smooth-scroll to the section id on the home page */
  isSection: boolean;
}

const NAV_LINKS: NavLink[] = [
  { label: "Solution", href: "#solutions", isSection: true },
  { label: "Process",  href: "#process",  isSection: true },
  { label: "Get In Touch",   href: "/contact",   isSection: false },
];

/* ─────────────────────────────────────────
   Hamburger icon
───────────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
      className="nb-hamburger-svg"
    >
      {/* Top bar */}
      <line
        x1="3" y1="6.5" x2="19" y2="6.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        style={{
          transform: open ? "rotate(45deg) translate(3px, -3px)" : "none",
          transformOrigin: "left center",
          transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      {/* Middle bar */}
      <line
        x1="3" y1="11" x2="19" y2="11"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        style={{
          opacity: open ? 0 : 1,
          transition: "opacity 200ms ease",
        }}
      />
      {/* Bottom bar */}
      <line
        x1="3" y1="15.5" x2="19" y2="15.5"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
        style={{
          transform: open ? "rotate(-45deg) translate(3px, 3px)" : "none",
          transformOrigin: "left center",
          transition: "transform 300ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />
    </svg>
  );
}

  //  Main Navbar component

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ── Scroll detection: background + active section ── */
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);

      /* Only track sections on the home page */
      if (pathname !== "/") return;

      const sectionIds = ["solutions", "process", "contact"];
      let current = "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 100) current = id;
      }

      setActiveSection(current);
    }

    onScroll(); // run once on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  /* ── Lock body scroll when mobile menu is open ── */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* ── Close mobile menu on resize to desktop ── */
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── Handle link click ── */
  const handleLinkClick = useCallback(
    (link: NavLink, e: React.MouseEvent) => {
      setMobileOpen(false);

      if (!link.isSection) return; // regular Next.js navigation

      e.preventDefault();
      const sectionId = link.href.slice(1); // strip "#"

      if (pathname !== "/") {
        /* Navigate home first, then scroll after hydration */
        window.location.href = `/${link.href}`;
        return;
      }

      /* Immediately mark this section as active so the underline shows at once */
      setActiveSection(sectionId);

      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [pathname]
  );

  /* ── Active link check ── */
  function isActive(link: NavLink): boolean {
    if (!link.isSection) {
      return pathname === link.href;
    }
    return pathname === "/" && activeSection === link.href.slice(1);
  }

  return (
    <>
      <style>{`
        /* ── Navbar wrapper ── */
        .nb-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 68px;
          display: flex;
          align-items: center;
          transition:
            background 350ms ease,
            border-color 350ms ease,
            box-shadow 350ms ease,
            backdrop-filter 350ms ease;
          border-bottom: 1px solid transparent;
        }

        /* Transparent (top of page) */
        .nb-nav--top {
          background: transparent;
          box-shadow: none;
          border-bottom-color: transparent;
        }

        /* Scrolled: frosted glass */
        .nb-nav--scrolled {
          background: rgba(5, 5, 8, 0.82);
          backdrop-filter: blur(18px) saturate(1.6);
          -webkit-backdrop-filter: blur(18px) saturate(1.6);
          border-bottom-color: rgba(255, 255, 255, 0.07);
          box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.35);
        }

        /* ── Inner container ── */
        .nb-inner {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        /* ── Logo area ── */
        .nb-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
          transition: opacity 200ms ease;
        }

        .nb-logo:hover {
          opacity: 0.85;
        }

        .nb-logo-img {
          width: 64px;
          height: 64px;
          object-fit: contain;
          display: block;
        }

        .nb-logo-text {
          font-size: 1.125rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: #ffffff;
          font-family: var(--font-sans, "Inter", sans-serif);
        }

        .nb-logo-text span {
          background: linear-gradient(135deg, #a78bfa 0%, #818cf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ── Desktop nav links ── */
        .nb-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nb-link-item {
          position: relative;
        }

        .nb-link {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(240, 240, 245, 0.65);
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          border: none;
          font-family: var(--font-sans, "Inter", sans-serif);
          transition:
            color 220ms ease,
            background 220ms ease;
          position: relative;
        }

        .nb-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        /* Active link */
        .nb-link--active {
          color: #ffffff !important;
        }

        /* Active underline indicator */
        .nb-link--active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 14px;
          right: 14px;
          height: 2px;
          border-radius: 99px;
          background: linear-gradient(90deg, #6c63ff, #a78bfa);
          box-shadow: 0 0 8px rgba(108,99,255,0.6);
        }

        /* Contact link: pill style */
        .nb-link--contact {
          padding: 7px 18px;
          border-radius: 999px;
          border: 1px solid rgba(108, 99, 255, 0.4);
          color: rgba(167, 139, 250, 0.9) !important;
          margin-left: 8px;
        }

        .nb-link--contact:hover {
          background: rgba(108, 99, 255, 0.12);
          border-color: rgba(108, 99, 255, 0.7);
          color: #fff !important;
          box-shadow: 0 0 16px rgba(108,99,255,0.2);
        }

        .nb-link--contact.nb-link--active {
          background: rgba(108, 99, 255, 0.15);
          border-color: rgba(108, 99, 255, 0.65);
        }

        /* Remove generic active underline for Contact pill */
        .nb-link--contact::after {
          display: none !important;
        }

        /* ── Hamburger button ── */
        .nb-hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #ffffff;
          cursor: pointer;
          transition:
            background 200ms ease,
            border-color 200ms ease;
          flex-shrink: 0;
        }

        .nb-hamburger:hover {
          background: rgba(108, 99, 255, 0.15);
          border-color: rgba(108, 99, 255, 0.4);
        }

        /* ── Mobile overlay backdrop ── */
        .nb-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 998;
          background: rgba(5, 5, 8, 0.65);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: nbFadeIn 220ms ease both;
        }

        @keyframes nbFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Mobile slide-out panel ── */
        .nb-mobile-menu {
          display: none;
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(320px, 85vw);
          z-index: 999;
          background: rgba(10, 10, 18, 0.97);
          border-left: 1px solid rgba(255,255,255,0.08);
          box-shadow: -8px 0 40px rgba(0,0,0,0.6);
          flex-direction: column;
          padding: 0;
          animation: nbSlideIn 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
          overflow-y: auto;
        }

        @keyframes nbSlideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }

        .nb-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          height: 68px;
          flex-shrink: 0;
        }

        .nb-mobile-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(240,240,245,0.7);
          cursor: pointer;
          transition: background 200ms ease, color 200ms ease;
        }

        .nb-mobile-close:hover {
          background: rgba(239,68,68,0.12);
          border-color: rgba(239,68,68,0.3);
          color: #f87171;
        }

        .nb-mobile-links {
          list-style: none;
          padding: 16px 12px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .nb-mobile-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          color: rgba(240, 240, 245, 0.65);
          text-decoration: none;
          cursor: pointer;
          background: transparent;
          border: none;
          font-family: var(--font-sans, "Inter", sans-serif);
          width: 100%;
          text-align: left;
          transition:
            color 200ms ease,
            background 200ms ease;
        }

        .nb-mobile-link:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .nb-mobile-link--active {
          color: #a78bfa !important;
          background: rgba(108, 99, 255, 0.1) !important;
        }

        .nb-mobile-link-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(167,139,250,0.4);
          flex-shrink: 0;
          transition: background 200ms ease, box-shadow 200ms ease;
        }

        .nb-mobile-link--active .nb-mobile-link-dot,
        .nb-mobile-link:hover .nb-mobile-link-dot {
          background: #a78bfa;
          box-shadow: 0 0 6px rgba(167,139,250,0.7);
        }

        .nb-mobile-footer {
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
        }

        .nb-mobile-contact-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 13px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(108,99,255,0.25) 0%, rgba(167,139,250,0.15) 100%);
          border: 1px solid rgba(108, 99, 255, 0.4);
          color: #a78bfa;
          font-size: 0.9375rem;
          font-weight: 600;
          font-family: var(--font-sans, "Inter", sans-serif);
          text-decoration: none;
          cursor: pointer;
          transition:
            background 220ms ease,
            border-color 220ms ease,
            color 220ms ease,
            box-shadow 220ms ease;
        }

        .nb-mobile-contact-btn:hover {
          background: linear-gradient(135deg, rgba(108,99,255,0.35) 0%, rgba(167,139,250,0.25) 100%);
          border-color: rgba(108, 99, 255, 0.65);
          color: #ffffff;
          box-shadow: 0 0 20px rgba(108,99,255,0.25);
        }

        /* ── Responsive: show hamburger, hide desktop links ── */
        @media (max-width: 767px) {
          .nb-links {
            display: none;
          }
          .nb-hamburger {
            display: flex;
          }
          .nb-inner {
            padding: 0 1.25rem;
          }
        }

        /* ── Visible states (controlled by JS) ── */
        .nb-backdrop--open {
          display: block;
        }
        .nb-mobile-menu--open {
          display: flex;
        }
      `}</style>

      {/* ── Fixed Navbar ── */}
      <nav
        className={`nb-nav ${scrolled ? "nb-nav--scrolled" : "nb-nav--top"}`}
        aria-label="Main navigation"
      >
        <div className="nb-inner">
          {/* Logo */}
          <Link href="/" className="nb-lo
          go" aria-label="Nox AI — home">
            <Image
              src="/data/Logo.png"
              alt="Nox AI logo"
              width={36}
              height={36} 
              className="nb-logo-img"
              priority
            />
            {/* <span className="nb-logo-text">
              Nox<span>AI</span>
            </span> */}
          </Link>

          {/* Desktop nav links */}
          <ul className="nb-links" role="list">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              const isContact = link.href === "/contact";

              if (link.isSection) {
                return (
                  <li key={link.label} className="nb-link-item">
                    <a
                      href={link.href}
                      className={`nb-link${active ? " nb-link--active" : ""}`}
                      onClick={(e) => handleLinkClick(link, e)}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              }

              return (
                <li key={link.label} className="nb-link-item">
                  <Link
                    href={link.href}
                    className={`nb-link nb-link--contact${active ? " nb-link--active" : ""}`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Hamburger (mobile) */}
          <button
            id="nb-hamburger-btn"
            className="nb-hamburger"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="nb-mobile-panel"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </div>
      </nav>

      {/* ── Backdrop ── */}
      {mobileOpen && (
        <div
          className="nb-backdrop nb-backdrop--open"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile slide-out panel ── */}
      {mobileOpen && (
        <div
          id="nb-mobile-panel"
          className="nb-mobile-menu nb-mobile-menu--open"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Panel header */}
          <div className="nb-mobile-header">
            <Link
              href="/"
              className="nb-logo"
              onClick={() => setMobileOpen(false)}
              aria-label="Nox AI — home"
            >
              <Image
                src="/data/Logo.png"
                alt="Nox AI logo"
                width={44}
                height={44}
                className="nb-logo-img"
              />
              {/* <span className="nb-logo-text">
                Nox<span>AI</span>
              </span> */}
            </Link>

            <button
              className="nb-mobile-close"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Section links (Solutions, Progress) */}
          <ul className="nb-mobile-links" role="list">
            {NAV_LINKS.filter((l) => l.isSection).map((link) => {
              const active = isActive(link);
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`nb-mobile-link${active ? " nb-mobile-link--active" : ""}`}
                    onClick={(e) => handleLinkClick(link, e)}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="nb-mobile-link-dot" />
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Contact CTA at the bottom */}
          <div className="nb-mobile-footer">
            <Link
              href="/contact"
              className="nb-mobile-contact-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Go to Contact page"
            >
              Contact Us
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
