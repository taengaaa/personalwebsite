import { createClient } from 'contentful';
import type { Project } from '../../types/project';
import type { Asset, UnresolvedLink, AssetFields } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: 'master',
});

function transformAsset(assetEntry: any) {
  if (!assetEntry || !assetEntry.fields) {
    console.log('Invalid asset entry:', assetEntry);
    return undefined;
  }

  // Handle the case where the image is nested in an 'image' field
  const asset = assetEntry.fields.image || assetEntry;
  
  if (!asset || !asset.fields || !asset.fields.file) {
    console.log('Asset has no file:', asset);
    return undefined;
  }

  return {
    fields: {
      title: asset.fields.title || '',
      description: asset.fields.description || '',
      file: {
        url: asset.fields.file.url,
        details: {
          image: asset.fields.file.details?.image ? {
            width: asset.fields.file.details.image.width,
            height: asset.fields.file.details.image.height
          } : undefined
        }
      }
    }
  };
}

function transformUrl(urlEntry: any) {
  if (!urlEntry || !urlEntry.fields) {
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
    const response = await client.getEntries({
      content_type: 'projectCard',
      include: 2, // Include linked entries up to 2 levels deep
    });

    return response.items.map((item: any) => {
      console.log(`\nProcessing project: ${item.fields.title}`);
      console.log('Raw project fields:', JSON.stringify(item.fields, null, 2));
      
      const projectImage = transformAsset(item.fields.projectImage);
      console.log('Transformed image:', JSON.stringify(projectImage, null, 2));

      const projectUrl = transformUrl(item.fields.projectUrl);
      console.log('Transformed URL:', JSON.stringify(projectUrl, null, 2));

      const project: Project = {
        id: item.sys.id,
        internalName: item.fields.internalName,
        title: item.fields.title,
        subtitleLeft: item.fields.subtitleLeft,
        subtitleRight: item.fields.subtitleRight,
        description: item.fields.description,
        tags: item.fields.tags || [],
        projectImage: projectImage,
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

// Optional: Add tag color mapping based on your preferences
export const defaultTagColors: Record<string, "purple" | "orange" | "blue" | "red" | "light-blue"> = {
  "Development": "blue",
  "Design": "purple",
  "Marketing": "orange",
  "UI/UX": "red",
  "Mobile": "light-blue",
  // Add more mappings as needed
};
