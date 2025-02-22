import type { Metadata } from "next";
import { NavBar } from "@/components/shared/navbar";
import { Timeline } from "@/components/uebermich/timeline";
import { getContentPage } from "@/lib/contentful/content-page";
import { getProjects } from "@/lib/contentful/projects";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES, Node } from '@contentful/rich-text-types';
import Image from "next/image";

export async function generateMetadata(): Promise<Metadata> {
  const contentPage = await getContentPage('ueber-mich');
  
  if (!contentPage) {
    return {
      title: 'Über mich',
      description: 'About Simon Affentranger',
    };
  }

  return {
    title: contentPage.metaData.title,
    description: contentPage.metaData.description,
    robots: {
      index: contentPage.metaData.index ?? true,
      follow: contentPage.metaData.robots ?? true,
    },
  };
}

export default async function UeberMichPage() {
  // First test if we can get projects to verify Contentful connection
  const projects = await getProjects();
  console.log('Projects found:', projects.length);

  const contentPage = await getContentPage('ueber-mich');
  console.log('Content page found:', contentPage ? 'yes' : 'no');

  if (!contentPage) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-900">
        <NavBar activePage="Über mich" />
        <main className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
              Content not found
            </h1>
            <p className="text-xl text-muted-foreground mb-12">
              Projects found: {projects.length} (testing Contentful connection)
            </p>
            <p className="text-muted-foreground">
              Please make sure you have created a content page in Contentful with the slug &quot;ueber-mich&quot;.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const richTextOptions = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => (
        <p className="text-lg text-neutral-600 dark:text-neutral-400">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => (
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => (
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: Node, children: React.ReactNode) => (
        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (node: Node, children: React.ReactNode) => (
        <ul className="list-disc pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: Node, children: React.ReactNode) => (
        <ol className="list-decimal pl-6 space-y-2 text-neutral-600 dark:text-neutral-400">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: Node, children: React.ReactNode) => (
        <li className="text-lg pl-1">{children}</li>
      ),
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          {children}
        </a>
      ),
    },
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => (
        <span className="underline">{text}</span>
      ),
    },
  };

  const timelineItems = contentPage.sections?.map(section => ({
    title: (
      <span className="text-4xl font-semibold text-neutral-900 dark:text-neutral-100 font-geist">
        {section.year}
      </span>
    ),
    content: (
      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 font-geist">
          {section.heading}
        </h3>
        <div className="prose prose-lg prose-neutral dark:prose-invert max-w-none">
          {documentToReactComponents(section.description, richTextOptions)}
        </div>
        {section.images && section.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {section.images.map((image, index) => {
              console.log('Rendering image:', {
                sectionHeading: section.heading,
                imageIndex: index,
                imageUrl: image.url,
                imageTitle: image.title,
                dimensions: image.width && image.height ? `${image.width}x${image.height}` : 'no dimensions'
              });

              // Ensure the URL starts with https:
              const imageUrl = image.url.startsWith('//') ? `https:${image.url}` : image.url;
              console.log('Final image URL:', imageUrl);
              
              return (
                <div 
                  key={index} 
                  className="relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg group"
                >
                  <Image
                    src={imageUrl}
                    alt={image.title || `${section.heading} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    ),
  })) || [];

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      <NavBar activePage="Über mich" />
      <main className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {contentPage.title && (
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
              {contentPage.title}
            </h1>
          )}
          {contentPage.description && (
            <p className="text-xl text-muted-foreground mb-12">
              {contentPage.description}
            </p>
          )}
          {contentPage.sections && contentPage.sections.length > 0 && (
            <Timeline items={timelineItems} />
          )}
        </div>
      </main>
    </div>
  );
}
