import { createClient } from 'contentful';
import { CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_SPACE_ID } from "@/settings/contentful";
import { ICard, ICardsSection } from '@/types/contentful';
import { Entry } from 'contentful';

const client = createClient({
  space: CONTENTFUL_SPACE_ID,
  accessToken: CONTENTFUL_ACCESS_TOKEN,
});

export function transformCard(item: Entry<ICard>) {
  const { fields } = item;
  
  // Get the image URL if it exists and is resolved
  const imageUrl = fields.image && 'fields' in fields.image 
    ? `https:${fields.image.fields.file?.url || ''}`
    : '';
  
  return {
    category: String(fields.category || ''),
    title: String(fields.title || ''),
    src: imageUrl,
    content: String(fields.description || ''),
  };
}

export async function getCardsSection(): Promise<{
  title: string;
  cards: ReturnType<typeof transformCard>[];
} | null> {
  try {
    const response = await client.getEntries<ICardsSection>({
      content_type: 'cardsSection',
      limit: 1,
      include: 2,
    });

    if (!response.items.length) {
      return null;
    }

    const section = response.items[0];
    const cards = section.fields.cards.map((cardLink) => {
      if (!cardLink?.fields) {
        console.error('Card link fields are missing:', cardLink);
        return null;
      }
      return transformCard(cardLink as Entry<ICard>);
    }).filter((card): card is NonNullable<typeof card> => card !== null);

    return {
      title: section.fields.title || 'Meine Expertise im Überblick',
      cards,
    };
  } catch (error) {
    console.error('Error fetching cards section:', error);
    return null;
  }
}
