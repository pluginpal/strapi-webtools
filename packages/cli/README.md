# @strapi-webtools/cli

A CLI tool for installing and managing Strapi WebTools in your Strapi project.

## Installation

```bash
npm install -g @strapi-webtools/cli
```

## Usage

To install WebTools in your Strapi project:

```bash
cd /path/to/your/strapi/project
strapi-webtools install
```

This will:
1. Check if you're in a valid Strapi project
2. Let you select which content types should have WebTools enabled
3. Let you choose which WebTools addons to install

## Requirements

- Node.js >= 18.0.0
- A Strapi v4.x project

## Development

To build the CLI:

```bash
yarn build
```

To run the CLI in development:

```bash
yarn dev
```

## License

MIT 
