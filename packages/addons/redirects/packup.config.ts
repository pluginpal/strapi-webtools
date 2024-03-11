import { Config, defineConfig } from '@strapi/pack-up';

const config: Config = defineConfig({
  bundles: [
    {
      source: './admin/index.ts',
      import: './bundle/admin/index.mjs',
      require: './bundle/admin/index.js',
      runtime: 'web',
    },
    {
      source: './server/index.ts',
      import: './bundle/server/index.mjs',
      require: './bundle/server/index.js',
      runtime: 'node',
    },
  ],
  dist: './bundle',
  /**
   * Because we're exporting a server & client package
   * which have different runtimes we want to ignore
   * what they look like in the package.json
   */
  exports: {},
});

export default config;
