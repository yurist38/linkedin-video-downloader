import { Actions, Message } from '../types';

class Processor {
  public constructor() {
    chrome.webNavigation.onCompleted.addListener(Processor.onNavigationCompleted);
    chrome.runtime.onMessage.addListener(Processor.onMessage);
  }

  static downloadVideo(url: string) {
    const filename = `linkedin-video-${new Date().getTime()}.mp4`;
    chrome.downloads.download({ url, filename });
  }

  static onMessage({ action, url }: Message): void {
    switch (action) {
      case Actions.Download:
        url && Processor.downloadVideo(url);
    }
  }

  static onNavigationCompleted = (): void => {
    chrome.tabs.query({active: true, currentWindow: true}, Processor.tabsQueryCallback);
  }

  static tabsQueryCallback = (tabs: chrome.tabs.Tab[]): void => {
    const message: Message = {
      action: Actions.AddButtons,
    };
    tabs[0]?.id && chrome.tabs.sendMessage(tabs[0].id, message);
  }
}

export default Processor;
