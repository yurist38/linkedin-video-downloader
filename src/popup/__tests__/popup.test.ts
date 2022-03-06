import { shallowMount, mount, VueWrapper, config } from '@vue/test-utils';
import Popup from '../popup.vue';

config.global.components = {
  'it-button': {
    template: '<div>it-button</div>',
  },
  'it-divider': {
    template: '<div>it-divider</div>',
  },
};

describe('popup/popup', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    chrome.runtime.openOptionsPage = jest.fn();
    chrome.tabs.create = jest.fn();
  });

  it('Should render correctly', () => {
    wrapper = mount(Popup);

    expect(wrapper.element).toMatchSnapshot();
  });

  it('Should open settings page', async () => {
    wrapper = mount(Popup);

    await wrapper.find('#settings-btn').trigger('click');
    expect(chrome.runtime.openOptionsPage).toHaveBeenCalledTimes(1);
  });

  it('Should open donate page', async () => {
    wrapper = mount(Popup);

    await wrapper.find('#donate-btn').trigger('click');
    expect(chrome.tabs.create).toHaveBeenCalledTimes(1);
    expect(chrome.tabs.create).toHaveBeenCalledWith({ url: 'https://www.buymeacoffee.com/roomjs' });
  });
});
