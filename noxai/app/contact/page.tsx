import type { Metadata } from "next";
import ContactSection from "../components/ContactSection";

export const metadata: Metadata = {
  title: "Contact Us — Nox7.ai",
  description:
    "Get in touch with the Nox7.ai team. We'd love to hear about your organisation and how our AI intelligence layer can help you manage cyber risk.",
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
