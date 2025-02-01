"use client";

import { NavBar } from "@/components/ui/navbar";
import { Home, User, BookOpen, Briefcase } from "lucide-react";
import { AppleCards } from "@/components/apple-cards-content";
import TypewriterHero from "@/components/typewriter-hero";

const navItems = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "Über mich",
    url: "/uebermich",
    icon: User,
  },
  {
    name: "Blog",
    url: "/blog",
    icon: BookOpen,
  },
  {
    name: "Projekte",
    url: "/projekte",
    icon: Briefcase,
  },
];

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