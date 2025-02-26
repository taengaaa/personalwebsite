import type { Metadata } from "next";
import { NavBar } from "@/components/shared/navbar";
import { Timeline, type TimelineEntry } from "@/components/uebermich/timeline";
import { getContentPage } from "@/lib/contentful/content-page";
import { getProjects } from "@/lib/contentful/projects";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES, Node } from '@contentful/rich-text-types';
import Image from "next/image";

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

export async function generateMetadata(): Promise<Metadata> {
  const contentPage = await getContentPage('ueber-mich');
  
  if (!contentPage) {
    return {
      title: 'Über mich',
      description: 'Über mich Seite',
    };
  }

  return {
    title: contentPage.metaData.title || 'Über mich',
    description: contentPage.metaData.description || 'Über mich Seite',
    robots: {
      index: contentPage.metaData.index,
      follow: contentPage.metaData.robots,
    },
  };
}

export default async function UeberMichPage() {
  // First test if we can get projects to verify Contentful connection
  const projects = await getProjects();
  console.log('Projects found:', projects.length);

  console.log('Fetching content page...');
  const contentPage = await getContentPage('ueber-mich');
  console.log('Content page result:', {
    found: contentPage ? 'yes' : 'no',
    title: contentPage?.title,
    sectionsCount: contentPage?.sections?.length ?? 0,
    sections: contentPage?.sections?.map(s => ({
      year: s.year,
      heading: s.heading,
      imagesCount: s.images?.length ?? 0
    }))
  });

  if (!contentPage || !contentPage.sections || !Array.isArray(contentPage.sections)) {
    console.log('Content page validation failed:', {
      hasContentPage: !!contentPage,
      hasSections: !!contentPage?.sections,
      isArray: Array.isArray(contentPage?.sections)
    });
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
              Please make sure you have created a content page in Contentful with the slug &quot;ueber-mich&quot; and it has sections.
            </p>
          </div>
        </main>
      </div>
    );
  }

  console.log('Creating timeline items...');
  const timelineItems: TimelineEntry[] = contentPage.sections.map(section => {
    if (!section) {
      console.log('Found null section');
      return {
        title: <span>Fehlender Eintrag</span>,
        content: <div>Keine Daten vorhanden</div>
      };
    }
    
    console.log('Processing section:', {
      year: section.year,
      heading: section.heading,
      hasDescription: !!section.description,
      imagesCount: section.images?.length ?? 0
    });

    const item: TimelineEntry = {
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
                if (!image || !image.url) {
                  console.log('Invalid image in section:', {
                    sectionYear: section.year,
                    imageIndex: index,
                    hasImage: !!image,
                    hasUrl: image?.url
                  });
                  return null;
                }

                const imageUrl = image.url.startsWith('//') ? `https:${image.url}` : image.url;
                console.log('Processing image:', {
                  sectionYear: section.year,
                  imageIndex: index,
                  imageUrl,
                  imageTitle: image.title,
                  dimensions: image.width && image.height ? `${image.width}x${image.height}` : 'no dimensions'
                });
                
                return (
                  <div 
                    key={`${section.year}-${index}`}
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
              }).filter(Boolean)}
            </div>
          )}
        </div>
      )
    };

    return item;
  }).filter(Boolean) as TimelineEntry[];

  console.log('Finished timeline items:', timelineItems.length);

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
          {timelineItems.length === 0 ? (
            <p className="text-muted-foreground">No timeline items found.</p>
          ) : (
            <Timeline items={timelineItems} />
          )}
        </div>
      </main>
    </div>
  );
}
