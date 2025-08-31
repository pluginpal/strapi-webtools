import { Addon, AVAILABLE_ADDONS, PREMIUM_ADDONS } from '../constants/addons';

export function getAvailableAddons(): Addon[] {
  return AVAILABLE_ADDONS;
}

export function getPremiumAddons(): Addon[] {
  return PREMIUM_ADDONS;
}
