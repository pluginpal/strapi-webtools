import chalk from 'chalk';
import { checkStrapiProject } from '../utils/strapi';
import { getContentTypes } from '../utils/content-types';
import { enableContentTypes } from './subcommands/enable-content-types';

export async function enable() {
  // Check if we're in a Strapi project
  const isStrapiProject = await checkStrapiProject();
  if (!isStrapiProject) {
    console.log(chalk.red('Error: This command must be run in a Strapi project directory.'));
    return;
  }

  // Get available content types
  const contentTypes = getContentTypes();

  // Enable Webtools for content types
  await enableContentTypes(contentTypes);

  console.log(chalk.yellow('\nYou may need to restart your Strapi server for changes to take effect.'));
}
