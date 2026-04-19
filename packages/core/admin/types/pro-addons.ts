export interface ProAddon {
  id: string;
  name: string;
  packageName: string;
  tagline: string;
  description: string;
  benefits: string[];
  icon: string;
  docsUrl: string;
  value: string;
}

export interface ProAddonCardProps {
  addon: ProAddon;
  isInstalled: boolean;
}

export interface LockedAddonMenuItemProps {
  addon: ProAddon;
}

export interface TrialModalProps {
  addon: ProAddon;
  isOpen: boolean;
  onClose: () => void;
}
