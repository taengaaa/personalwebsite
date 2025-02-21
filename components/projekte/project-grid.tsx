import { ProjectCard } from "./project-card"
import type { Project } from "@/types/project"
import { getProjects, defaultTagColors } from "@/lib/contentful/projects"

interface ProjectGridProps {
  projects?: Project[]
}

export async function ProjectGrid({ projects }: ProjectGridProps) {
  // If projects are not passed as props, fetch them from Contentful
  const projectsToRender = projects || await getProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projectsToRender.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          gradientColor={index % 2 === 0 ? "orange" : "blue"}
          uiConfig={{
            tagColors: defaultTagColors
          }}
        />
      ))}
    </div>
  )
}
