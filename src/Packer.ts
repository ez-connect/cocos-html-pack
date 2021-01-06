import { Resource } from './types';

class Packer {
  _data?: Resource;

  load(value: Resource, title?: string, titleHolder = '${title}') {
    this._data = value;
    if (title) {
      this._data.html = this._data.html.replace(titleHolder, title);
    }
  }

  patch(
    styleHolder = '${style}',
    assetsHolder = '${assets}',
    settingsHolder = '${settings.js}',
    engineJSHolder = '${cocos2d-js-min.js}',
    internaJSlHolder = '${assets/internal/index.js}',
    mainJSHolder = '${main.js}',
    jsHolder = '${assets/main/index.js}',
  ): string {
    if (!this._data) {
      throw new Error('No resouces found');
    }

    const {
      html,
      style,
      assets,
      settings,
      engineJS,
      internalJS,
      mainJS,
      js,
    } = this._data;

    // Style
    let res = html.replace(styleHolder, `<style>\n${style}</style>`);
    // Assets
    res = res.replace(
      assetsHolder,
      `<script>\nwindow.assets=${JSON.stringify(assets)}\n</script>`,
    );
    // Settings
    res = res.replace(settingsHolder, `<script>\n${settings}</script>`);
    // Engine
    res = res.replace(engineJSHolder, `<script>\n${engineJS}</script>`);
    // Internal
    res = res.replace(internaJSlHolder, `<script>\n${internalJS}</script>`);
    // Main
    res = res.replace(mainJSHolder, `<script>\n${mainJS}</script>`);
    // JS
    res = res.replace(jsHolder, `<script>\n${js}</script>`);

    return res;
  }
}

const singleton = new Packer();
export { singleton as Packer };
