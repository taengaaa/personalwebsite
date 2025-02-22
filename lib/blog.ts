/**
 * Blog-Funktionalitäten mit Contentful Integration
 * 
 * Diese Datei implementiert die Hauptfunktionalität für den Zugriff auf Blog-Artikel,
 * die in Contentful gespeichert sind. Sie stellt Funktionen bereit, um Artikel
 * abzurufen und zu verarbeiten.
 */

import { createClient } from 'contentful';
import { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } from "@/settings/contentful";
import { Document, BLOCKS } from '@contentful/rich-text-types';
import type { Entry, EntryFieldTypes, Asset, UnresolvedLink, EntrySkeletonType, AssetFields } from 'contentful';

/**
 * Initialisierung des Contentful Clients
 * Erstellt eine Verbindung zum Contentful CMS mit den konfigurierten Zugangsdaten
 */
const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

/**
 * Interface für MetaData-Felder
 * Definiert die Struktur von MetaData-Feldern wie sie von Contentful empfangen werden
 */
interface MetaDataFields {
  internalName: EntryFieldTypes.Symbol;
  metaTitle: EntryFieldTypes.Symbol;
  metaDescription: EntryFieldTypes.Text;
  index?: EntryFieldTypes.Boolean;
  robots?: EntryFieldTypes.Boolean;
}

/**
 * Interface für MetaData-Skeleton
 * Definiert die Struktur von MetaData-Einträgen wie sie von Contentful empfangen werden
 */
interface MetaDataSkeleton {
  contentTypeId: 'metaData';
  fields: MetaDataFields;
}

/**
 * Interface für einen Blog-Artikel
 * Definiert die Struktur eines Artikels wie er von Contentful empfangen wird
 */
interface Article {
  sys: {
    id: string;
  };
  internalName: string;
  metaData?: {
    title: string;
    description: string;
    index?: boolean;
    robots?: boolean;
  };
  title: string;
  slug: string;
  summary: string;
  details: {
    json: Document;
  };
  date: string;
  authorName: string;
  categoryName: string;
  articleImage?: {
    url: string;
    title?: string;
    description?: string;
  };
}

/**
 * Interface für KnowledgeArticle-Felder
 * Definiert die Struktur von KnowledgeArticle-Feldern wie sie von Contentful empfangen werden
 */
interface KnowledgeArticleFields {
  internalName: EntryFieldTypes.Symbol;
  metaData?: Entry<MetaDataSkeleton>;
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  summary: EntryFieldTypes.Text;
  details: EntryFieldTypes.RichText;
  date: EntryFieldTypes.Date;
  authorName: EntryFieldTypes.Symbol;
  categoryName: EntryFieldTypes.Symbol;
  articleImage?: EntryFieldTypes.AssetLink;
}

/**
 * Interface für KnowledgeArticle-Skeleton
 * Definiert die Struktur von KnowledgeArticle-Einträgen wie sie von Contentful empfangen werden
 */
interface KnowledgeArticleSkeleton {
  contentTypeId: 'knowledgeArticle';
  fields: KnowledgeArticleFields;
}

/**
 * Transformiert die Rohdaten von Contentful in ein strukturiertes Article-Objekt
 */
function transformArticle(item: Entry<KnowledgeArticleSkeleton>): Article {
  const { fields } = item;

  // Get image URL if it exists
  let articleImage;
  if (fields.articleImage && 'fields' in fields.articleImage) {
    const imageFields = fields.articleImage.fields as AssetFields;
    if (imageFields.file?.url) {
      articleImage = {
        url: imageFields.file.url,
        title: imageFields.title?.['en-US'] || imageFields.title || undefined,
        description: imageFields.description?.['en-US'] || imageFields.description || undefined,
      };
    }
  }

  // Get metadata if it exists
  const metaData = fields.metaData ? {
    title: fields.metaData.fields.metaTitle,
    description: fields.metaData.fields.metaDescription,
    index: fields.metaData.fields.index,
    robots: fields.metaData.fields.robots,
  } : undefined;

  return {
    sys: {
      id: item.sys.id
    },
    internalName: fields.internalName,
    metaData,
    title: fields.title,
    slug: fields.slug,
    summary: fields.summary,
    details: {
      json: fields.details as unknown as Document
    },
    date: fields.date,
    authorName: fields.authorName,
    categoryName: fields.categoryName,
    articleImage
  };
}

/**
 * Ruft alle Blog-Artikel von Contentful ab
 * 
 * @param limit - Maximale Anzahl der abzurufenden Artikel (Standard: 6)
 * @returns Ein Array von Article-Objekten, sortiert nach Datum (neueste zuerst)
 */
export async function getAllArticles(limit = 6): Promise<Article[]> {
  try {
    const response = await client.getEntries<KnowledgeArticleSkeleton>({
      content_type: 'knowledgeArticle',
      order: ['-fields.date'],
      limit,
      include: 2
    });

    return response.items
      .map(transformArticle)
      .filter(article => article.slug && article.title);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

/**
 * Ruft einen Blog-Artikel anhand seines Slugs von Contentful ab
 * 
 * @param slug - URL-freundlicher Identifier des Artikels
 * @returns Ein Artikel-Objekt oder null, wenn kein Artikel gefunden wurde
 */
export async function getArticle(slug: string): Promise<Article | null> {
  try {
    const response = await client.getEntries<KnowledgeArticleSkeleton>({
      content_type: 'knowledgeArticle',
      'fields.slug': slug,
      include: 2,
      limit: 1
    });

    if (!response.items.length) {
      return null;
    }

    return transformArticle(response.items[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}