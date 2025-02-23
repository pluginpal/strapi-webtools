import { createStrapi } from '@strapi/strapi';
import fs, { PathLike } from 'fs';

let instance;

/**
 * Setups strapi for futher testing
 */
export async function setupStrapi() {
  if (!instance) {
    const strapi = await createStrapi({
      appDir: './playground',
      distDir: './playground/dist',
    }).load();

    instance = strapi; // strapi is global now

    await instance.server.mount();
  }
  return instance;
}

/**
 * Closes strapi after testing
 */
export async function stopStrapi() {
  if (instance) {
    await instance.server.httpServer.close();
    await instance.db.connection.destroy();
    instance.destroy();
    const tmpDbFile = strapi.config.get(
      'database.connection.connection.filename',
    );

    if (fs.existsSync(tmpDbFile as PathLike)) {
      fs.unlinkSync(tmpDbFile as PathLike);
    }
  }
  return instance;
}
