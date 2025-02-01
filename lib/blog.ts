/**
 * Blog-Funktionalitäten mit Contentful Integration
 * 
 * Diese Datei implementiert die Hauptfunktionalität für den Zugriff auf Blog-Artikel,
 * die in Contentful gespeichert sind. Sie stellt Funktionen bereit, um Artikel
 * abzurufen und zu verarbeiten.
 */

import { createClient } from 'contentful';
import { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } from "@/settings/contentful";

/**
 * Initialisierung des Contentful Clients
 * Erstellt eine Verbindung zum Contentful CMS mit den konfigurierten Zugangsdaten
 */
const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

/**
 * Interface für Rich-Text-Inhalt
 * Definiert die Struktur von Rich-Text-Inhalten wie sie von Contentful empfangen werden
 */
interface RichText {
  json: {
    nodeType: string;
    content: Array<{
      nodeType: string;
      content: Array<{
        nodeType: string;
        value: string;
      }>;
    }>;
  };
}

/**
 * Interface für einen Blog-Artikel
 * Definiert die Struktur eines Artikels wie er von Contentful empfangen wird
 * 
 * @property sys.id - Eindeutige ID des Artikels in Contentful
 * @property title - Titel des Artikels
 * @property slug - URL-freundlicher Identifier des Artikels
 * @property summary - Kurze Zusammenfassung des Artikels
 * @property details - Hauptinhalt des Artikels im Rich-Text-Format
 * @property date - Veröffentlichungsdatum
 * @property authorName - Name des Autors
 * @property categoryName - Kategorie des Artikels
 * @property articleImage - Hauptbild des Artikels mit URL
 */
interface Article {
  sys: {
    id: string;
  };
  title: string;
  slug: string;
  summary: string;
  details: RichText;
  date: string;
  authorName: string;
  categoryName: string;
  articleImage: {
    url: string;
  };
}

/**
 * Transformiert die Rohdaten von Contentful in ein strukturiertes Article-Objekt
 * 
 * @param item - Rohdaten eines Artikels von Contentful
 * @returns Ein formatiertes Article-Objekt
 */
function transformArticle(item: {
  sys: { id: string };
  fields: {
    title: string;
    slug: string;
    summary: string;
    details: RichText;
    date: string;
    authorName: string;
    categoryName: string;
    articleImage?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
  };
}): Article {
  return {
    sys: { id: item.sys.id },
    title: item.fields.title,
    slug: item.fields.slug,
    summary: item.fields.summary,
    details: {
      json: item.fields.details.json
    },
    date: item.fields.date,
    authorName: item.fields.authorName,
    categoryName: item.fields.categoryName,
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
  const response = await client.getEntries({
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
  const response = await client.getEntries({
    content_type: 'knowledgeArticle',
    'fields.slug': slug,
    limit: 1,
  });

  return response.items.length > 0 ? transformArticle(response.items[0]) : null;
}