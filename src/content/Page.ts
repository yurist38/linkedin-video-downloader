import { Message, Actions, CommonNames, Options } from '../types';
import { defaultOptions } from '../constants';
import { debounce } from 'ts-debounce';

class Page {
  public options = defaultOptions;
  public buttonElement = this.createDownloadButton();
  public observerCallbackDebounced = debounce(this.processAllVideos, 1000);
  public observer = new MutationObserver(this.observerCallbackDebounced.bind(this));

  public constructor() {
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
    this.observer.observe(window.document, {
      childList: true,
      subtree: true,
    });
    chrome.storage.local.get([CommonNames.OptionsStorageKey], (data) => {
      if (!data || !data[CommonNames.OptionsStorageKey]) {
        return;
      }
      Object.keys(data[CommonNames.OptionsStorageKey]).forEach((key) => {
        this.options[key as keyof Options] = data[CommonNames.OptionsStorageKey][key];
      });
      this.buttonElement = this.createDownloadButton();
    });
  }

  public getButtonClasses(): string[] {
    return [
      CommonNames.ButtonClassName,
      this.options.buttonPosition.horizontal,
      this.options.buttonPosition.vertical,
    ];
  }

  public createDownloadButton(): HTMLElement {
    const button = document.createElement('button');
    const img = document.createElement('img');
    button.classList.add(...this.getButtonClasses());
    button.title = 'Download this video!';
    button.dataset.videoUrl = '';
    img.src = chrome.runtime.getURL('assets/icons/icon48.png');
    button.appendChild(img);
    return button;
  }

  static onClickDownload(event: MouseEvent): void {
    const url = (event.currentTarget as HTMLElement).dataset['videoUrl'];
    if (url) {
      chrome.runtime.sendMessage({
        action: Actions.Download,
        url,
        pageTitle: document.title,
      });
    }
  }

  static isButtonAttached(videoEl: HTMLElement): boolean {
    return !!videoEl.parentElement
      ?.getElementsByClassName(CommonNames.ButtonClassName)
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

  public onMessage(message: Message): boolean {
    switch (message.action) {
      case Actions.AddButtons:
        this.processAllVideos();
    }
    return true;
  }
}

export default Page;
