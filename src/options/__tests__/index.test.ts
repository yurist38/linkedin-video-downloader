import Vue from 'vue';
import { mocked } from 'ts-jest/utils';
import { init, configureScope, Scope } from '@sentry/browser';
import Buefy from 'buefy';

jest.mock('@sentry/browser');
jest.mock('vue');
jest.mock('../app.vue', () => jest.fn(() => 'app'));

Vue.use = jest.fn();

const SentryInitMocked = mocked(init, false);
const SentryConfigureScopeMocked = mocked(configureScope, false);

describe('options/index', () => {
  const dsn = 'test-value';

  beforeAll(() => {
    const appEl = document.createElement('div');
    appEl.id = 'app';
    document.body.appendChild(appEl);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should create an instance of Vue', () => {
    jest.isolateModules(() => {
      require('../index');
      expect(Vue.use).toHaveBeenCalledTimes(1);
      expect(Vue.use).toHaveBeenCalledWith(Buefy);
      expect(Vue).toHaveBeenCalledTimes(1);
      const renderFn = jest.fn();
      (Vue as unknown as jest.Mock).mock.calls[0][0].render(renderFn);
      expect(renderFn).toHaveBeenCalledTimes(1);
      expect(renderFn.mock.calls[0][0]()).toEqual('app');
    });
  });

  it('Should not initialize Sentry if DSN is not provided', () => {
    jest.isolateModules(() => {
      require('../index');
      expect(SentryInitMocked).toHaveBeenCalledTimes(0);
      expect(SentryConfigureScopeMocked).toHaveBeenCalledTimes(0);
    });
  });

  it('Should initialize Sentry if DSN is provided', () => {
    process.env.SENTRY_DSN = dsn;
    jest.isolateModules(() => {
      require('../index');
      expect(SentryInitMocked).toHaveBeenCalledTimes(1);
      expect(SentryInitMocked).toHaveBeenCalledWith({
        dsn,
        release: `linkedin-video-downloader-ext@${process.env.npm_package_version}`,
      });
      expect(SentryConfigureScopeMocked).toHaveBeenCalledTimes(1);
      const cb = SentryConfigureScopeMocked.mock.calls[0][0];
      const setTag = jest.fn();
      const scope = { setTag };
      cb(scope as unknown as Scope);
      expect(setTag).toHaveBeenCalledTimes(1);
      expect(setTag).toHaveBeenCalledWith('app', 'options');
    });
  });
});
