'use client';

import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import type { Project } from "../types/project"
import { Tag } from "./tag"
import { ProjectDrawer } from "./project-drawer"

interface ProjectCardProps {
  project: Project
  gradientColor: "orange" | "blue"
}

export function ProjectCard({ project, gradientColor }: ProjectCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <div 
        className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">{project.title}</h2>
              <p className="text-gray-600">{project.subtitle}</p>
            </div>
            <div className="text-gray-400 hover:text-gray-900 transition-colors flex items-center gap-1 group">
              <span className="text-sm">Details</span>
              <ArrowUpRight className="h-4 w-4" />
            </div>
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
                  ? "bg-gradient-to-t from-orange-400/40 via-orange-400/10 to-transparent"
                  : "bg-gradient-to-t from-blue-400/40 via-blue-400/10 to-transparent"
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

      <ProjectDrawer 
        project={project}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
