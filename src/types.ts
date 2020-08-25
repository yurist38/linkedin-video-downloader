export enum Actions {
  AddButtons = 'addButtons',
  Download = 'download',
}

export interface Message {
  action: Actions;
  url?: string;
}

export interface Options {
  buttonPosition: {
    horizontal: 'left' | 'right';
    vertical: 'top' | 'bottom';
  };
}

export enum CommonNames {
  ButtonClassName = 'linkedin-video-downloader-btn',
  OptionsStorageKey = 'linkedin-video-downloader-options',
}
