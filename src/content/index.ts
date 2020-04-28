import Page from './Page';
import { init } from '@sentry/browser';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: `linkedin-video-downloader-ext@${process.env.npm_package_version}`,
  });
}

new Page();
