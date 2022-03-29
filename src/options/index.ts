import { init, configureScope } from '@sentry/browser';
import { createApp } from 'vue';
import Equal from 'equal-vue';
import Options from './options.vue';
import 'equal-vue/dist/style.css';

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: `linkedin-video-downloader-ext@${process.env.APP_VERSION}`,
  });
  configureScope((scope) => {
    scope.setTag('app', 'options');
  });
}

// eslint-disable-next-line
// @ts-ignore
createApp(Options).use(Equal).mount('#app');
