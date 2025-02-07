import { FeaturedSection } from "../components/sections/FeaturedSection";

export function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src="https://placehold.co/1920x1080/242a4d/7f84b5/jpeg?text=CSI:+Miami"
          alt="CSI: Miami"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zax-bg via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl font-bold text-white mb-2">CSI: Miami</h1>
          <p className="text-zax-text text-lg mb-4">T3 E9 Pirateado</p>
          <div className="flex gap-4">
            <button className="bg-zax-button hover:bg-zax-primary text-white px-6 py-2 rounded-lg transition-colors">
              Assistir Agora
            </button>
            <button className="bg-zax-secondary text-zax-text px-6 py-2 rounded-lg hover:text-white transition-colors">
              + Minha Lista
            </button>
          </div>
        </div>
      </div>

      <FeaturedSection />
    </div>
  );
}
