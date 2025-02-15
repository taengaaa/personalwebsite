import { ProjectGrid } from "@/components/project-grid"

export default async function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Projects
          </h1>
          <p className="text-xl text-gray-600">
            A collection of my recent work and projects, showcasing my skills in design, development, and problem-solving.
          </p>
        </div>
        <ProjectGrid />
      </div>
    </div>
  )
}
