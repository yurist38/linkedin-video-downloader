import { chrome } from 'jest-chrome';
import Processor from '../Processor';
import { Actions, CommonNames } from '../../types';
import { defaultOptions } from '../../constants';

describe('background/Processor', () => {
  let instance: Processor; // eslint-disable-line

  beforeAll(() => {
    chrome.webNavigation.onCompleted.addListener = jest.fn();
    chrome.runtime.onMessage.addListener = jest.fn();
    chrome.storage.local.get = jest.fn();
  });

  beforeEach(() => {
    instance = new Processor();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('constructor is initialized correctly', () => {
    expect(chrome.webNavigation.onCompleted.addListener).toHaveBeenCalledTimes(1);
    expect(chrome.webNavigation.onCompleted.addListener).toHaveBeenCalledWith(Processor.onNavigationCompleted);
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalledWith(Processor.onMessage);
  });

  it('Processor.downloadVideo start downloading video using the default filename if it is not set', () => {
    const url = 'test-url';
    Processor.downloadVideo(url);
    chrome.storage.local.get.mock.calls[0][1]({});
    expect(chrome.downloads.download).toHaveBeenCalledTimes(1);
    expect(chrome.downloads.download.mock.calls[0][0].url).toEqual(url);
    expect(chrome.downloads.download.mock.calls[0][0].filename).toEqual(defaultOptions.filename + '.mp4');
  });

  it('Processor.downloadVideo start downloading video using the saved filename', () => {
    const url = 'test-url';
    Processor.downloadVideo(url);
    chrome.storage.local.get.mock.calls[0][1]({
      [CommonNames.OptionsStorageKey]: {
        filename: 'test-filename'
      }
    });
    expect(chrome.downloads.download).toHaveBeenCalledTimes(1);
    expect(chrome.downloads.download.mock.calls[0][0].url).toEqual(url);
    expect(chrome.downloads.download.mock.calls[0][0].filename).toEqual('test-filename.mp4');
  });

  it('Processor.onMessage trigger downloading when action is download and url is passed', () => {
    Processor.downloadVideo = jest.fn();
    const url = 'test-url';
    Processor.onMessage({ url, action: Actions.Download });
    expect(Processor.downloadVideo).toHaveBeenCalledTimes(1);
  });

  it('Processor.onMessage does not trigger downloading when action is download but url is missing', () => {
    Processor.downloadVideo = jest.fn();
    Processor.onMessage({ action: Actions.Download });
    expect(Processor.downloadVideo).toHaveBeenCalledTimes(0);
  });

  it('Processor.onNavigationCompleted execute tabs query and attaches the callback function', () => {
    Processor.onNavigationCompleted();
    expect(chrome.tabs.query).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.query.mock.calls[0][0]).toMatchObject({ active: true, currentWindow: true });
    expect(chrome.tabs.query.mock.calls[0][1]).toEqual(Processor.tabsQueryCallback);
  });

  it('Processor.tabsQueryCallback does not send message if tab is missing', () => {
    Processor.tabsQueryCallback([]);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(0);
  });

  it('Processor.tabsQueryCallback does not send message if tab ID is missing', () => {
    Processor.tabsQueryCallback([{} as chrome.tabs.Tab]);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(0);
  });

  it('Processor.tabsQueryCallback sends the message if tab is existing', () => {
    Processor.tabsQueryCallback([{ id: 1 } as chrome.tabs.Tab]);
    expect(chrome.tabs.sendMessage).toHaveBeenCalledTimes(1);
  });
});
