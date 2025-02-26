import { createClient, Entry, EntrySkeletonType } from 'contentful';
import { Document, BLOCKS } from '@contentful/rich-text-types';

// Define basic interfaces for content structure
interface MetaData {
  title: string;
  description: string;
  index: boolean;
  robots: boolean;
}

interface ContentPage {
  internalName: string;
  title: string;
  description: string;
  slug: string;
  sections: TimelineSection[];
  metaData: MetaData;
}

interface TimelineSection {
  internalName: string;
  year: string;
  heading: string;
  description: Document;
  images: TransformedAsset[];
}

interface TransformedAsset {
  url: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
}

// Contentful specific interfaces
interface ContentfulFile {
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

interface ContentfulAssetFields {
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  file?: ContentfulFile | Record<string, ContentfulFile>;
  image?: ContentfulAsset; // For nested image references
}

interface ContentfulAsset {
  sys: {
    id: string;
    type: string;
  };
  fields: ContentfulAssetFields;
}

interface TimelineSectionFields {
  internalName?: string | Record<string, string>;
  year?: string | Record<string, string>;
  heading?: string | Record<string, string>;
  description?: Document | Record<string, Document>;
  images?: ContentfulAsset[];
}

interface TimelineSectionSkeleton extends EntrySkeletonType {
  contentTypeId: 'timelineSection';
  fields: TimelineSectionFields;
}

interface MetaDataFields {
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  index?: boolean | Record<string, boolean>;
  robots?: boolean | Record<string, boolean>;
}

interface MetaDataEntry extends EntrySkeletonType {
  contentTypeId: 'metaData';
  fields: MetaDataFields;
}

interface ContentPageFields {
  internalName?: string | Record<string, string>;
  title?: string | Record<string, string>;
  description?: string | Record<string, string>;
  slug?: string | Record<string, string>;
  sections?: Entry<TimelineSectionSkeleton>[];
  metaData?: Entry<MetaDataEntry>;
}

interface ContentPageSkeleton extends EntrySkeletonType {
  contentTypeId: 'contentPage';
  fields: ContentPageFields;
}

// Create Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: 'master',
});

/**
 * Extract a string value from a potentially localized field
 */
function extractString(field: string | Record<string, string> | Record<string, unknown> | undefined, defaultValue: string = ''): string {
  if (!field) return defaultValue;
  
  if (typeof field === 'string') {
    return field;
  }
  
  const values = Object.values(field);
  if (values.length === 0) return defaultValue;
  
  const firstValue = values[0];
  return typeof firstValue === 'string' ? firstValue : defaultValue;
}

/**
 * Extract a boolean value from a potentially localized field
 */
function extractBoolean(field: boolean | Record<string, boolean> | Record<string, unknown> | undefined, defaultValue: boolean = true): boolean {
  if (field === undefined) return defaultValue;
  
  if (typeof field === 'boolean') {
    return field;
  }
  
  const values = Object.values(field);
  if (values.length === 0) return defaultValue;
  
  const firstValue = values[0];
  return typeof firstValue === 'boolean' ? firstValue : defaultValue;
}

/**
 * Extract a Document from a potentially localized field
 */
function extractDocument(field: Document | Record<string, unknown> | string | undefined): Document {
  const defaultDoc: Document = { 
    nodeType: BLOCKS.DOCUMENT, 
    content: [], 
    data: {} 
  };
  
  if (!field) return defaultDoc;
  
  // Handle case where field is a string (description text)
  if (typeof field === 'string') {
    console.warn('Received string instead of Document:', field.substring(0, 100) + '...');
    // Create a simple document with the string as content
    return {
      nodeType: BLOCKS.DOCUMENT,
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: 'text',
              value: field,
              marks: [],
              data: {}
            }
          ],
          data: {}
        }
      ],
      data: {}
    };
  }
  
  // Handle case where field is a Document
  if (typeof field === 'object' && field !== null && 'nodeType' in field && 'content' in field && 'data' in field) {
    return field as Document;
  }
  
  // Handle case where field is a localized field (Record<string, unknown>)
  if (typeof field === 'object' && field !== null) {
    const values = Object.values(field);
    if (values.length === 0) return defaultDoc;
    
    const firstValue = values[0];
    
    // Handle case where the first value is a string
    if (typeof firstValue === 'string') {
      console.warn('Received localized string instead of Document');
      return {
        nodeType: BLOCKS.DOCUMENT,
        content: [
          {
            nodeType: BLOCKS.PARAGRAPH,
            content: [
              {
                nodeType: 'text',
                value: firstValue,
                marks: [],
                data: {}
              }
            ],
            data: {}
          }
        ],
        data: {}
      };
    }
    
    // Handle case where the first value is a Document
    if (firstValue && typeof firstValue === 'object' && firstValue !== null && 
        'nodeType' in firstValue && 'content' in firstValue && 'data' in firstValue) {
      return firstValue as Document;
    }
  }
  
  console.warn('Could not extract Document from field, using default');
  return defaultDoc;
}

/**
 * Transform a Contentful asset to our internal format
 */
const transformAsset = (asset: ContentfulAsset): TransformedAsset | null => {
  if (!asset?.fields) {
    console.warn('Invalid asset:', asset);
    return null;
  }

  const { title, description, file, image } = asset.fields;

  // Handle nested image reference (avoid infinite recursion)
  if (image && image !== asset) {
    try {
      return transformAsset(image);
    } catch (error) {
      console.error('Error transforming nested image:', error);
    }
  }

  if (!file) {
    console.warn('Asset missing file:', asset);
    return null;
  }

  // Handle localized file field
  let fileData: ContentfulFile | null = null;
  
  if (typeof file === 'object') {
    if ('url' in file && typeof file.url === 'string') {
      fileData = file as ContentfulFile;
    } else {
      const values = Object.values(file);
      if (values.length > 0) {
        fileData = values[0];
      }
    }
  }
  
  if (!fileData || !fileData.url) {
    console.warn('Asset missing file URL:', asset);
    return null;
  }

  return {
    url: fileData.url,
    title: extractString(title),
    description: extractString(description),
    width: fileData.details?.image?.width,
    height: fileData.details?.image?.height
  };
};

