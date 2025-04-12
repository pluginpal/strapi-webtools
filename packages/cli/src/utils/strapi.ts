import fs from 'fs-extra';
import path from 'path';

interface PackageJson {
  dependencies?: {
    strapi?: string;
    '@strapi/strapi'?: string;
    [key: string]: string | undefined;
  };
}

export async function checkStrapiProject(): Promise<boolean> {
  try {
    // Check for package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      return false;
    }

    const packageJson = await fs.readJson(packageJsonPath) as PackageJson;

    // Check if this is a Strapi project
    return packageJson.dependencies?.strapi !== undefined ||
           packageJson.dependencies?.['@strapi/strapi'] !== undefined;
  } catch (error) {
    return false;
  }
}
