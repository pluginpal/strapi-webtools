import chalk from 'chalk';
import { checkbox } from '@inquirer/prompts';
import { checkStrapiProject } from '../utils/strapi';
import { getContentTypes } from '../utils/content-types';
import { getAvailableAddons, getPremiumAddons } from '../utils/addons';
import { installPackage } from '../utils/package-manager';
import { logger } from '../utils/logger';
import { licenseSetup } from './subcommands/license-setup';
import { enableContentTypes } from './subcommands/enable-content-types';

export async function install() {
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

  console.log('🚀 Get more out of Webtools with premium add-ons!\n');

  const { licenseKey } = await licenseSetup();

  // Get available content types
  const contentTypes = getContentTypes();

  // Enable Webtools for content types
  await enableContentTypes(contentTypes);

  // Get available addons
  const availableAddons = getAvailableAddons();
  let allAddons = [...availableAddons];

  // Add premium addons if user has license
  if (licenseKey) {
    const premiumAddons = getPremiumAddons();
    allAddons = [...availableAddons, ...premiumAddons];
  }

  // New line
  console.log('');

  // Let user select addons
  const selectedAddons = await checkbox({
    message: 'Select addons to install:',
    choices: allAddons.map((addon) => ({
      name: `${addon.name}${licenseKey && getPremiumAddons().some((p) => p.name === addon.name) ? ' (premium)' : ''}`,
      value: addon.name,
      description: addon.description,
    })),
  });

  // Install the main plugin and selected addons in a single step
  const packagesToInstall = ['strapi-plugin-webtools'];

  // Add selected addons to the installation list
  selectedAddons.forEach((addonName) => {
    const addon = allAddons.find((a) => a.name === addonName);
    if (addon) {
      packagesToInstall.push(addon.packageName);
    }
  });

  // Install all packages at once
  if (packagesToInstall.length > 0) {
    console.log(`\n${chalk.cyan('●')} Installing packages...\n`);

    const success = installPackage(packagesToInstall.join(' '));
    if (success) {
      console.log(chalk.green(`\n✓ Installed ${packagesToInstall.length} packages successfully`));
    } else {
      console.log(chalk.red('\n✗ Failed to install packages. Aborting installation.'));
      return;
    }
  }

  console.log(chalk.green('\nInstallation complete!'));
  console.log(chalk.yellow('\nYou may need to restart your Strapi server for changes to take effect.'));
}
