import { VueConstructor } from 'vue';
import { shallowMount, mount, createLocalVue, Wrapper } from '@vue/test-utils';
import App from '../app.vue';
import { CommonNames } from '../../types';
import { defaultOptions } from '../../constants';

describe('options/app', () => {
  let localVue: VueConstructor;
  let wrapper: Wrapper<App>;
  const stubs = ['b-button', 'b-notification', 'b-message', 'b-radio', 'b-field', 'b-input'];

  beforeAll(() => {
    chrome.storage.local.get = jest.fn();
    chrome.storage.local.set = jest.fn();
  });

  beforeEach(() => {
    localVue = createLocalVue();
  });

  it('Should render correctly', () => {
    process.env.APPZI_TOKEN = 'test-value';
    process.env.APPZI_ID = 'test-value';

    wrapper = mount(App, {
      localVue,
      stubs,
    });

    expect(wrapper.element).toMatchSnapshot();

    const script = document.body.querySelector('script[src*="test-value"]') as HTMLScriptElement;
    (script.onload as Function)();
    expect(wrapper.vm.$data.isAppziLoaded).toEqual(true);
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

    // @ts-ignore
    wrapper.vm.saveChanges();
    (chrome.storage.local.set as jest.Mock).mock.calls[0][1]();
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$data.areOptionsChanged).toEqual(false);
  });

  it('Should throw an error when appzi token is not provided', () => {
    process.env.APPZI_TOKEN = '';

    expect(() => shallowMount(App, {
      localVue,
      stubs,
    })).toThrowError('Appzi credentials are not provided...');
  });

  it('Should throw an error when appzi id is not provided', () => {
    process.env.APPZI_ID = '';

    expect(() => shallowMount(App, {
      localVue,
      stubs,
    })).toThrowError('Appzi credentials are not provided...');
  });

  it('Should set form to invalid state when the filename is empty', () => {
    process.env.APPZI_TOKEN = 'test-value';
    process.env.APPZI_ID = 'test-value';

    wrapper = mount(App, {
      localVue,
      stubs,
    });

    // @ts-ignore
    wrapper.vm.onChangeOption();
    expect(wrapper.vm.$data.areOptionsChanged).toEqual(true);
    expect(wrapper.vm.$data.areOptionsValid).toEqual(true);
  });
});
