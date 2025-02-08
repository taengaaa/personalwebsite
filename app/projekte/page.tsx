"use client";

import { NavBar } from "@/components/ui/navbar";
import { ProjectGrid } from "@/components/project-grid";

export default function ProjektePage() {
  return (
    <>
      <NavBar activePage="Projekte" />
      <main className="min-h-screen bg-[#F5F5F5] pt-24">
        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Projekte
          </h1>
          <p className="text-xl text-muted-foreground mb-12">
            Eine Sammlung meiner aktuellen Arbeiten und Projekte.
          </p>
          <ProjectGrid />
        </div>
      </main>
    </>
  );
}
