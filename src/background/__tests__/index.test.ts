import Sentry from '@sentry/browser';
import Processor from '../Processor';

jest.mock('@sentry/browser', () => ({
  init: jest.fn(),
  configureScope: jest.fn(jest.fn()),
}));
jest.mock('../Processor', () => jest.fn());

describe('background/index', () => {
  const dsn = 'test-value';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Processor is initialized', () => {
    jest.isolateModules(() => {
      require('../index');
      expect(Processor).toHaveBeenCalledTimes(1);
    });
  });

  it('Initializes Sentry when DSN is provided', () => {
    process.env.SENTRY_DSN = dsn;
    jest.isolateModules(() => {
      require('../index');
      expect(Sentry.init).toHaveBeenCalledTimes(1);
      expect(Sentry.init).toHaveBeenCalledWith({
        dsn,
        release: `linkedin-video-downloader-ext@${process.env.npm_package_version}`,
        ignoreErrors: [],
      });
      expect(Sentry.configureScope).toHaveBeenCalledTimes(1);
      const cb = Sentry.configureScope.mock.calls[0][0];
      const setTag = jest.fn();
      const scope = { setTag };
      cb(scope as unknown as Sentry.Scope);
      expect(setTag).toHaveBeenCalledTimes(1);
      expect(setTag).toHaveBeenCalledWith('app', 'background');
    });
  });

  it('Does not initialize Sentry when DSN is not provided', () => {
    process.env.SENTRY_DSN = '';
    jest.isolateModules(() => {
      require('../index');
      expect(Sentry.init).toHaveBeenCalledTimes(0);
      expect(Sentry.configureScope).toHaveBeenCalledTimes(0);
    });
  });
});