/**
 * Transform a Contentful timeline section to our internal format
 */
const transformTimelineSection = (section: Entry<TimelineSectionSkeleton>): TimelineSection => {
  console.log('transformTimelineSection called with section:', {
    id: section.sys?.id,
    contentType: section.sys?.contentType?.sys?.id,
    hasFields: !!section.fields
  });

  if (!section || !section.fields) {
    console.error('Invalid section data:', section);
    throw new Error('Invalid timeline section');
  }

  const { internalName, year, heading, description, images } = section.fields;

  console.log('Timeline section fields:', {
    internalName,
    year,
    heading,
    hasDescription: !!description,
    hasImages: !!images,
    imageCount: images?.length
  });

  // Transform images
  const transformedImages: TransformedAsset[] = [];
  
  if (images && Array.isArray(images)) {
    for (const image of images) {
      if (!image) continue;
      
      try {
        // Check if the image is a nested entry with an image field
        if (image.fields && 'image' in image.fields && image.fields.image) {
          const nestedImage = image.fields.image as ContentfulAsset;
          const transformedImage = transformAsset(nestedImage);
          if (transformedImage) {
            transformedImages.push(transformedImage);
          }
        } else {
          // Handle direct asset
          const transformedImage = transformAsset(image);
          if (transformedImage) {
            transformedImages.push(transformedImage);
          }
        }
      } catch (error) {
        console.error('Error transforming image:', error);
      }
    }
  }

  return {
    internalName: extractString(internalName),
    year: extractString(year),
    heading: extractString(heading),
    description: extractDocument(description),
    images: transformedImages
  };
};

/**
 * Transform a Contentful content page to our internal format
 */
const transformContentPage = (entry: Entry<ContentPageSkeleton>): ContentPage => {
  console.log('transformContentPage called with entry:', {
    id: entry.sys?.id,
    contentType: entry.sys?.contentType?.sys?.id,
    hasFields: !!entry.fields
  });

  if (!entry || !entry.fields) {
    console.error('Invalid entry data:', entry);
    throw new Error('Invalid content page entry');
  }

  const { internalName, title, description, slug, sections = [], metaData } = entry.fields;

  console.log('Content page fields:', {
    internalName,
    title,
    slug,
    hasSections: !!sections,
    sectionsLength: sections?.length,
    hasMetaData: !!metaData
  });

  // Transform sections
  const transformedSections: TimelineSection[] = [];
  
  if (sections && Array.isArray(sections)) {
    for (const section of sections) {
      if (!section) continue;
      
      try {
        const transformedSection = transformTimelineSection(section);
        if (transformedSection) {
          transformedSections.push(transformedSection);
        }
      } catch (error) {
        console.error('Error transforming section:', error);
      }
    }
  }

  // Handle potentially localized fields
  const normalizedInternalName = extractString(internalName);
  const normalizedTitle = extractString(title);
  const normalizedDescription = extractString(description);
  const normalizedSlug = extractString(slug);

  // Handle meta data with safe defaults
  let metaTitle = normalizedTitle;
  let metaDescription = normalizedDescription;
  let metaIndex = true;
  let metaRobots = true;

  if (metaData && metaData.fields) {
    const metaFields = metaData.fields as MetaDataFields;
    metaTitle = extractString(metaFields.title, normalizedTitle);
    metaDescription = extractString(metaFields.description, normalizedDescription);
    metaIndex = extractBoolean(metaFields.index, true);
    metaRobots = extractBoolean(metaFields.robots, true);
  }

  const normalizedMetaData: MetaData = {
    title: metaTitle,
    description: metaDescription,
    index: metaIndex,
    robots: metaRobots
  };

  return {
    internalName: normalizedInternalName,
    title: normalizedTitle,
    description: normalizedDescription,
    slug: normalizedSlug,
    sections: transformedSections,
    metaData: normalizedMetaData
  };
};

/**
 * Fetch a content page by slug
 */
export async function getContentPage(slug: string): Promise<ContentPage | null> {
  console.log('getContentPage called with slug:', slug);
  
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.error('Contentful environment variables are not set');
    return null;
  }

  try {
    console.log('Fetching content page from Contentful...', { slug });

    let response;
    try {
      response = await client.getEntries({
        content_type: 'contentPage',
        'fields.slug': slug,
        include: 10,
      });
      
      console.log('Successfully fetched page:', {
        total: response.total,
        hasItems: response.items?.length > 0,
        firstItemId: response.items?.[0]?.sys?.id
      });
    } catch (error) {
      console.error('Error fetching page:', error);
      return null;
    }

    if (!response.items || !Array.isArray(response.items) || response.items.length === 0) {
      console.log('No content page found with slug:', slug);
      return null;
    }

    try {
      const contentPage = transformContentPage(response.items[0] as Entry<ContentPageSkeleton>);
      console.log('Successfully transformed content page:', {
        internalName: contentPage.internalName,
        title: contentPage.title,
        sectionsCount: contentPage.sections?.length || 0,
        sections: contentPage.sections?.map(s => ({
          year: s.year,
          heading: s.heading,
          imagesCount: s.images?.length || 0
        }))
      });
      return contentPage;
    } catch (error) {
      console.error('Error transforming content page:', error);
      return null;
    }
  } catch (error) {
    console.error('Error fetching content page:', error);
    return null;
  }
}
