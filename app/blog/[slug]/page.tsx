import { getAllArticles, getArticle } from "@/lib/blog";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS } from "@contentful/rich-text-types";
import { Block, Inline } from '@contentful/rich-text-types';
import Image from "next/image";
import Link from "next/link"; 
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Rich Text Rendering Optionen
const options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-gray-100 rounded px-1">{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: React.ReactNode) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
    [BLOCKS.HEADING_1]: (node: Block | Inline, children: React.ReactNode) => (
      <h1 className="text-4xl font-bold mb-6 text-gray-900">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: Block | Inline, children: React.ReactNode) => (
      <h2 className="text-3xl font-bold mb-4 text-gray-900 mt-8">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: Block | Inline, children: React.ReactNode) => (
      <h3 className="text-2xl font-bold mb-3 text-gray-900 mt-6">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (node: Block | Inline, children: React.ReactNode) => (
      <ul className="list-disc pl-6 mb-4 text-gray-700">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: Block | Inline, children: React.ReactNode) => (
      <ol className="list-decimal pl-6 mb-4 text-gray-700">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: Block | Inline, children: React.ReactNode) => <li className="mb-2">{children}</li>,
    [BLOCKS.QUOTE]: (node: Block | Inline, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4 text-gray-600">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-t border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
      const { title, description, file } = node.data.target.fields;
      const imageUrl = file.url;
      return (
        <div className="my-8">
          <Image
            src={`https:${imageUrl}`}
            alt={description || title || 'Embedded Asset'}
            width={file.details.image.width}
            height={file.details.image.height}
            className="rounded-lg"
          />
        </div>
      );
    },
  },
};

export async function generateStaticParams() {
  const allArticles = await getAllArticles();
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogArticlePage({ params }: any) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/blog" 
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
          <span>Zurück zum Blog</span>
        </Link>

        <article className="mb-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{article.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span className="font-medium">By {article.authorName}</span>
              <span>•</span>
              <span>{new Date(article.date).toLocaleDateString()}</span>
              <span>•</span>
              <span className="font-medium">{article.categoryName}</span>
            </div>
          </header>

          {article.articleImage?.url && (
            <div className="mb-8">
              <Image
                alt={article.title}
                className="w-full rounded-lg shadow-md"
                height={400}
                src={`https:${article.articleImage.url}`}
                width={800}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {documentToReactComponents(article.details.json, options)}
          </div>
        </article>
      </div>
    </main>
  );
}
