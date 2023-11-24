export interface Config {
  website_url: string;
}

const config: {
  default: Config,
  validator: () => void
} = {
  default: {
    website_url: null,
  },
  validator() {},
};

export default config;
