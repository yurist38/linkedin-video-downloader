import { init, configureScope } from '@sentry/browser';
import Vue from 'vue';
import App from './app.vue';
import Buefy from 'buefy';
import './index.scss';

Vue.use(Buefy);

if (process.env.SENTRY_DSN) {
  init({
    dsn: process.env.SENTRY_DSN,
    release: `linkedin-video-downloader-ext@${process.env.npm_package_version}`,
  });
  configureScope((scope) => {
    scope.setTag('app', 'options');
  });
}

new Vue({
  el: '#app',
  render: h => h(App)
});
