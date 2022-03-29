import Page from '../Page';
import Sentry from '@sentry/browser';

jest.mock('../Page', () => jest.fn());
jest.mock('@sentry/browser', () => ({
  init: jest.fn(),
  configureScope: jest.fn(jest.fn()),
}));

describe('content/index', () => {
  const dsn = 'test-value';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should create an instance of Page class', () => {
    process.env.SENTRY_DSN = '';
    jest.isolateModules(() => {
      require('../index');
      expect(Page).toHaveBeenCalledTimes(1);
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
        release: `linkedin-video-downloader-ext@${process.env.APP_VERSION}`,
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          't8 is not defined',
          'Extension context invalidated'
        ],
      });
      expect(Sentry.configureScope).toHaveBeenCalledTimes(1);
      const cb = Sentry.configureScope.mock.calls[0][0];
      const setTag = jest.fn();
      const scope = { setTag };
      cb(scope as unknown as Sentry.Scope);
      expect(setTag).toHaveBeenCalledTimes(1);
      expect(setTag).toHaveBeenCalledWith('app', 'content');
    });
  });
});
