/**
 * Blog-Funktionalitäten mit Contentful Integration
 * 
 * Diese Datei implementiert die Hauptfunktionalität für den Zugriff auf Blog-Artikel,
 * die in Contentful gespeichert sind. Sie stellt Funktionen bereit, um Artikel
 * abzurufen und zu verarbeiten.
 */

import { createClient } from 'contentful';
import { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } from "@/settings/contentful";
import { Document } from '@contentful/rich-text-types';
import type { Entry, EntryFieldTypes, EntrySkeletonType } from 'contentful';

/**
 * Initialisierung des Contentful Clients
 * Erstellt eine Verbindung zum Contentful CMS mit den konfigurierten Zugangsdaten
 */
const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

/**
 * Interface für einen Blog-Artikel
 * Definiert die Struktur eines Artikels wie er von Contentful empfangen wird
 */
interface Article {
  sys: {
    id: string;
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
  articleImage: {
    url: string;
  };
}

interface IKnowledgeArticleFields {
  title: EntryFieldTypes.Text;
  slug: EntryFieldTypes.Text;
  summary: EntryFieldTypes.Text;
  details: EntryFieldTypes.RichText;
  date: EntryFieldTypes.Date;
  authorName: EntryFieldTypes.Text;
  categoryName: EntryFieldTypes.Text;
  articleImage: EntryFieldTypes.AssetLink;
}

interface IKnowledgeArticle extends EntrySkeletonType {
  contentTypeId: 'knowledgeArticle'
  fields: IKnowledgeArticleFields
}

/**
 * Transformiert die Rohdaten von Contentful in ein strukturiertes Article-Objekt
 */
function transformArticle(item: Entry<IKnowledgeArticle>): Article {
  const getLocalizedField = (field: any): string => {
    if (typeof field === 'object' && field !== null) {
      return field['en-US'] || '';
    }
    return field || '';
  };

  return {
    sys: { id: item.sys.id },
    title: getLocalizedField(item.fields.title),
    slug: getLocalizedField(item.fields.slug),
    summary: getLocalizedField(item.fields.summary),
    details: {
      json: item.fields.details
    },
    date: getLocalizedField(item.fields.date),
    authorName: getLocalizedField(item.fields.authorName),
    categoryName: getLocalizedField(item.fields.categoryName),
    articleImage: {
      url: item.fields.articleImage?.fields?.file?.url || ''
    }
  };
}

/**
 * Ruft alle Blog-Artikel von Contentful ab
 * 
 * @param limit - Maximale Anzahl der abzurufenden Artikel (Standard: 6)
 * @returns Ein Array von Article-Objekten, sortiert nach Datum (neueste zuerst)
 */
export async function getAllArticles(limit = 6): Promise<Article[]> {
  const response = await client.getEntries<IKnowledgeArticle>({
    content_type: 'knowledgeArticle',
    limit,
    order: ['-fields.date'] as const,
  });

  return response.items.map(transformArticle);
}

/**
 * Ruft einen Blog-Artikel anhand seines Slugs von Contentful ab
 * 
 * @param slug - URL-freundlicher Identifier des Artikels
 * @returns Ein Artikel-Objekt oder null, wenn kein Artikel gefunden wurde
 */
export async function getArticle(slug: string): Promise<Article | null> {
  const response = await client.getEntries<IKnowledgeArticle>({
    content_type: 'knowledgeArticle',
    'fields.slug': slug,
    limit: 1,
  });

  return response.items.length > 0 ? transformArticle(response.items[0]) : null;
}