<template>
  <section class="section">
    <div class="container">
      <div class="centered">
        <img src="../../assets/icons/icon128.png" />
        <h1 class="title">LinkedIn Video Downloader</h1>
      </div>
      <div class="notification info-text">
        <p>
          Thank you for using LinkedIn Video Downloader!
          How do you feel about it? Maybe you have an idea for improvement or want to report a bug?
          Please consider sending us a feedback message...
        </p>
      </div>
      <div class="centered">
        <b-button
          class="feedback-btn is-outlined"
          rounded
          type="is-primary"
          size="is-large"
          id="feedback-btn"
          :data-az-l="appziId"
          :disabled="!appziLoaded"
        >
          Send feedback
        </b-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class App extends Vue {
  readonly appziToken = process.env.APPZI_TOKEN;
  readonly appziId = process.env.APPZI_ID;
  appziLoaded = false;

  created(): void {
    this.initAppziScript();
  }

  getAppziScriptSrc(): string {
    return `https://w.appzi.io/bootstrap/bundle.js?token=${this.appziToken}`;
  }

  initAppziScript(): void {
    if (!this.appziId || !this.appziToken) {
      throw new Error('Appzi credentials are not provided...');
    }

    const script = document.createElement('script');

    script.src = this.getAppziScriptSrc();
    script.async = true;
    script.onload = () => this.appziLoaded = true;

    document.body.appendChild(script);
  }
}
</script>

<style scoped lang="scss">
  .info-text {
    margin: 40px 0 !important;
  }
  .feedback-btn {
    text-transform: uppercase;
    font-weight: 700;
  }
</style>