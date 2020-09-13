import { debounce } from 'ts-debounce';
import objectScan from 'object-scan';
import { Message, Actions, CommonNames } from '../types';
import { defaultOptions } from '../constants';
import { loadScripts } from '../util/loadScript';

declare class Hls {
  static isSupported: () => boolean;
  static Events: {
    MANIFEST_PARSED: string;
    BUFFER_APPENDING: string;
    BUFFER_EOS: string;
  };
  public loadSource: (url: string) => void;
  public attachMedia: (el: HTMLElement) => void;
  public on: (event: string, callback: (event: string, data: any) => void) => void
}

declare global {
  interface Window {
    Hls: Hls
  }
}

class Page {
  public options = defaultOptions;
  public buttonElement = this.createDownloadButton();
  public observerCallbackDebounced = debounce(this.observerCallback, 1000);
  public observer = new MutationObserver(this.observerCallbackDebounced.bind(this));
  public isHlsScriptLoaded = false;
  public fmp4Data = {
    audio: [],
    video: []
  }

  public constructor() {
    this.observer.observe(window.document, {
      childList: true,
      subtree: true,
    });
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
    chrome.storage.local.get([CommonNames.OptionsStorageKey], (data) => {
      if (data && data[CommonNames.OptionsStorageKey]) {
        this.options = data[CommonNames.OptionsStorageKey];
        this.buttonElement = this.createDownloadButton();
      }
    });
  }

  public observerCallback(): void {
    this.processAllVideos();
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

  public onClickDownload = async (event: MouseEvent): Promise<void> => {
    const url = (event.currentTarget as HTMLElement).dataset['videoUrl'];

    if (!url || !chrome.runtime) {
      return;
    }

    if (url.startsWith('blob:')) {
      this.downloadHls();
    } else {
      chrome.runtime.sendMessage({ action: Actions.Download, url });
    }
  }

  async downloadHls(): Promise<void> {
    const codeElements = [...document.body.getElementsByTagName('code')];

    for (const codeEl of codeElements) {
      if (codeEl.innerText.includes('"adaptiveStreams"')) {
        try {
          const obj = JSON.parse(codeEl.innerText);
          objectScan(['*[*].adaptiveStreams'], { filterFn: ({ value }: { value: any[] }) => {
            const [ matchObj ] = value;
            if (matchObj.protocol.toUpperCase() !== 'HLS') {
              return;
            }
            const { url } = matchObj.masterPlaylists[0];
            if (typeof url === 'string') {
              this.initHlsVideo(url);
            }
          }})(obj);
          break;
        } catch (e) {
          // it's fine, don't have to catch it
        }
      }
    }
  }

  async initHlsVideo(url: string): Promise<void> {
    await this.loadHlsScript();
    const videoEl = document.createElement('video');
    videoEl.preload = 'true';
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoEl);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.play();
      });
      hls.on(Hls.Events.BUFFER_APPENDING, (eventName, data) => {
        // @ts-ignore
        this.fmp4Data[data.type].push(data.data);
        console.log('BUFFER APPENDING', data);

      });
      hls.on(Hls.Events.BUFFER_EOS, () => {
        console.log('BUFFER EOS', this.fmp4Data);

      });
    }
  }

  static isButtonAttached(videoEl: HTMLElement): boolean {
    return !!videoEl.parentElement
      ?.getElementsByClassName(CommonNames.ButtonClassName)
      .length;
  }

  public async loadHlsScript(): Promise<void> {
    const urls = [chrome.runtime.getURL('assets/js/vendor/hls.min.js')];

    if (this.isHlsScriptLoaded) {
      return Promise.resolve();
    }

    await loadScripts(urls);
    this.isHlsScriptLoaded = true;

    return Promise.resolve();
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
    button.addEventListener('click', this.onClickDownload);
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
