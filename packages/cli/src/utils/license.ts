import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { detectPackageManager } from './package-manager';

function getYarnVersion(): string | null {
  try {
    const version = execSync('yarn --version', { encoding: 'utf8', stdio: 'pipe' }).trim();
    return version;
  } catch (error) {
    return null;
  }
}

function isYarnV2OrHigher(): boolean {
  const version = getYarnVersion();
  if (!version) return false;

  const majorVersion = parseInt(version.split('.')[0], 10);
  return majorVersion >= 2;
}

export async function createLicenseFiles(licenseKey: string): Promise<boolean> {
  try {
    const currentDir = process.cwd();

    // Create .env file with license key
    const envPath = path.join(currentDir, '.env');
    let envContent = '';

    // Check if .env already exists and read its content
    if (await fs.pathExists(envPath)) {
      envContent = await fs.readFile(envPath, 'utf8');

      // Check if WEBTOOLS_LICENSE_KEY already exists
      if (envContent.includes('WEBTOOLS_LICENSE_KEY=')) {
        // Replace existing license key
        envContent = envContent.replace(/WEBTOOLS_LICENSE_KEY=.*/g, `WEBTOOLS_LICENSE_KEY=${licenseKey}`);
      } else {
        // Add license key to existing content
        envContent += `\nWEBTOOLS_LICENSE_KEY=${licenseKey}\n`;
      }
    } else {
      // Create new .env file
      envContent = `WEBTOOLS_LICENSE_KEY=${licenseKey}\n`;
    }

    await fs.writeFile(envPath, envContent);
    console.log(chalk.green('✓ Added license key to .env file'));

    // Detect package manager and create appropriate config file
    const packageManager = detectPackageManager();

    if (packageManager === 'yarn' && isYarnV2OrHigher()) {
      // Create .yarnrc.yml file for Yarn v2+
      const yarnrcPath = path.join(currentDir, '.yarnrc.yml');
      const yarnrcContent = `npmScopes:
  pluginpal:
    npmPublishRegistry: https://npm.pluginpal.io
    npmRegistryServer: https://npm.pluginpal.io
    npmAlwaysAuth: true
    npmAuthIdent: "token"
    npmAuthToken: "${licenseKey}"
`;

      await fs.writeFile(yarnrcPath, yarnrcContent);
      console.log(chalk.green('✓ Created .yarnrc.yml file with registry configuration'));
    } else {
      // Create .npmrc file for npm/pnpm/yarn v1
      const npmrcPath = path.join(currentDir, '.npmrc');
      const npmrcContent = `@pluginpal:registry=https://npm.pluginpal.io
//npm.pluginpal.io/:_authToken=${licenseKey}
always-auth=true
`;

      await fs.writeFile(npmrcPath, npmrcContent);
      console.log(chalk.green('✓ Created .npmrc file with registry configuration'));
    }

    return true;
  } catch (error) {
    console.error(chalk.red('Error creating license files:'), error);
    return false;
  }
}
