"use client";

import { NavBar } from "@/components/ui/navbar";
import { AppleCards } from "@/components/apple-cards-content";
import TypewriterHero from "@/components/typewriter-hero";

export default function HomePage() {
  return (
    <>
      <NavBar activePage="Home" />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <TypewriterHero />
        <section className="container pt-12 pb-32">
          <AppleCards />
        </section>
      </main>
    </>
  );
}