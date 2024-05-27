export type AdminApp = {
  registerPlugin: (plugin: {
    [key: string]: any;
  }) => void;
  createSettingSection: (id: any, sections: any[]) => void;

  injectContentManagerComponent: (a: string, b: string, ...args: any[]) => void;

  addSettingsLink: (parent: string, config: Object) => void;

  getPlugin: (name: string) => null | undefined | {
    [key: string]: any;
    injectComponent: (name: string, zone: string, options: object) => any;
  };

  [key: string]: any;
};
