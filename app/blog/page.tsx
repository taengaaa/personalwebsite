import { getAllArticles } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Tag } from "@/components/tag";

export default async function BlogPage() {
  const articles = await getAllArticles(6);

  return (
    <>
    <NavBar />
    <main className="container mx-auto px-4 pt-16 pb-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.sys.id} href={`/blog/${article.slug}`} className="block group">
            <article className="flex flex-col h-full rounded-lg shadow-lg overflow-hidden bg-white transition-shadow hover:shadow-xl">
              {article.articleImage?.url && (
                <Image
                  alt={article.title}
                  className="aspect-[4/3] object-cover w-full"
                  height={263}
                  src={`https:${article.articleImage.url}`}
                  width={350}
                />
              )}
              <div className="flex-1 p-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  <Tag name={article.categoryName} color="blue" />
                </div>
                <h3 className="text-2xl font-bold leading-tight text-gray-900 group-hover:text-gray-700 mb-4">
                  {article.title}
                </h3>
                <p className="text-gray-500 mb-2 text-sm">
                  {article.summary}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
    </>
  );
}
