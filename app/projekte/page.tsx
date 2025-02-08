"use client";

import { NavBar } from "@/components/ui/navbar";

export default function ProjektePage() {
  return (
    <>
      <NavBar activePage="Projekte" />
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80 pt-24">
        <section className="container py-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Projekte
          </h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Hier kommen Ihre Projekte */}
            <p className="text-xl text-muted-foreground md:col-span-2 lg:col-span-3">
              Noch keine Projekte vorhanden.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
