import { getAllArticles } from "@/lib/blog";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/ui/navbar";
import { Home, User, BookOpen, Briefcase } from "lucide-react";

// Navigation Items
const navItems = [
      {
        name: "Home",
        url: "/",
        icon: Home,
      },
      {
        name: "Über mich",
        url: "/uebermich",
        icon: User,
      },
      {
        name: "Blog",
        url: "/blog",
        icon: BookOpen,
      },
      {
        name: "Projekte",
        url: "/projekte",
        icon: Briefcase,
      },
];

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
                <div className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800 mb-3">
                  {article.categoryName}
                </div>
                <h3 className="text-2xl font-bold leading-tight text-gray-900 group-hover:text-gray-700 mb-4">
                  {article.title}
                </h3>
                <p className="text-gray-500 mb-2 text-sm">
                  {article.summary}
                </p>
                <p className="text-gray-600 mt-2 mb-2 text-sm font-bold">
                  Geschrieben von: {article.authorName}
                </p>
                <div className="flex justify-end">
                  <span className="inline-flex items-center justify-center text-sm font-medium text-blue-600 group-hover:text-blue-500">
                    Mehr lesen →
                  </span>
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
