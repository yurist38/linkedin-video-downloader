import Vue from 'vue';
import Sentry from '@sentry/browser';

jest.mock('@sentry/browser', () => ({
  init: jest.fn(),
  configureScope: jest.fn(jest.fn()),
}));
jest.mock('equal-vue', () => jest.fn());
jest.mock('vue', () => ({
  createApp: jest.fn(() => ({
    use: jest.fn(() => ({
      mount: jest.fn(),
    }))
  })),
}));
jest.mock('../options.vue', () => 'options');

describe('options/index', () => {
  const dsn = 'test-value';

  beforeAll(() => {
    const appEl = document.createElement('div');
    appEl.id = 'options';
    document.body.appendChild(appEl);
  });

  afterEach(() => {
    (Sentry.init as jest.MockedFn<any>).mockReset();
  });

  it('Should create an instance of Vue', () => {
    jest.isolateModules(() => {
      require('../index');
      expect(Vue.createApp).toHaveBeenCalledTimes(1);
      expect(Vue.createApp).toHaveBeenCalledWith('options');
    });
  });

  it('Should not initialize Sentry if DSN is not provided', () => {
    process.env.SENTRY_DSN = '';
    jest.isolateModules(() => {
      require('../index');
      expect(Sentry.init).toHaveBeenCalledTimes(0);
      expect(Sentry.configureScope).toHaveBeenCalledTimes(0);
    });
  });

  it('Should initialize Sentry if DSN is provided', () => {
    process.env.SENTRY_DSN = dsn;
    jest.isolateModules(() => {
      require('../index');
      expect(Sentry.init).toHaveBeenCalledTimes(1);
      expect(Sentry.init).toHaveBeenCalledWith({
        dsn,
        release: `linkedin-video-downloader-ext@${process.env.npm_package_version}`,
      });
      expect(Sentry.configureScope).toHaveBeenCalledTimes(1);
      const cb = (Sentry.configureScope as jest.Mock).mock.calls[0][0];
      const setTag = jest.fn();
      const scope = { setTag };
      cb(scope as unknown as Sentry.Scope);
      expect(setTag).toHaveBeenCalledTimes(1);
      expect(setTag).toHaveBeenCalledWith('app', 'options');
    });
  });
});
