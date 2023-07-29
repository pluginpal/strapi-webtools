import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(
  /^@pluginpal\/strapi-/i,
  '',
);

export default pluginId;
