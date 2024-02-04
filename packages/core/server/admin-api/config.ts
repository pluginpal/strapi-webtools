export interface Config {
  website_url: string;
  default_pattern: string,
}

const config: {
  default: Config,
  validator: () => void
} = {
  default: {
    website_url: null,
    default_pattern: '/[pluralName]/[id]',
  },
  validator() {},
};

export default config;
