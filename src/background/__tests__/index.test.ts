import { mocked } from 'ts-jest/utils';
import Processor from '../Processor';
import { init, configureScope, Scope } from '@sentry/browser';

jest.mock('../Processor');
jest.mock('@sentry/browser');

const ProcessorMocked = mocked(Processor, false);
const SentryInitMocked = mocked(init, false);
const SentryConfigureScopeMocked = mocked(configureScope, false);

describe('background/index', () => {
  const dsn = 'test-value';

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Processor is initialized', () => {
    jest.isolateModules(() => {
      require('../index');
      expect(ProcessorMocked).toHaveBeenCalledTimes(1);
    });
  });

  it('Initializes Sentry when DSN is provided', () => {
    process.env.SENTRY_DSN = dsn;
    jest.isolateModules(() => {
      require('../index');
      expect(SentryInitMocked).toHaveBeenCalledTimes(1);
      expect(SentryInitMocked).toHaveBeenCalledWith({
        dsn,
        release: `linkedin-video-downloader-ext@${process.env.npm_package_version}`,
        ignoreErrors: [],
      });
      expect(SentryConfigureScopeMocked).toHaveBeenCalledTimes(1);
      const cb = SentryConfigureScopeMocked.mock.calls[0][0];
      const setTag = jest.fn();
      const scope = { setTag };
      cb(scope as unknown as Scope);
      expect(setTag).toHaveBeenCalledTimes(1);
      expect(setTag).toHaveBeenCalledWith('app', 'background');
    });
  });

  it('Does not initialize Sentry when DSN is not provided', () => {
    process.env.SENTRY_DSN = '';
    jest.isolateModules(() => {
      require('../index');
      expect(SentryInitMocked).toHaveBeenCalledTimes(0);
      expect(SentryConfigureScopeMocked).toHaveBeenCalledTimes(0);
    });
  });
});
