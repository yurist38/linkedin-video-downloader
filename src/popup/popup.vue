<template>
  <section class="content">
    <h1>LinkedIn Video Downloader</h1>
    <p>The extension is running in background. In order to use it just go to LinkedIn website and look for a download
      icon in the corner of every video (you can change the corner in the settings).</p>
    <it-divider />
    <p><i>This is a free <a href="https://github.com/yurist38/linkedin-video-downloader" target="_blank">open source</a> project.
    You can support it <a href="https://www.buymeacoffee.com/roomjs" target="_blank">here</a>. Every donation is appreciated. Thank you!</i></p>

    <div class="btn-container">
      <it-button
        outlined
        type="black"
        id="settings-btn"
        v-on:click="openSettings()"
      >
        Settings
      </it-button>
      <it-button
        outlined
        type="primary"
        id="donate-btn"
        v-on:click="openSupportPage()"
      >
        Donate
      </it-button>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'PopupPage',

  data() {
    return {};
  },

  methods: {
    openSettings(): void {
      chrome.runtime.openOptionsPage();
    },
    openSupportPage(): void {
      chrome.tabs.create({ url: 'https://www.buymeacoffee.com/roomjs' });
    }
  }
}
</script>

<style scoped lang="scss">
h1 {
  font-size: 18px;
  font-weight: 600;
}

.content {
  padding: 5px;
  width: 250px;
  font-size: 14px;
  line-height: 18px;
}

.btn-container {
  margin-top: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
