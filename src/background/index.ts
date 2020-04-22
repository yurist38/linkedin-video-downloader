import { Actions, Message } from '../types';

chrome.webNavigation.onCompleted
  .addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const message: Message = {
        action: Actions.AddButtons,
      };
      tabs[0]?.id && chrome.tabs.sendMessage(tabs[0].id, message);
    });
  });

chrome.runtime.onMessage.addListener(onMessage);

function onMessage({ action, url }: Message): void {
  switch (action) {
    case Actions.Download:
      url && downloadVideo(url);
  }
}

function downloadVideo(url: string) {
  const filename = `linkedin-video-${new Date().getTime()}`;
  chrome.downloads.download({ url, filename });
}