#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import strapi from '@strapi/strapi';

import packageJSON from '../package.json';

const program = new Command();

const getStrapiApp = async () => {
  process.env.CONFIG_SYNC_CLI = 'true';

  const appContext = await strapi.compileStrapi();
  const app = await strapi.createStrapi(appContext).load();
  return app;
};

// Initial program setup
program.storeOptionsAsProperties(false).allowUnknownOption(true);

program.helpOption('-h, --help', 'Display help for command');
program.addHelpCommand('help [command]', 'Display help for command');

// `$ sitemap version` (--version synonym)
program.version(packageJSON.version, '-v, --version', 'Output the version number');
program
  .command('version')
  .description('Output your version of the sitemap plugin')
  .action(() => {
    process.stdout.write(`${packageJSON.version}\n`);
    process.exit(0);
  });

// `$ sitemap generate`
program
  .command('generate')
  .description('Generate the sitemap XML')
  .argument('[sitemap]', 'Specific sitemap to generate')
  .action(async (sitemap) => {
    const app = await getStrapiApp();
    const sitemaps = [];

    if (!sitemap) {
      const config = await app.plugin('webtools-addon-sitemap').service('setting').getConfig();
      Object.keys(config.sitemaps).forEach((sitemapId) => {
        sitemaps.push(sitemapId);
      });
    } else {
      sitemaps.push(sitemap);
    }

    await Promise.all(sitemaps.map(async (sitemap) => {
      try {
        app.plugin('webtools-addon-sitemap').service('core').createSitemap(sitemap);
        console.log(`${chalk.green.bold('[success]')} Successfully generated the ${sitemap} sitemap XML.`);
      } catch (err) {
        console.log(`${chalk.red.bold('[error]')} Something went wrong when generating the ${sitemap} sitemap XML. ${err}`);
      }
    }));

    process.exit(0);
  });

program.parseAsync(process.argv);
