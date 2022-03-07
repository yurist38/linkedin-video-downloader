<template>
  <section class="content">
    <div class="centered">
      <img src="../../assets/icons/icon128.png" />
      <h1 class="title">LinkedIn Video Downloader</h1>
    </div>
    <div class="option">
      <div class="option-title">Button's vertical position:</div>
      <div>
        <it-radio
          v-model="options.buttonPosition.vertical"
          v-on:input="onChangeOption()"
          name="button-position-vertical"
          label="Top"
          value="top"
        />
        <it-radio
          v-model="options.buttonPosition.vertical"
          v-on:input="onChangeOption()"
          name="button-position-vertical"
          label="Bottom"
          value="bottom"
        />
      </div>
    </div>
    <div class="option">
      <div class="option-title">Button's horizontal position:</div>
      <div>
        <it-radio
          v-model="options.buttonPosition.horizontal"
          v-on:input="onChangeOption()"
          name="button-position-horizontal"
          label="Left"
          value="left"
        />
        <it-radio
          v-model="options.buttonPosition.horizontal"
          v-on:input="onChangeOption()"
          name="button-position-horizontal"
          label="Right"
          value="right"
        />
      </div>
    </div>
    <div class="option">
      <div class="option-title">Filename:</div>
      <it-input
        v-model="options.filename"
        v-on:input="onChangeOption()"
        name="filename-input"
        :message="
          !options.filename ? 'Please fill in the filename...' : undefined
        "
        :status="
          !areOptionsChanged
            ? undefined
            : options.filename
              ? 'success'
              : 'danger'
        "
      />
    </div>
    <it-button
      outlined
      class="btn center"
      type="primary"
      :disabled="!areOptionsChanged || !areOptionsValid"
      v-on:click="saveChanges()"
    >
      Save
    </it-button>
  </section>
</template>

<script lang="ts">
import { defaultOptions } from '../constants';
import { Options, CommonNames } from "../types";

export default {
  name: 'OptionsPage',

  data() {
    return {
      options: defaultOptions,
      areOptionsChanged: false,
      areOptionsValid: true,
    };
  },

  created(): void {
    chrome.storage.local.get([CommonNames.OptionsStorageKey], (data) => {
      if (!data || !data[CommonNames.OptionsStorageKey]) {
        return;
      }
      Object.keys(data[CommonNames.OptionsStorageKey]).forEach((key) => {
        this.options[key as keyof Options] =
          data[CommonNames.OptionsStorageKey][key];
      });
    });
  },

  methods: {
    validateOptions(): void {
      this.areOptionsValid = !!this.options.filename;
    },

    onChangeOption(): void {
      this.areOptionsChanged = true;
      this.validateOptions();
    },

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
  },
}
</script>

<style scoped lang="scss">
html, body {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  margin: 0;
  padding: 0;
}

.centered {
  text-align: center;
}

.content {
  padding: 20px;
}

.message {
  font-size: 14px;
  margin: 0 0 10px 0;
}

.it-radio-wrapper {
  margin-bottom: 10px !important;
}

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
