import Page from './Page';
import * as Sentry from '@sentry/browser';

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

new Page();
