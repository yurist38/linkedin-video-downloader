export enum Actions {
  AddButtons = 'addButtons',
  Download = 'download',
}

export interface Message {
  action: Actions;
  url?: string;
}