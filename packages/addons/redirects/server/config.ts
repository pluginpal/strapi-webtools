
export interface Config {
  default_status_code: number;
  auto_generate: boolean;
}

const config: {
  default: Config,
  validator: () => void
} = {
  default: {
    default_status_code: 307,
    auto_generate: true,
  },
  validator() {},
};

export default config;
