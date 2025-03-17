import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';
import kebabCase from 'lodash/kebabCase';

export interface Config {
  website_url: string;
  default_pattern: string,
  slugify: (fieldValue: string) => string
}

const config: {
  default: Config,
  validator: () => void
} = {
  default: {
    website_url: null,
    default_pattern: '/[pluralName]/[documentId]',
    slugify: (fieldValue) => kebabCase(deburr(toLower(fieldValue))),
  },
  validator() {},
};

export default config;
