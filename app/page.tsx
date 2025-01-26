"use client";

import { NavBar } from "@/components/ui/navbar";
import { Home, User, BookOpen, Briefcase } from "lucide-react";
import { AppleCardsCarouselDemo } from "@/components/apple-cards-carousel";

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
      <NavBar items={navItems} />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <section className="container pt-24 pb-32">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Welcome to My Portfolio
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-16">
            Exploring the intersection of design and development
          </p>
          <AppleCardsCarouselDemo />
        </section>
      </main>
    </>
  );
}