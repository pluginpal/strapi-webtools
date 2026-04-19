import chalk from 'chalk';
import { input, select } from '@inquirer/prompts';
import { createLicenseFiles } from '../../utils/license';
import { logger } from '../../utils/logger';

export async function licenseSetup() {
  console.log('Start your free trial and get:');
  console.log('✨ 7 days of access to the Essential plan, which includes:');
  console.log('✅ Automated Redirects');
  console.log('✅ Internal Links');
  console.log('✅ Breadcrumbs');
  console.log('✅ Unlimited sitemaps\n');

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
    console.log(chalk.underline('https://www.pluginpal.io/plugin/webtools'));
    console.log('\n✨ Enjoy 7 days of access to the Essential plan completely free!');
    console.log('💡 Remember: You can cancel within the 7 days to ensure your trial remains free.\n');

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

  return {
    selectedPlan,
    licenseKey,
  };
}
