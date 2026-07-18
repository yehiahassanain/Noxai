import HeroSection from "./components/HeroSection";
import SolutionsSection from "./components/SolutionsSection";
import SolutionSection2 from "./components/SolutionSection2";
import SolutionSection3 from "./components/SolutionSection3";
import ProcessSection from "./components/ProcessSection";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      {/* <SolutionsSection /> */}
      {/* <SolutionSection2 /> */}
      <SolutionSection3 />
      <ProcessSection />
      {/* <ContactSection /> */}
    </main>
  );
}
