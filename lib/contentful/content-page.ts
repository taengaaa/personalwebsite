import { createClient, Entry, Asset, EntryFieldTypes } from 'contentful';
import { Document } from '@contentful/rich-text-types';

interface AssetFile {
  url: string;
  details: {
    size: number;
    image?: {
      width: number;
      height: number;
    };
  };
  fileName: string;
  contentType: string;
}

interface AssetFields {
  title?: { [key: string]: string };
  description?: { [key: string]: string };
  file: AssetFile;
}

interface AssetSys {
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaWrapperFields {
  internalName?: string;
  title?: string;
  description?: string;
  image: Asset;
}

interface MediaWrapperSkeleton {
  contentTypeId: 'mediaWrapper';
  fields: MediaWrapperFields;
}

interface TimelineSectionFields {
  internalName?: EntryFieldTypes.Symbol;
  year: EntryFieldTypes.Symbol;
  heading: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.RichText;
  images?: Entry<MediaWrapperSkeleton>[];
}

interface TimelineSectionSkeleton {
  contentTypeId: 'timelineSection';
  fields: TimelineSectionFields;
}

interface ContentPageFields {
  internalName: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
  sections?: Entry<TimelineSectionSkeleton>[];
}

interface ContentPageSkeleton {
  contentTypeId: 'contentPage';
  fields: ContentPageFields;
}

export interface TimelineSection {
  internalName?: string;
  year: string;
  heading: string;
  description: Document;
  images?: {
    url: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
  }[];
}

export interface ContentPage {
  internalName: string;
  slug: string;
  title: string;
  description: string;
  sections?: TimelineSection[];
}

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: 'master',
});

const transformAsset = (
  mediaWrapper: Entry<MediaWrapperSkeleton> | undefined
): { url: string; title?: string; description?: string; width?: number; height?: number } | undefined => {
  if (!mediaWrapper?.fields) {
    console.log('No media wrapper or fields found');
    return undefined;
  }

  const image = mediaWrapper.fields.image as unknown as Asset & { sys: AssetSys };
  if (!image?.fields) {
    console.log('No image fields found in wrapper');
    return undefined;
  }

  const fields = image.fields as unknown as AssetFields;
  const file = fields.file;
  if (!file) {
    console.log('No file found in image');
    return undefined;
  }

  if (!image.sys?.id) {
    console.log('No image sys id found');
    return undefined;
  }

  const imageTitle = fields.title?.en;
  const imageDescription = fields.description?.en;
  const wrapperTitle = String(mediaWrapper.fields.title || '');
  const wrapperDescription = String(mediaWrapper.fields.description || '');

  console.log('Processing image:', {
    mediaWrapperId: mediaWrapper.sys.id,
    imageId: image.sys.id,
    url: file.url,
    title: wrapperTitle || imageTitle,
    description: wrapperDescription || imageDescription,
    dimensions: file.details?.image ? `${file.details.image.width}x${file.details.image.height}` : 'no dimensions'
  });

  return {
    url: file.url.startsWith('//') ? `https:${file.url}` : file.url,
    title: wrapperTitle || imageTitle || undefined,
    description: wrapperDescription || imageDescription || undefined,
    width: file.details?.image?.width,
    height: file.details?.image?.height,
  };
}

export async function getContentPage(slug: string): Promise<ContentPage | null> {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.error('Contentful environment variables are not set');
    return null;
  }

  try {
    console.log('Fetching content page from Contentful...', { slug });
    const entries = await client.getEntries<ContentPageSkeleton>({
      content_type: 'contentPage',
      'fields.slug[match]': slug,
      include: 3,
    });

    console.log('Contentful response:', {
      total: entries.total,
      items: entries.items.map(item => ({
        id: item.sys.id,
        internalName: item.fields.internalName,
        slug: item.fields.slug
      }))
    });

    if (!entries.items.length) {
      console.log('No content found for slug:', slug);
      return null;
    }

    const page = entries.items[0];
    
    const sections = page.fields.sections?.map((section: Entry<TimelineSectionSkeleton>) => {
      console.log('Processing section:', {
        id: section.sys.id,
        heading: section.fields.heading,
        imagesCount: section.fields.images?.length || 0
      });

      const processedImages = section.fields.images?.map(transformAsset).filter((img): img is NonNullable<typeof img> => {
        if (!img) {
          console.log('Image was filtered out due to transformation failure');
          return false;
        }
        return true;
      });

      console.log('Processed images for section:', {
        heading: section.fields.heading,
        originalCount: section.fields.images?.length || 0,
        processedCount: processedImages?.length || 0,
        urls: processedImages?.map(img => img.url)
      });

      return {
        internalName: section.fields.internalName,
        year: section.fields.year,
        heading: section.fields.heading,
        description: section.fields.description,
        images: processedImages,
      };
    }) || [];

    const contentPage = {
      internalName: page.fields.internalName,
      slug: page.fields.slug,
      title: page.fields.title,
      description: page.fields.description,
      sections: sections,
    };

    console.log('Transformed content page sections:', contentPage.sections?.map(section => ({
      heading: section.heading,
      imagesCount: section.images?.length || 0,
      imageUrls: section.images?.map(img => img.url)
    })));

    return contentPage;
  } catch (error) {
    console.error('Error fetching content page:', error);
    return null;
  }
}
