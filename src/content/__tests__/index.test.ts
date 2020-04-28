import { mocked } from 'ts-jest/utils';
import Page from '../Page';

jest.mock('../Page');
jest.mock('@sentry/browser');

const PageMocked = mocked(Page, false);

describe('content/index', () => {
  afterEach(() => {
    jest.resetModules();
    process.env.SENTRY_DSN = '';
  });

  it('Should create an instance of Page class', async () => {
    await import('../index');
    expect(PageMocked.mock.calls).toHaveLength(1);
  });

  it('Should not call init function if SENTRY_DSN is not set', async () => {
    const { init } = require('@sentry/browser'); // eslint-disable-line
    const initMocked = mocked(init);
    await import('../index');
    expect(initMocked.mock.calls).toHaveLength(0);
  });

  it('Should call init function if SENTRY_DSN is set', async () => {
    process.env.SENTRY_DSN = 'test-value';
    const { init } = require('@sentry/browser'); // eslint-disable-line
    const initMocked = mocked(init);
    await import('../index');
    expect(initMocked.mock.calls).toHaveLength(1);
  });
});
