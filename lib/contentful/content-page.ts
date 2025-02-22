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

interface MetaDataFields {
  internalName: EntryFieldTypes.Symbol;
  metaTitle: EntryFieldTypes.Symbol;
  metaDescription: EntryFieldTypes.Text;
  index?: EntryFieldTypes.Boolean;
  robots?: EntryFieldTypes.Boolean;
}

interface MetaDataSkeleton {
  contentTypeId: 'metaData';
  fields: MetaDataFields;
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
  metaData: Entry<MetaDataSkeleton>;
  slug?: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
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
  metaData: {
    title: string;
    description: string;
    index?: boolean;
    robots?: boolean;
  };
  slug?: string;
  title?: string;
  description?: string;
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

const transformTimelineSection = (section: Entry<TimelineSectionSkeleton>): TimelineSection => {
  const { fields } = section;

  const processedImages = fields.images?.map(transformAsset).filter((img): img is NonNullable<typeof img> => {
    if (!img) {
      console.log('Image was filtered out due to transformation failure');
      return false;
    }
    return true;
  });

  console.log('Processed images for section:', {
    heading: fields.heading,
    originalCount: fields.images?.length || 0,
    processedCount: processedImages?.length || 0,
    urls: processedImages?.map(img => img.url)
  });

  return {
    internalName: fields.internalName,
    year: fields.year,
    heading: fields.heading,
    description: fields.description,
    images: processedImages,
  };
}

const transformContentPage = (entry: Entry<ContentPageSkeleton>): ContentPage => {
  const { fields } = entry;

  console.log('Transforming content page:', {
    internalName: fields.internalName,
    hasMetaData: !!fields.metaData,
    metaDataFields: fields.metaData?.fields,
    slug: fields.slug,
    title: fields.title,
    description: fields.description,
    sectionsCount: fields.sections?.length ?? 0
  });

  const metaData = {
    title: fields.metaData?.fields?.metaTitle ?? fields.title ?? fields.internalName,
    description: fields.metaData?.fields?.metaDescription ?? fields.description ?? '',
    index: fields.metaData?.fields?.index ?? true,
    robots: fields.metaData?.fields?.robots ?? true,
  };

  return {
    internalName: fields.internalName,
    metaData,
    slug: fields.slug || undefined,
    title: fields.title || undefined,
    description: fields.description || undefined,
    sections: fields.sections?.map(transformTimelineSection),
  };
};

export async function getContentPage(slug: string): Promise<ContentPage | null> {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.error('Contentful environment variables are not set');
    return null;
  }

  try {
    console.log('Fetching content page from Contentful...', { slug });

    const allPages = await client.getEntries<ContentPageSkeleton>({
      content_type: 'contentPage',
      include: 10,
    });

    console.log('All content pages:', {
      total: allPages.total,
      pages: allPages.items.map(item => ({
        id: item.sys.id,
        internalName: item.fields.internalName,
        slug: item.fields.slug,
        hasMetaData: !!item.fields.metaData,
      }))
    });

    const response = await client.getEntries<ContentPageSkeleton>({
      content_type: 'contentPage',
      'fields.slug': slug,
      include: 10,
    });

    console.log('Contentful response:', {
      total: response.total,
      hasItems: response.items.length > 0,
      firstItem: response.items[0] ? {
        id: response.items[0].sys.id,
        internalName: response.items[0].fields.internalName,
        hasMetaData: !!response.items[0].fields.metaData,
      } : null
    });

    if (!response.items.length) {
      return null;
    }

    return transformContentPage(response.items[0]);
  } catch (error) {
    console.error('Error fetching content page:', error);
    return null;
  }
}
