'use strict';

const fs = require('node:fs');
const assert = require('node:assert');
const { createStrapi } = require('@strapi/strapi');

let instance;

async function setupStrapi() {
  if (!instance) {
    const strapi = await createStrapi({
      appDir: './playground',
      distDir: './playground/dist',
    }).load();

    await strapi.start();
    instance = strapi;
  }
}

async function stopStrapi() {
  if (instance) {
    const tmpDbFile = instance.config.get('database.connection.connection.filename');
    assert(typeof tmpDbFile === 'string');

    await instance.destroy();

    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }

    instance = undefined;
  }
}

module.exports = {
  setupStrapi,
  stopStrapi,
};
