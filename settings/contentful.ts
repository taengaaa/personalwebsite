if (!process.env.CONTENTFUL_SPACE_ID) {
  throw new Error('CONTENTFUL_SPACE_ID environment variable is not set');
}

if (!process.env.CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('CONTENTFUL_ACCESS_TOKEN environment variable is not set');
}

if (!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN) {
  throw new Error('CONTENTFUL_PREVIEW_ACCESS_TOKEN environment variable is not set');
}

export const CONTENTFUL_SPACE_ID: string = process.env.CONTENTFUL_SPACE_ID;
export const CONTENTFUL_ACCESS_TOKEN: string = process.env.CONTENTFUL_ACCESS_TOKEN;
export const CONTENTFUL_PREVIEW_ACCESS_TOKEN: string = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
