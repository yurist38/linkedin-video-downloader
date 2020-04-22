import { Actions, Message } from '../types';

chrome.webNavigation.onCompleted
  .addListener(() => {
    console.log('NAVIGATION COMPLETED')
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const message: Message = {
        action: Actions.NavigationCompleted,
      };
      tabs[0]?.id && chrome.tabs.sendMessage(tabs[0].id, message);
    });
  });