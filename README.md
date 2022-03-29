# linkedin-video-downloader

Google Chrome extension for downloading videos from LinkedIn.

[Chrome Web Store](https://chrome.google.com/webstore/detail/linkedin-video-downloader/jphfcmjmlcoecehbanbbfgonpapcnjdi)

IMPORTANT: unfortunately, this extension got blocked on Chrome Web Store. You can download the built extension file from [here](https://raw.githubusercontent.com/yurist38/linkedin-video-downloader/master/dist/linkedin-video-downloader.crx) and install it manually by dropping it to the Extensions page open in your Google Chrome. Sadly, this approach won't work right away either, because Chrome currently doesn't allow to enable extensions that are not whitelisted on the Web Store. Although, there are some tricks to hack it, if you want please try them on your own risk.

## Download extension

* [linkedin-video-downloader.crx](https://raw.githubusercontent.com/yurist38/linkedin-video-downloader/master/dist/linkedin-video-downloader.crx)

## Preview

![preview](preview.gif)

## Development

1. Install dependencies with `npm ci`
2. Create `.env` configuration file based on `.env.example`
3. Make a build with `npm run build` command
4. Install the extenstion using development mode from the `./build` folder directly

## Contribution

If you spotted any issue or have an idea how to improve the extension feel free to open an issue.

## Support project

<a href="https://www.buymeacoffee.com/roomjs" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
