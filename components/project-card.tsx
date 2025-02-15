'use client';

import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useMemo, useState } from "react"
import type { Project, ProjectWithUI } from "../types/project"
import { Tag } from "./tag"
import { ProjectDrawer } from "./project-drawer"

type TagColor = "purple" | "orange" | "blue" | "red" | "light-blue";

interface ProjectCardProps {
  project: Project
  uiConfig?: Partial<ProjectWithUI>
  gradientColor: "orange" | "blue"
}

// Funktion zum Generieren eines deterministischen Index basierend auf dem String
function getHashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// Funktion zum Zuweisen von Farben basierend auf dem Tag-Namen
function assignTagColors(tags: string[], availableColors: TagColor[]): Record<string, TagColor> {
  const colorMap: Record<string, TagColor> = {};
  const usedColors = new Set<TagColor>();
  
  // Erste Runde: Versuche einzigartige Farben zuzuweisen
  tags.forEach(tag => {
    const hashCode = getHashCode(tag);
    const colorIndex = hashCode % availableColors.length;
    const color = availableColors[colorIndex];
    
    if (!usedColors.has(color)) {
      colorMap[tag] = color;
      usedColors.add(color);
    }
  });
  
  // Zweite Runde: Weise verbleibenden Tags eine Farbe zu
  tags.forEach(tag => {
    if (!colorMap[tag]) {
      const remainingColors = availableColors.filter(color => !usedColors.has(color));
      if (remainingColors.length > 0) {
        const hashCode = getHashCode(tag);
        const colorIndex = hashCode % remainingColors.length;
        const color = remainingColors[colorIndex];
        colorMap[tag] = color;
        usedColors.add(color);
      } else {
        // Wenn keine einzigartigen Farben mehr verfügbar sind, verwende den Hash für eine deterministische Auswahl
        const hashCode = getHashCode(tag);
        colorMap[tag] = availableColors[hashCode % availableColors.length];
      }
    }
  });
  
  return colorMap;
}

export function ProjectCard({ project, uiConfig, gradientColor }: ProjectCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Available tag colors
  const tagColors: TagColor[] = ["purple", "orange", "blue", "red", "light-blue"];

  // Generate deterministic colors for tags
  const tagColorMap = useMemo(() => 
    assignTagColors(project.tags || [], tagColors),
    [project.tags]
  );

  // Get the image URL and project URL
  const imageUrl = project.projectImage?.fields?.file?.url;
  const { url: projectUrl, text: linkText } = project.projectUrl?.fields || {};

  return (
    <>
      <div 
        className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
        onClick={() => setIsDrawerOpen(true)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">{project.title}</h2>
            </div>
            <div 
              className="text-gray-400 flex items-center gap-1.5 group px-3 py-1.5"
            >
              <span className="text-base font-medium group-hover:text-gray-900 transition-colors">Zum Projekt</span>
              <ArrowUpRight className="h-5 w-5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform group-hover:text-gray-900" />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags?.map((tag, index) => (
              <Tag 
                key={index} 
                name={tag} 
                color={tagColorMap[tag]} 
              />
            ))}
            {uiConfig?.additionalTags && uiConfig.additionalTags > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                +{uiConfig.additionalTags}
              </span>
            )}
          </div>

          {imageUrl && (
            <div className="relative">
              <div
                className={`absolute inset-0 z-10 ${
                  gradientColor === "orange"
                    ? "bg-gradient-to-t from-orange-400/40 via-orange-400/10 to-transparent"
                    : "bg-gradient-to-t from-blue-400/40 via-blue-400/10 to-transparent"
                } rounded-xl`}
              />
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={`https:${imageUrl}`}
                  alt={project.projectImage?.fields?.title || project.title}
                  fill
                  className="object-cover rounded-xl"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={{
          ...project,
          tagColors: tagColorMap
        }}
      />
    </>
  );
}
