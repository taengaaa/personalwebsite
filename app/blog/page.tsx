import { getAllArticles } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Home, User, BookOpen, Briefcase } from "lucide-react";

export default async function BlogPage() {
  const articles = await getAllArticles(6);

  return (
    <>
    <NavBar activePage="Blog" />
    <main className="container mx-auto px-4 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        <span>Zurück zu Home</span>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.sys.id} href={`/blog/${article.slug}`} className="block group">
            <article className="flex flex-col h-full rounded-xl overflow-hidden bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
              {article.articleImage?.url && (
                <div className="relative">
                  <Image
                    alt={article.title}
                    className="aspect-[16/10] object-cover w-full"
                    height={240}
                    src={`https:${article.articleImage.url}`}
                    width={400}
                  />
                </div>
              )}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
                    {article.categoryName}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.summary}
                </p>
                <div className="mt-auto">
                  <span className="text-sm text-gray-500">
                    Von {article.authorName}
                  </span>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-500">
                      Jetzt lesen →
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </main>
    </>
  );
}
