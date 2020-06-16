import { VueConstructor } from 'vue';
import { shallowMount, mount, createLocalVue, Wrapper } from '@vue/test-utils';
import App from '../app.vue';

describe('options/app', () => {
  let localVue: VueConstructor;
  let wrapper: Wrapper<App>;

  beforeEach(() => {
    localVue = createLocalVue();
  });

  it('Should render correctly', () => {
    process.env.APPZI_TOKEN = 'test-value';
    process.env.APPZI_ID = 'test-value';

    wrapper = mount(App, {
      localVue,
      stubs: ['b-button']
    });

    expect(wrapper.element).toMatchSnapshot();

    const script = document.body.querySelector('script[src*="test-value"]') as HTMLScriptElement;
    (script.onload as Function)();
    expect(wrapper.vm.$data.appziLoaded).toEqual(true);
  });

  it('Should throw an error when appzi token is not provided', () => {
    process.env.APPZI_TOKEN = '';

    expect(() => shallowMount(App, {
      localVue,
      stubs: ['b-button']
    })).toThrowError('Appzi credentials are not provided...');
  });

  it('Should throw an error when appzi id is not provided', () => {
    process.env.APPZI_ID = '';

    expect(() => shallowMount(App, {
      localVue,
      stubs: ['b-button']
    })).toThrowError('Appzi credentials are not provided...');
  });
});
