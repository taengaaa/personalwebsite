import { ProjektePageWrapper } from "@/components/projekte-page-wrapper";
import { ProjectGrid } from "@/components/projekte/project-grid";

export default async function ProjektePage() {
  return (
    <ProjektePageWrapper>
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
    </ProjektePageWrapper>
  );
}
