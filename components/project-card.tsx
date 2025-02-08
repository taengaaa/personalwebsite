import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Project } from "../types/project"
import { Tag } from "./tag"

interface ProjectCardProps {
  project: Project
  gradientColor: "orange" | "blue"
}

export function ProjectCard({ project, gradientColor }: ProjectCardProps) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{project.title}</h2>
            <p className="text-gray-600">{project.subtitle}</p>
          </div>
          <Link
            href={`/project/${project.id}`}
            className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 group"
          >
            <span className="text-sm">View Project</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, index) => (
            <Tag key={index} name={tag.name} color={tag.color} />
          ))}
          {project.additionalTags > 0 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
              +{project.additionalTags}
            </span>
          )}
        </div>

        <div className="relative">
          <div
            className={`absolute inset-0 z-10 ${
              gradientColor === "orange"
                ? "bg-[radial-gradient(circle_at_center_bottom,rgba(251,146,60,0.4)_0%,rgba(251,146,60,0.1)_50%,transparent_100%)]"
                : "bg-[radial-gradient(circle_at_center_bottom,rgba(96,165,250,0.4)_0%,rgba(96,165,250,0.1)_50%,transparent_100%)]"
            }`}
          />
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

