import { mocked } from 'ts-jest/utils';
import { chrome } from '@bumble/jest-chrome';
import { debounce } from 'ts-debounce';
import Page from '../Page';
import { Actions } from '../../types';

jest.mock('ts-debounce');
const debounceMocked = mocked(debounce, false).mockReturnValue(jest.fn());

describe('content/Page', () => {
  let instance: Page;

  beforeAll(() => {
    chrome.runtime.onMessage.addListener = jest.fn();
    MutationObserver.prototype.observe = jest.fn();
  });

  beforeEach(() => {
    instance = new Page();
  });

  it('Properties and constructor are initialized properly', () => {
    expect(Page.buttonClassName).toEqual('linkedin-video-downloader-btn');
    expect(debounceMocked).toHaveBeenCalledTimes(1);
    expect(debounceMocked.mock.calls[0][0]).toEqual(instance.observerCallback);
    expect(debounceMocked.mock.calls[0][1]).toEqual(1000);
    expect(instance.observer).toBeInstanceOf(MutationObserver);
    expect(instance.observer.observe).toHaveBeenCalledTimes(1);
    expect(instance.observer.observe).toHaveBeenCalledWith(window.document, {
      childList: true,
      subtree: true,
    });
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);
  });

  it('observerCallback triggers processing all video elements', () => {
    instance.processAllVideos = jest.fn();
    instance.observerCallback();
    expect(instance.processAllVideos).toHaveBeenCalledTimes(1);
  });

  it('Page.createDownloadButton returns a correct element', () => {
    const el = Page.createDownloadButton();
    expect(el).toMatchSnapshot();
  });

  it('Page.onClickDownload is not sending message when url is missing', () => {
    const event = new MouseEvent('test-event');
    Object.defineProperty(event, 'currentTarget', { value: instance.buttonElement });
    Page.onClickDownload(event);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(0);
  });

  it('Page.onClickDownload is sending message when url is defined', () => {
    const event = new MouseEvent('test-event');
    const url = 'test-url';
    instance.buttonElement.dataset['videoUrl'] = url;
    Object.defineProperty(event, 'currentTarget', { value: instance.buttonElement });
    Page.onClickDownload(event);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: Actions.Download, url });
  });

  it('Page.isButtonAttached returns true if the element has the download button already', () => {
    const containerEl = document.createElement('div');
    const videoEl = document.createElement('video');
    const buttonEl = document.createElement('button');
    buttonEl.classList.add(Page.buttonClassName);
    containerEl.appendChild(videoEl);
    containerEl.appendChild(buttonEl);
    expect(Page.isButtonAttached(videoEl)).toEqual(true);
  });

  it('Page.isButtonAttached returns false if the element has no download button', () => {
    const el = document.createElement('div');
    expect(Page.isButtonAttached(el)).toEqual(false);
  });

  it('processAllVideos executes correctly', () => {
    instance.attachButton = jest.fn();
    const el1 = document.createElement('video');
    const el2 = document.createElement('video');
    document.body.appendChild(el1);
    document.body.appendChild(el2);
    Page.isButtonAttached = jest.fn((el) => el === el1);
    instance.processAllVideos();
    expect(instance.attachButton).toHaveBeenCalledTimes(1);
    expect(Page.isButtonAttached).toHaveBeenCalledTimes(2);
  });

  it('attachButton appends the button to the parent element', () => {
    const video = document.createElement('video');
    const container = document.createElement('div');
    container.appendChild(container.appendChild(video));
    instance.attachButton(video);
    expect(container.getElementsByClassName(Page.buttonClassName)).toHaveLength(1);
  });

  it('onMessage reacts on AddButtons action', () => {
    instance.processAllVideos = jest.fn();
    instance.onMessage({ action: Actions.AddButtons });
    expect(instance.processAllVideos).toHaveBeenCalledTimes(1);
  });
});