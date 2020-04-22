import { Message, Actions } from '../types';

class Page {
  public buttonElement = Page.createDownloadButton();

  constructor() {
    window.onload = this.processAllVideos;
    chrome.runtime.onMessage.addListener((message: Message) => {
      this.onMessage && this.onMessage(message);
    });
  }

  static createDownloadButton(): HTMLElement {
    const button = document.createElement('button');
    const img = document.createElement('img');
    button.classList.add('linkedin-video-downloader-btn');
    button.title = 'Download this video!'
    img.src = chrome.runtime.getURL('assets/icons/icon48.png');
    button.appendChild(img);
    button.addEventListener('click', Page.onClickDownload);
    return button;
  }

  static onClickDownload(event: Event): void {
    // const videoEl = (event.currentTarget as HTMLElement).parentElement?.getElementsByTagName('video')[0];
    const url = (event.currentTarget as HTMLElement).dataset['videoUrl'];
    url && chrome.runtime.sendMessage({ action: Actions.Download, url });
  }

  // static downloadFile(url: string): void {
  //   const filename = `linkedin-video-${new Date().getTime()}`;
  //   console.log('>>>>', chrome.downloads.download);

  //   chrome.downloads.download({ url, filename });
  // }

  public onMessage(message: Message): void {
    switch (message.action) {
      case Actions.AddButtons:
        this.processAllVideos();
    }
  }

  public processAllVideos(): void {
    if (!(this instanceof Page)) {
      return;
    }

    const allVideoElements = document.getElementsByTagName('video');
    Array.from(allVideoElements).forEach((videoEl) => {
      this.buttonElement.dataset['videoUrl'] = videoEl.src;
      this.attachButton(videoEl);
    });
  }

  public attachButton(el: HTMLElement): void {
    el.parentElement?.appendChild(this.buttonElement);
  }
}

export default Page;
