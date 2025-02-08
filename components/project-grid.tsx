import { ProjectCard } from "./project-card"
import type { Project } from "../types/project"

const DEMO_PROJECTS: Project[] = [
  {
    id: "nibble",
    title: "Nibble",
    subtitle: "AI Driven Delivery App",
    tags: [
      { name: "App Design", color: "purple" },
      { name: "Branding", color: "orange" },
      { name: "Marketing Materials", color: "blue" },
    ],
    additionalTags: 1,
    image: "/re-kochbuch.png",
    url: "https://re-kochbuch.vercel.app/docs/einfuehrung"
  },
  {
    id: "pont",
    title: "Pont",
    subtitle: "Healthcare Technology Platform",
    tags: [
      { name: "Website Design", color: "blue" },
      { name: "Product Design", color: "red" },
      { name: "Development", color: "light-blue" },
    ],
    additionalTags: 3,
    image: "/re-kochbuch.png",
    url: "https://re-kochbuch.vercel.app/docs/einfuehrung"
  },
  {
    id: "nibble-2",
    title: "Nibble Mobile",
    subtitle: "Food Delivery Mobile App",
    tags: [
      { name: "App Design", color: "purple" },
      { name: "UI/UX", color: "orange" },
      { name: "Mobile Development", color: "blue" },
    ],
    additionalTags: 2,
    image: "/re-kochbuch.png",
    url: "https://re-kochbuch.vercel.app/docs/einfuehrung"
  },
  {
    id: "pont-2",
    title: "Pont Analytics",
    subtitle: "Healthcare Data Platform",
    tags: [
      { name: "Data Visualization", color: "blue" },
      { name: "Dashboard Design", color: "red" },
      { name: "Analytics", color: "light-blue" },
    ],
    additionalTags: 1,
    image: "/re-kochbuch.png",
    url: "https://re-kochbuch.vercel.app/docs/einfuehrung"
  },
]

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {DEMO_PROJECTS.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          gradientColor={project.id.startsWith("nibble") ? "orange" : "blue"}
        />
      ))}
    </div>
  )
}
