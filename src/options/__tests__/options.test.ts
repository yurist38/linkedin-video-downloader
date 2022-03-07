import { mount, VueWrapper, config } from '@vue/test-utils';
import Options from '../options.vue';
import { CommonNames } from '../../types';
import { defaultOptions } from '../../constants';

config.global.components = {
  'it-button': {
    template: '<div>it-button</div>',
  },
  'it-radio': {
    template: '<div>it-radio</div>',
  },
  'it-divider': {
    template: '<div>it-divider</div>',
  },
  'it-input': {
    template: '<div>it-input</div>',
  }
};

describe('options/options', () => {
  let wrapper: VueWrapper;

  beforeAll(() => {
    chrome.storage.local.get = jest.fn();
    chrome.storage.local.set = jest.fn();
  });

  it('Should render correctly', () => {
    wrapper = mount(Options);

    expect(wrapper.element).toMatchSnapshot();

    expect(chrome.storage.local.get).toHaveBeenCalledTimes(1);
    expect((chrome.storage.local.get as jest.Mock).mock.calls[0][0])
      .toEqual([CommonNames.OptionsStorageKey]);
    expect(wrapper.vm.$data.options).toEqual(defaultOptions);
    expect(wrapper.vm.$data.areOptionsChanged).toEqual(false);

    (chrome.storage.local.get as jest.Mock).mock.calls[0][1]();
    expect(wrapper.vm.$data.options).toEqual(defaultOptions);

    (chrome.storage.local.get as jest.Mock).mock.calls[0][1]({});
    expect(wrapper.vm.$data.options).toEqual(defaultOptions);

    (chrome.storage.local.get as jest.Mock).mock.calls[0][1]({
      [CommonNames.OptionsStorageKey]: {
        key: 'value'
      },
    });
    expect(wrapper.vm.$data.options.key).toEqual('value');

    wrapper.vm.saveChanges();
    (chrome.storage.local.set as jest.Mock).mock.calls[0][1]();
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.areOptionsChanged).toEqual(false);
  });

  it('Should set form to invalid state when the filename is empty', () => {
    process.env.APPZI_TOKEN = 'test-value';
    process.env.APPZI_ID = 'test-value';

    wrapper = mount(Options);

    wrapper.vm.onChangeOption();
    expect(wrapper.vm.$data.areOptionsChanged).toEqual(true);
    expect(wrapper.vm.$data.areOptionsValid).toEqual(true);
  });
});
