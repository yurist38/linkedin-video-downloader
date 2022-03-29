import Page from './Page';
import { init, configureScope } from '@sentry/browser';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: `linkedin-video-downloader-ext@${process.env.APP_VERSION}`,
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      't8 is not defined',
      'Extension context invalidated'
    ],
  });
  configureScope((scope) => {
    scope.setTag('app', 'content');
  });
}

new Page();
