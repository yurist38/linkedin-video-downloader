<template>
  <section class="section">
    <div class="container">
      <div class="centered">
        <img src="../../assets/icons/icon128.png" />
        <h1 class="title">LinkedIn Video Downloader</h1>
      </div>
      <b-message
        :closable="false"
        title="Options"
        class="options"
        type="is-primary"
      >
        <div class="option">
          <div class="option-title">Button's vertical position:</div>
          <div>
            <b-radio
              v-model="options.buttonPosition.vertical"
              v-on:input="onChangeOption()"
              name="button-position-vertical"
              native-value="top"
            >
              Top
            </b-radio>
            <b-radio
              v-model="options.buttonPosition.vertical"
              v-on:input="onChangeOption()"
              name="button-position-vertical"
              native-value="bottom"
            >
              Bottom
            </b-radio>
          </div>
        </div>
        <div class="option">
          <div class="option-title">Button's horizontal position:</div>
          <div>
            <b-radio
              v-model="options.buttonPosition.horizontal"
              v-on:input="onChangeOption()"
              name="button-position-horizontal"
              native-value="left"
            >
              Left
            </b-radio>
            <b-radio
              v-model="options.buttonPosition.horizontal"
              v-on:input="onChangeOption()"
              name="button-position-horizontal"
              native-value="right"
            >
              Right
            </b-radio>
          </div>
        </div>
        <div class="option">
          <div class="option-title">Filename:</div>
          <b-field
            :type="
              !areOptionsChanged
                ? undefined
                : options.filename
                ? 'is-success'
                : 'is-danger'
            "
            :message="
              !options.filename ? 'Please fill in the filename...' : undefined
            "
          >
            <b-input
              rounded
              v-model="options.filename"
              v-on:input="onChangeOption()"
              name="filename-input"
            >
            </b-input>
          </b-field>
        </div>
        <b-button
          outlined
          rounded
          class="btn center"
          size="is-medium"
          type="is-primary"
          :disabled="!areOptionsChanged || !areOptionsValid"
          v-on:click="saveChanges()"
        >
          Save
        </b-button>
      </b-message>
      <b-notification :closable="false" type="is-primary">
        Thank you for using LinkedIn Video Downloader! How do you feel about it?
        Maybe you have an idea for improvement or want to report a bug? Please
        consider sending us a feedback message...
      </b-notification>
      <div class="centered">
        <b-button
          class="btn"
          rounded
          outlined
          type="is-primary"
          size="is-large"
          id="feedback-btn"
          :data-az-l="appziId"
          :disabled="!isAppziLoaded"
        >
          Send feedback
        </b-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { defaultOptions } from "../constants";
import { Options, CommonNames } from "../types";

@Component
export default class App extends Vue {
  readonly appziToken = process.env.APPZI_TOKEN;
  readonly appziId = process.env.APPZI_ID;
  options = defaultOptions;
  isAppziLoaded = false;
  areOptionsChanged = false;
  areOptionsValid = true;

  created(): void {
    this.initAppziScript();
    chrome.storage.local.get([CommonNames.OptionsStorageKey], (data) => {
      if (!data || !data[CommonNames.OptionsStorageKey]) {
        return;
      }
      Object.keys(data[CommonNames.OptionsStorageKey]).forEach((key) => {
        this.options[key as keyof Options] =
          data[CommonNames.OptionsStorageKey][key];
      });
    });
  }

  getAppziScriptSrc(): string {
    return `https://w.appzi.io/bootstrap/bundle.js?token=${this.appziToken}`;
  }

  initAppziScript(): void {
    if (!this.appziId || !this.appziToken) {
      throw new Error("Appzi credentials are not provided...");
    }

    const script = document.createElement("script");

    script.src = this.getAppziScriptSrc();
    script.async = true;
    script.onload = () => (this.isAppziLoaded = true);

    document.body.appendChild(script);
  }

  validateOptions(): void {
    this.areOptionsValid = !!this.options.filename;
  }

  onChangeOption(): void {
    if (!this.areOptionsChanged) {
      this.areOptionsChanged = true;
    }

    this.validateOptions();
  }

  saveChanges(): void {
    chrome.storage.local.set(
      {
        [CommonNames.OptionsStorageKey]: this.options,
      },
      () => {
        this.areOptionsChanged = false;
      }
    );
  }
}
</script>

<style scoped lang="scss">
h1.title {
  margin-bottom: 20px;
}

.btn {
  text-transform: uppercase;
  font-weight: 700;
}

.option {
  margin: 0 0 20px;
}

.option-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}
</style>
