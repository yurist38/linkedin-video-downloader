import { Actions, Message, CommonNames, Options } from '../types';
import { defaultOptions } from '../constants';

class Processor {
  public constructor() {
    chrome.runtime.onMessage.addListener(Processor.onMessage);
    chrome.webNavigation.onCompleted.addListener(Processor.onNavigationCompleted, {
      url: [{ hostSuffix: '.linkedin.com' }],
    });
  }

  static downloadVideo(url: string, pageTitle?: string) {
    chrome.storage.local.get([CommonNames.OptionsStorageKey], (data) => {
      const storedOptions = data[CommonNames.OptionsStorageKey] as Options;
      const filenameRaw = `${storedOptions?.filename || defaultOptions.filename}.mp4`;
      const date = new Date();
      const filename = filenameRaw
        .replace('[DATE]', date.toLocaleDateString('en-GB'))
        .replace('[TIME]', date.toLocaleTimeString('en-GB'))
        .replace('[TITLE]', pageTitle || '')
        .replace(/[/:\s]/g, '-')
        .replace(/[^a-zA-Z0-9-.]/g, '');
      chrome.downloads.download({ url, filename });
    });
  }

  static onMessage({ action, url, pageTitle }: Message): boolean {
    switch (action) {
      case Actions.Download:
        url && Processor.downloadVideo(url, pageTitle);
    }
    return true;
  }

  static onNavigationCompleted = (): void => {
    chrome.tabs.query({ active: true, currentWindow: true }, Processor.tabsQueryCallback);
  };

  static tabsQueryCallback = (tabs: chrome.tabs.Tab[]): void => {
    const message: Message = {
      action: Actions.AddButtons,
    };
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  };
}

export default Processor;
