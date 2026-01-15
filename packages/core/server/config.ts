import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';
import kebabCase from 'lodash/kebabCase';

export interface Config {
  website_url: string;
  default_pattern: string,
  unique_per_locale: boolean,
  populate_creator_fields: boolean,
  router_use_controllers: boolean,
  slugify: (fieldValue: string) => string,
}

const config: {
  default: Config,
  validator: () => void
} = {
  default: {
    router_use_controllers: false,
    website_url: null,
    default_pattern: '/[pluralName]/[documentId]',
    slugify: (fieldValue) => kebabCase(deburr(toLower(fieldValue))),
    unique_per_locale: false,
    populate_creator_fields: false,
  },
  validator() {},
};

export default config;
