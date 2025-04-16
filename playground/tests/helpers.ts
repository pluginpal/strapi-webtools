import fs from 'node:fs';
import assert from 'node:assert';
import { createStrapi } from '@strapi/strapi';
import type { Core } from '@strapi/types';

let instance: Core.Strapi | undefined;

/**
 * Setups strapi for futher testing
 */
export async function setupStrapi() {
  if (!instance) {
    const strapi = await createStrapi({
      appDir: './playground',
      distDir: './playground/dist',
    }).load();
    strapi.server.mount();

    instance = strapi; // strapi is global now
  }
}

/**
 * Closes strapi after testing
 */
export async function stopStrapi() {
  if (instance) {
    const tmpDbFile = instance.config.get(
      'database.connection.connection.filename',
    );

    assert(typeof tmpDbFile === 'string');

    instance.server.httpServer.close();
    await instance.db.connection.destroy();
    await instance.destroy();

    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }

    instance = undefined;
  }
}
