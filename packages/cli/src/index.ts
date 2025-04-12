#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { install } from './commands/install';

const program = new Command();

program
  .name('strapi-webtools')
  .description('CLI for installing and managing Strapi WebTools')
  .version('0.0.1');

program
  .command('install')
  .description('Install WebTools in your Strapi project')
  .action(async () => {
    try {
      await install();
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'An unknown error occurred');
      process.exit(1);
    }
  });

program.parse();
