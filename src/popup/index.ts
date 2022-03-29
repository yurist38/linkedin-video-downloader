import { init, configureScope } from '@sentry/browser';
import { createApp } from 'vue';
import Equal from 'equal-vue';
import Popup from './popup.vue';
import 'equal-vue/dist/style.css';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: `linkedin-video-downloader-ext@${process.env.APP_VERSION}`,
  });
  configureScope((scope) => {
    scope.setTag('app', 'popup');
  });
}

// eslint-disable-next-line
// @ts-ignore
createApp(Popup).use(Equal).mount('#popup');
