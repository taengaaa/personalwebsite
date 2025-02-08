'use client';

import { Drawer } from 'vaul';
import Image from 'next/image';
import { ArrowUpRight, X } from 'lucide-react';
import Link from 'next/link';
import type { Project } from '../types/project';
import { Tag } from './tag';

interface ProjectDrawerProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDrawer({ project, isOpen, onClose }: ProjectDrawerProps) {
  return (
    <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-white flex flex-col rounded-t-[32px] md:rounded-t-[64px] h-[96vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
          <div className="p-4 bg-white rounded-t-[32px] md:rounded-t-[64px] flex-1 overflow-auto relative">
            {/* Close button positioned absolutely in top-right corner */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 bg-gray-100/80 hover:bg-gray-200/80 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mx-auto max-w-4xl space-y-8">
              <div className="flex items-center justify-start pt-4">
                <Drawer.Title className="text-2xl font-semibold">{project.title}</Drawer.Title>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Left column - Project information */}
                <div className="space-y-6">
                  <p className="text-gray-600">{project.subtitle}</p>

                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Über das Projekt</h3>
                    <p className="text-gray-600">
                      {project.description || "Detailed description of the project will go here. You can expand this section with more details about the project, technologies used, challenges faced, and outcomes."}
                    </p>
                  </div>

                  {project.url && (
                    <div>
                      <Link
                        href={project.url}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Zum Projekt
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right column - Tags */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Technologien & Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Tag key={index} name={tag.name} color={tag.color} />
                    ))}
                    {project.additionalTags > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        +{project.additionalTags}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Full width image below the grid */}
              <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
