import chalk from 'chalk';
import { checkStrapiProject } from '../utils/strapi';
import { logger } from '../utils/logger';
import { licenseSetup } from './subcommands/license-setup';

export async function setupLicense() {
  // Check if we're in a Strapi project
  const isStrapiProject = await checkStrapiProject();
  if (!isStrapiProject) {
    console.log(chalk.red('Error: This command must be run in a Strapi project directory.'));
    return;
  }

  logger.title(
    'Webtools',
    `${chalk.bold('🚀 Let\'s build your new website with Strapi')}\n`,
  );

  await licenseSetup();

  console.log(chalk.green('\nLicense setup complete!'));
}
