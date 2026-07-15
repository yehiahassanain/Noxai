import type { Metadata } from "next";
import ContactSection from "../components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us — Nox AI",
  description:
    "Get in touch with the Nox AI team. We'd love to hear about your organisation and how our AI intelligence layer can help you manage cyber risk.",
};

export default function ContactPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050508",
        paddingTop: "68px", /* offset fixed navbar height */
      }}
    >
      <ContactSection />
    </main>
  );
}
