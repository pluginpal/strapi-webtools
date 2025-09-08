#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { install } from './commands/install';
import { enable } from './commands/enable';
import { setupLicense } from './commands/license-setup';

const program = new Command();

program
  .name('strapi-webtools')
  .description('CLI for installing and managing Strapi Webtools')
  .version('0.0.1');

program
  .command('install')
  .description('Install Webtools in your Strapi project')
  .action(async () => {
    try {
      await install();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

program
  .command('enable')
  .description('Enable Webtools for specific content types')
  .action(async () => {
    try {
      await enable();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

// program
//   .command('setup-license')
//   .description('Set up your Webtools license in your Strapi project')
//   .action(async () => {
//     try {
//       await setupLicense();
//     } catch (error) {
//       console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'An unknown error occurred');
//       process.exit(1);
//     }
//   });

program.parse();
