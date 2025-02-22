import type { Metadata } from "next";
import { getAllArticles } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/shared/navbar";
import { Tag } from "@/components/shared/tag";
import { getContentPage } from "@/lib/contentful/content-page";

export async function generateMetadata(): Promise<Metadata> {
  const contentPage = await getContentPage('blog');
  
  if (!contentPage) {
    return {
      title: 'Blog',
      description: 'Blog articles and insights',
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

export default async function BlogPage() {
  const articles = await getAllArticles(6);
  const contentPage = await getContentPage('blog');

  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-7xl mx-auto py-12">
          {contentPage ? (
            <>
              {contentPage.title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
                  {contentPage.title}
                </h1>
              )}
              {contentPage.description && (
                <p className="text-xl text-muted-foreground mb-12">
                  {contentPage.description}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
              Blog
            </h1>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link 
                key={article.sys.id} 
                href={`/blog/${article.slug}`} 
                className="block group"
              >
                <article className="flex flex-col h-full rounded-lg shadow-lg overflow-hidden bg-white dark:bg-neutral-800 transition-shadow hover:shadow-xl">
                  {article.articleImage?.url && (
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        alt={article.articleImage.title || article.title || 'Blog article image'}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        src={article.articleImage.url.startsWith('//') ? `https:${article.articleImage.url}` : article.articleImage.url}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Tag name={article.categoryName} color="blue" />
                    </div>
                    <h3 className="text-2xl font-bold leading-tight text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 mb-3">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm line-clamp-3">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
                      <time dateTime={article.date}>
                        {new Date(article.date).toLocaleDateString('de-CH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="mx-2">·</span>
                      <span>{article.authorName}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
