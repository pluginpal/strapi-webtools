import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export function detectPackageManager(): PackageManager {
  // Check for yarn.lock
  if (fs.existsSync(path.join(process.cwd(), 'yarn.lock'))) {
    return 'yarn';
  }

  // Check for pnpm-lock.yaml
  if (fs.existsSync(path.join(process.cwd(), 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }

  // Default to npm
  return 'npm';
}

export function installPackage(packageName: string): boolean {
  try {
    const packageManager = detectPackageManager();
    let command = '';

    switch (packageManager) {
      case 'yarn':
        command = `yarn add ${packageName}`;
        break;
      case 'pnpm':
        command = `pnpm add ${packageName}`;
        break;
      case 'npm':
      default:
        command = `npm install ${packageName}`;
        break;
    }

    console.log(`Installing ${packageName} using ${packageManager}...`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error installing package ${packageName}:`, error);
    return false;
  }
}
