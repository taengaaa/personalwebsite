import { createClient, Entry, Asset, ChainModifiers, EntrySkeletonType } from 'contentful';
import type { Project } from '../../types/project';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: 'master',
});

interface ContentfulAssetFile {
  fields: {
    file: {
      url: string;
      details?: {
        image?: {
          width: number;
          height: number;
        };
      };
    };
    title?: string;
    description?: string;
  };
}

interface ContentfulAsset {
  fields: {
    title?: string;
    description?: string;
    image?: ContentfulAssetFile;
    file?: {
      url: string;
      details?: {
        image?: {
          width: number;
          height: number;
        };
      };
    };
  };
}

interface ContentfulUrl {
  fields: {
    buttonText?: string;
    projectUrl?: string;
    linkType?: string;
  };
}

interface TransformedAsset {
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        image?: {
          width: number;
          height: number;
        };
      };
    };
  };
}

interface TransformedUrl {
  fields: {
    text: string;
    url: string;
    openInNewTab: boolean;
  };
}

interface ProjectUrlFields {
  buttonText?: string;
  projectUrl?: string;
  linkType?: string;
}

interface ProjectUrlSkeleton extends EntrySkeletonType {
  contentTypeId: 'projectUrl';
  fields: ProjectUrlFields;
}

interface ProjectFields {
  title: string;
  internalName: string;
  subtitleLeft?: string;
  subtitleRight?: string;
  description: string;
  tags: string[];
  projectImage: Asset;
  projectUrl: Entry<ProjectUrlSkeleton>;
}

interface ProjectSkeleton extends EntrySkeletonType {
  contentTypeId: 'projectCard';
  fields: ProjectFields;
}

function isContentfulAsset(value: unknown): value is ContentfulAsset {
  return typeof value === 'object' && 
         value !== null && 
         'fields' in value;
}

function isContentfulUrl(value: unknown): value is ContentfulUrl {
  return typeof value === 'object' && 
         value !== null && 
         'fields' in value;
}

function transformAsset(assetEntry: unknown): TransformedAsset | undefined {
  if (!isContentfulAsset(assetEntry)) {
    console.log('Invalid asset entry:', assetEntry);
    return undefined;
  }

  // Handle the case where the image is nested in an 'image' field
  const fields = assetEntry.fields;
  const assetFields = fields.image?.fields || fields;
  const file = assetFields.file;
  
  if (!file) {
    console.log('Asset has no file:', assetFields);
    return undefined;
  }

  return {
    fields: {
      title: assetFields.title || '',
      description: assetFields.description || '',
      file: {
        url: file.url,
        details: {
          image: file.details?.image ? {
            width: file.details.image.width,
            height: file.details.image.height
          } : undefined
        }
      }
    }
  };
}

function transformUrl(urlEntry: unknown): TransformedUrl | undefined {
  if (!isContentfulUrl(urlEntry)) {
    console.log('Invalid URL entry:', urlEntry);
    return undefined;
  }

  const fields = urlEntry.fields;
  console.log('URL fields:', fields);

  return {
    fields: {
      text: fields.buttonText || '',
      url: fields.projectUrl || '',
      openInNewTab: fields.linkType === 'Neuer Tab'
    }
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!process.env.CONTENTFUL_SPACE_ID || !process.env.CONTENTFUL_ACCESS_TOKEN) {
    console.error('Contentful environment variables are not set');
    return [];
  }

  try {
    console.log('Fetching projects from Contentful...');
    const response = await client.getEntries<ProjectSkeleton>({
      content_type: 'projectCard',
      include: 2, // Include linked entries up to 2 levels deep
    });

    return response.items.map((item) => {
      const fields = item.fields;
      console.log(`\nProcessing project: ${fields.title}`);
      console.log('Raw project fields:', JSON.stringify(fields, null, 2));
      
      const projectImage = transformAsset(fields.projectImage);
      console.log('Transformed image:', JSON.stringify(projectImage, null, 2));

      const projectUrl = transformUrl(fields.projectUrl);
      console.log('Transformed URL:', JSON.stringify(projectUrl, null, 2));

      const project: Project = {
        id: item.sys.id,
        internalName: fields.internalName,
        title: fields.title,
        subtitleLeft: fields.subtitleLeft,
        subtitleRight: fields.subtitleRight,
        description: fields.description,
        tags: fields.tags || [],
        projectImage,
        projectUrl: projectUrl!
      };

      console.log('Transformed project:', JSON.stringify(project, null, 2));
      return project;
    });
  } catch (error) {
    console.error('Error fetching projects from Contentful:', error);
    return [];
  }
}

export const defaultTagColors: Record<string, "purple" | "orange" | "blue" | "red" | "light-blue"> = {
  "Development": "blue",
  "Design": "purple",
  "Frontend": "orange",
  "Backend": "red",
  "Mobile": "light-blue"
};
