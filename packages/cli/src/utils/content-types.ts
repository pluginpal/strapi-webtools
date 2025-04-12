import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';

export function getContentTypes(): string[] {
  try {
    // Look for content-type schema files in the src/api directory
    const schemaFiles = glob.sync('src/api/**/content-types/**/schema.json', {
      cwd: process.cwd(),
    });

    return schemaFiles.map((file) => {
      // Extract content type name from path
      // Example: src/api/article/content-types/article/schema.json -> article
      const matches = file.match(/content-types\/([^/]+)\/schema\.json$/);
      return matches ? matches[1] : '';
    }).filter(Boolean);
  } catch (error) {
    console.error('Error reading content types:', error);
    return [];
  }
}

interface SchemaFile {
  pluginOptions?: {
    webtools?: {
      enabled?: boolean;
    };
  };
}

export function enableWebToolsForContentType(contentType: string): boolean {
  try {
    // Find the schema file for this content type
    const schemaFiles = glob.sync(`src/api/**/content-types/${contentType}/schema.json`, {
      cwd: process.cwd(),
    });

    if (schemaFiles.length === 0) {
      console.error(`Schema file not found for content type: ${contentType}`);
      return false;
    }

    const schemaPath = path.join(process.cwd(), schemaFiles[0]);
    const schema = fs.readJsonSync(schemaPath) as SchemaFile;

    // Add or update the pluginOptions
    if (!schema.pluginOptions) {
      schema.pluginOptions = {};
    }

    if (!schema.pluginOptions.webtools) {
      schema.pluginOptions.webtools = {};
    }

    // Enable WebTools for this content type
    schema.pluginOptions.webtools.enabled = true;

    // Write the updated schema back to the file
    fs.writeJsonSync(schemaPath, schema, { spaces: 2 });

    return true;
  } catch (error) {
    console.error(`Error enabling WebTools for content type ${contentType}:`, error);
    return false;
  }
}
