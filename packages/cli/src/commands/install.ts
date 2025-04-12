import chalk from 'chalk';
import { checkbox } from '@inquirer/prompts';
import { checkStrapiProject } from '../utils/strapi';
import { getContentTypes, enableWebToolsForContentType } from '../utils/content-types';
import { getAvailableAddons } from '../utils/addons';
import { installPackage } from '../utils/package-manager';

export async function install() {
  // Check if we're in a Strapi project
  const isStrapiProject = await checkStrapiProject();
  if (!isStrapiProject) {
    console.log(chalk.red('Error: This command must be run in a Strapi project directory.'));
    return;
  }

  // Get available content types
  const contentTypes = getContentTypes();

  // Let user select content types
  const selectedContentTypes = await checkbox({
    message: 'Select content types to enable WebTools for:',
    choices: contentTypes.map((type) => ({
      name: type,
      value: type,
    })),
  });

  // Get available addons
  const availableAddons = getAvailableAddons();

  // Let user select addons
  const selectedAddons = await checkbox({
    message: 'Select addons to install:',
    choices: availableAddons.map((addon) => ({
      name: addon.name,
      value: addon.name,
      description: addon.description,
    })),
  });

  // Enable WebTools for selected content types
  if (selectedContentTypes.length > 0) {
    console.log(chalk.blue('\nEnabling WebTools for selected content types...'));

    const results = selectedContentTypes.map((contentType) => {
      const success = enableWebToolsForContentType(contentType);
      if (success) {
        console.log(chalk.green(`✓ Enabled WebTools for ${contentType}`));
        return true;
      }

      console.log(chalk.red(`✗ Failed to enable WebTools for ${contentType}`));
      return false;
    });

    const successCount = results.filter(Boolean).length;
    console.log(chalk.blue(`\nEnabled WebTools for ${successCount} of ${selectedContentTypes.length} content types.`));
  }

  // Install selected addons
  if (selectedAddons.length > 0) {
    console.log(chalk.blue('\nInstalling selected addons...'));

    const results = selectedAddons.map((addonName) => {
      const addon = availableAddons.find((a) => a.name === addonName);
      if (!addon) {
        console.log(chalk.red(`✗ Addon ${addonName} not found`));
        return false;
      }

      const success = installPackage(addon.packageName);
      if (success) {
        console.log(chalk.green(`✓ Installed ${addon.name} addon`));
        return true;
      }

      console.log(chalk.red(`✗ Failed to install ${addon.name} addon`));
      return false;
    });

    const successCount = results.filter(Boolean).length;
    console.log(chalk.blue(`\nInstalled ${successCount} of ${selectedAddons.length} addons.`));
  }

  console.log(chalk.green('\nInstallation complete!'));
  console.log(chalk.yellow('\nYou may need to restart your Strapi server for changes to take effect.'));
}
