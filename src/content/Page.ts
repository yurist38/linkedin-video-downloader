import { Message, Actions } from '../types';
import { debounce } from 'ts-debounce';

class Page {
  static buttonClassName = 'linkedin-video-downloader-btn';
  public buttonElement = Page.createDownloadButton();
  public observerCallbackDebounced = debounce(this.observerCallback, 1000);
  public observer = new MutationObserver(this.observerCallbackDebounced.bind(this));

  public constructor() {
    this.observer.observe(window.document, {
      childList: true,
      subtree: true,
    });
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
  }

  public observerCallback(): void {
    this.processAllVideos();
  }


  static createDownloadButton(): HTMLElement {
    const button = document.createElement('button');
    const img = document.createElement('img');
    button.classList.add(Page.buttonClassName);
    button.title = 'Download this video!';
    button.dataset.videoUrl = '';
    img.src = chrome.runtime.getURL('assets/icons/icon48.png');
    button.appendChild(img);
    return button;
  }

  static onClickDownload(event: MouseEvent): void {
    const url = (event.currentTarget as HTMLElement).dataset['videoUrl'];
    url && chrome.runtime.sendMessage({ action: Actions.Download, url });
  }

  static isButtonAttached(videoEl: HTMLElement): boolean {
    return !!videoEl.parentElement
      ?.getElementsByClassName(Page.buttonClassName)
      .length;
  }

  public processAllVideos(): void {
    const allVideoElements = document.getElementsByTagName('video');

    Array.from(allVideoElements).forEach((videoEl) => {
      if (Page.isButtonAttached(videoEl)) {
        return;
      }
      this.attachButton(videoEl);
    });
  }

  public attachButton(videoEl: HTMLVideoElement): void {
    const button = this.buttonElement.cloneNode(true) as HTMLElement;
    button.dataset['videoUrl'] = videoEl.src;
    button.addEventListener('click', Page.onClickDownload);
    videoEl.parentElement?.appendChild(button);
  }

  public onMessage(message: Message): void {
    switch (message.action) {
      case Actions.AddButtons:
        this.processAllVideos();
    }
  }
}

export default Page;
