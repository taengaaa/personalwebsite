"use client";

import { NavBar } from "@/components/ui/navbar";
import { Home, User, BookOpen, Briefcase } from "lucide-react";

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

export default function BlogPage() {
  return (
    <>
      <NavBar items={navItems} />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-24">
        <section className="container py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Blog
          </h1>
          <div className="grid gap-6">
            {/* Hier kommen Ihre Blog-Einträge */}
            <p className="text-xl text-muted-foreground">
              Noch keine Blog-Einträge vorhanden.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
