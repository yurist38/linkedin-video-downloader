import { mocked } from 'ts-jest/utils';
import Page from '../Page';
import { init, configureScope, Scope } from '@sentry/browser';

jest.mock('../Page');
jest.mock('@sentry/browser');

const PageMocked = mocked(Page, false);
const SentryInitMocked = mocked(init, false);
const SentryConfigureScopeMocked = mocked(configureScope, false);

describe('content/index', () => {
  const dsn = 'test-value';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Should create an instance of Page class', () => {
    process.env.SENTRY_DSN = '';
    jest.isolateModules(() => {
      require('../index');
      expect(PageMocked).toHaveBeenCalledTimes(1);
    });
  });

  it('Should not initialize Sentry if DSN is not provided', () => {
    process.env.SENTRY_DSN = '';
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
      expect(setTag).toHaveBeenCalledWith('app', 'content');
    });
  });
});
