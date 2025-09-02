import chalk from 'chalk';
import { checkbox, input, select } from '@inquirer/prompts';
import { checkStrapiProject } from '../utils/strapi';
import { getContentTypes, enableWebtoolsForContentType } from '../utils/content-types';
import { getAvailableAddons, getPremiumAddons } from '../utils/addons';
import { installPackage } from '../utils/package-manager';
import { createLicenseFiles } from '../utils/license';
import { logger } from '../utils/logger';

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

  console.log('Start your free trial and get:');
  console.log('✨ 30 days of access to the Essential plan, which includes:');
  console.log('✅ Automated Redirects');
  console.log('✅ Internal Links\n');

  const selectedPlan = await select({
    message: 'Do you have a license?',
    choices: [
      { name: 'Yes, use my license', value: 'license' },
      { name: 'Get me a trial', value: 'trial' },
      { name: 'Skip', value: 'skip' },
    ],
  });

  let licenseKey: string | null = null;

  if (selectedPlan === 'license') {
    licenseKey = await input({
      message: 'Please enter your license key:',
      validate: (value) => {
        if (!value || value.trim().length === 0) {
          return 'License key cannot be empty';
        }
        return true;
      },
    });

    // Create license files
    console.log(`\n${chalk.cyan('●')} Setting up license configuration...`);
    const success = await createLicenseFiles(licenseKey);
    if (!success) {
      console.log(chalk.red('\nFailed to setup license configuration. Continuing without a license.'));
      licenseKey = null;
    }
  }

  if (selectedPlan === 'trial') {
    logger.title(
      'Trial',
      `${chalk.bold('🚀 Get your free trial license!')}\n`,
    );
    console.log('You can start your free trial by visiting the following link:');
    console.log(chalk.underline('https://polar.sh/checkout/polar_c_4NUnsZ24PTLPhbSux9STPqeLL7ptZlcz003Yy15MArc'));
    console.log('\n✨ Enjoy 30 days of access to the Essential plan completely free!');
    console.log('💡 Remember: You can cancel within the 30 days to ensure your trial remains free.\n');

    const trialPlan = await select({
      message: 'Got your license key?',
      choices: [
        { name: 'Yes', value: 'yes' },
        { name: 'Skip', value: 'skip' },
      ],
    });

    if (trialPlan === 'yes') {
      licenseKey = await input({
        message: 'Please enter your license key:',
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return 'License key cannot be empty';
          }
          return true;
        },
      });

      // Create license files
      console.log(`\n${chalk.cyan('●')} Setting up license configuration...`);
      const success = await createLicenseFiles(licenseKey);
      if (!success) {
        console.log(chalk.red('\nFailed to setup license configuration. Continuing without a license.'));
        licenseKey = null;
      }
    }
  }

  // Get available content types
  const contentTypes = getContentTypes();

  if (contentTypes.length === 0) {
    console.log(chalk.yellow('No content types found in your Strapi project, skipping Webtools setup step. You can enable Webtools later using the "enable" command.'));
  } else {
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
    }
  }

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
