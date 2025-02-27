'use client';

import { Drawer } from "vaul";
import { ArrowUpRight, X } from "lucide-react";
import { Tag } from "@/components/shared/tag";
import type { Project } from "@/types/project";
import { VisuallyHidden } from "@/components/shared/visually-hidden";
import Image from 'next/image';

interface ProjectDrawerProps {
  project: Project & { tagColors?: Record<string, "purple" | "orange" | "blue" | "red" | "light-blue"> }
  isOpen: boolean
  onClose: () => void
}

export function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
  const { url: projectUrl, text: linkText } = project.projectUrl?.fields || {};

  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] md:rounded-t-[64px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50">
          {/* Close button positioned at the top right with consistent padding */}
          <div className="sticky top-0 right-0 z-10 flex justify-end p-4 md:p-6">
            <button
              onClick={onClose}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full shadow-sm transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
              <VisuallyHidden>Close</VisuallyHidden>
            </button>
          </div>
          
          <div className="p-4 md:p-6 bg-white rounded-t-[32px] md:rounded-t-[64px] flex-1 overflow-auto -mt-10">
            <div className="mx-auto w-full max-w-4xl">
              <div className="relative">
                <VisuallyHidden>
                  <Drawer.Title>{project.title}</Drawer.Title>
                </VisuallyHidden>

                {/* Title positioned below the close button with proper wrapping on mobile */}
                <h2 className="text-3xl font-semibold text-gray-900 mb-4 pr-12 md:pr-0">{project.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    {project.subtitleLeft && (
                      <h3 className="text-xl text-gray-600 mb-4">{project.subtitleLeft}</h3>
                    )}
                    <p className="text-gray-600 mb-6">{project.description}</p>
                    {projectUrl && (
                      <a 
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <span>{linkText || 'Zum Projekt'}</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                  </div>

                  {/* Right Column */}
                  <div>
                    {project.subtitleRight && (
                      <h3 className="text-xl text-gray-600 mb-4">{project.subtitleRight}</h3>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tag, index) => (
                        <Tag 
                          key={index} 
                          name={tag} 
                          color={project.tagColors?.[tag] || "blue"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {project.projectImage?.fields?.file?.url && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl mt-8">
                    <Image
                      src={`https:${project.projectImage.fields.file.url}`}
                      alt={project.projectImage.fields.title || project.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
