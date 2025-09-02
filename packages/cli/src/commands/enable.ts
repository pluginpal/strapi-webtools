import chalk from 'chalk';
import { checkbox } from '@inquirer/prompts';
import { checkStrapiProject } from '../utils/strapi';
import { getContentTypes, enableWebtoolsForContentType } from '../utils/content-types';

export async function enable() {
  // Check if we're in a Strapi project
  const isStrapiProject = await checkStrapiProject();
  if (!isStrapiProject) {
    console.log(chalk.red('Error: This command must be run in a Strapi project directory.'));
    return;
  }

  // Get available content types
  const contentTypes = getContentTypes();

  if (contentTypes.length === 0) {
    console.log(chalk.yellow('No content types found in your Strapi project.'));
    return;
  }

  // Let user select content types
  const selectedContentTypes = await checkbox({
    message: 'Select content types to enable Webtools for:',
    choices: contentTypes.map((type) => ({
      name: type,
      value: type,
    })),
  });

  // Enable Webtools for selected content types
  if (selectedContentTypes.length > 0) {
    console.log(`\n${chalk.cyan('●')} Enabling Webtools for selected content types...`);

    selectedContentTypes.map((contentType) => {
      const success = enableWebtoolsForContentType(contentType);
      if (success) {
        console.log(chalk.green(`✓ Enabled Webtools for ${contentType}`));
        return true;
      }

      console.log(chalk.red(`✗ Failed to enable Webtools for ${contentType}`));
      return false;
    });
  } else {
    console.log(chalk.yellow('No content types selected. Nothing to do.'));
  }

  console.log(chalk.yellow('\nYou may need to restart your Strapi server for changes to take effect.'));
}
