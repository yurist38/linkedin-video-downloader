import Processor from './Processor';
import { init, configureScope } from '@sentry/browser';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: `linkedin-video-downloader-ext@${process.env.APP_VERSION}`,
    ignoreErrors: [],
  });
  configureScope((scope) => {
    scope.setTag('app', 'background');
  });
}

new Processor();
