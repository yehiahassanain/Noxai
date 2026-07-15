import HeroSection from "./components/HeroSection";
import SolutionsSection from "./components/SolutionsSection";
import SolutionSection2 from "./components/SolutionSection2";
import ProcessSection from "./components/ProcessSection";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SolutionsSection />
      <SolutionSection2 />
      <ProcessSection />
      {/* <ContactSection /> */}
    </main>
  );
}
