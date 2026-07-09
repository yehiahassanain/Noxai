import HeroSection from "./components/HeroSection";
import SolutionsSection from "./components/SolutionsSection";

export default function Home() {
  return (
    <main>
      {/* ── Section 1: Hero ── */}
      <HeroSection />

      {/* ── Section 2: Solutions ── */}
      <SolutionsSection />

      {/* ── Section 3 coming soon ── */}
    </main>
  );
}
