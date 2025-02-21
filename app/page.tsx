import dynamic from 'next/dynamic';
import { CombinedCardsSection } from "@/components/shared/combined-cards-section";

// Import client components
const NavBar = dynamic(() => import("@/components/shared/navbar").then(mod => mod.NavBar));
const TypewriterHero = dynamic(() => import("@/components/home/typewriter-hero"));

export default function HomePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <TypewriterHero />
        <section className="container pt-12 pb-32">
          <CombinedCardsSection />
        </section>
      </main>
    </>
  );
}