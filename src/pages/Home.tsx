import { FeaturedSection } from "../components/sections/FeaturedSection";
import { HeroSlider } from "../components/hero/HeroSlider";

export function Home() {
  return (
    <div className="relative">
      <HeroSlider />
      <FeaturedSection />
    </div>
  );
}
