export enum Actions {
  NavigationCompleted = 'navigationCompleted',
}

export interface Message {
  action: Actions;
}