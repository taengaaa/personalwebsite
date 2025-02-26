import { ProjektePageWrapper } from "@/components/projekte-page-wrapper";
import { ProjectGrid } from "@/components/projekte/project-grid";
import { getContentPage } from "@/lib/contentful/content-page";
import { getProjects } from "@/lib/contentful/projects";
import { notFound } from "next/navigation";

export default async function ProjektePage() {
  try {
    console.log('Fetching page content and projects...');
    const pageContent = await getContentPage('projekte');
    const projects = await getProjects();

    console.log('Page content and projects fetched:', {
      hasPageContent: !!pageContent,
      projectsCount: projects?.length || 0
    });

    if (!pageContent) {
      console.log('No page content found, returning 404');
      notFound();
    }

    return (
      <ProjektePageWrapper>
        <main className="min-h-screen bg-[#F5F5F5] pt-24">
          <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {pageContent.title || 'Projekte'}
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              {pageContent.description || 'Entdecken Sie meine Projekte'}
            </p>
            {projects && projects.length > 0 ? (
              <ProjectGrid projects={projects} />
            ) : (
              <p>Keine Projekte gefunden.</p>
            )}
          </div>
        </main>
      </ProjektePageWrapper>
    );
  } catch (error) {
    console.error('Error in ProjektePage:', error);
    notFound();
  }
}
