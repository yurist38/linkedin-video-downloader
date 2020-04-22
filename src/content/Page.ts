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
    const button = document.createElement('i');
    button.classList.add('linkedin-video-downloader-btn');
    button.style.backgroundImage = `url(${chrome.runtime.getURL('assets/icons/icon48.png')})`;
    button.addEventListener('click', Page.onClickDownload);
    return button;
  }

  static onClickDownload(event: Event): void {
    const videoEl = (event.target as HTMLElement).parentElement?.getElementsByTagName('video')[0];
    if (videoEl) {
      Page.downloadFile(videoEl.src);
    }
  }

  static downloadFile(url: string): void {
    // TODO: add downloading functionality
  }

  public onMessage(message: Message): void {
    switch (message.action) {
      case Actions.NavigationCompleted:
        this.processAllVideos();
    }
  }

  public processAllVideos(): void {
    const allVideoElements = document.getElementsByTagName('video');
    Array.from(allVideoElements).forEach(el => {
      this instanceof Page && this.processElement(el);
    });
  }

  public processElement(el: HTMLElement): void {
    el.parentElement?.appendChild(this.buttonElement);
  }
}

export default Page;
