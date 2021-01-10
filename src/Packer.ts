import { Resource } from './types';

// HTML placeholder
enum PlaceHolder {
  Title = '${title}', // html title
  Style = '${style}', // html style
  Orientation = '${orientation}', // html orientation
  Assets = '${assets}', // all assets
  Settings = '${settings.js}',
  EngineJS = '${cocos2d-js-min.js}',
  InternaJS = '${assets/internal/index.js}',
  // ResouceJS = '${resources/index.js}', // the same internal js
  MainJS = '${main.js}',
  ProjectJS = '${assets/main/index.js}', // assets/scripts bundle
}

export class Packer {
  _data: Resource;

  constructor(value: Resource) {
    this._data = value;
  }

  patch(title: string, orientation = 'portrait'): string {
    let { html } = this._data;
    html = html.replace(PlaceHolder.Title, title);
    const regex = new RegExp(`\\${PlaceHolder.Orientation}`, 'g');
    html = html.replace(regex, orientation); // replaceAll not supports

    const {
      style,
      assets,
      settings,
      engineJS,
      internalJS,
      mainJS,
      js,
    } = this._data;

    // Style
    let res = html.replace(PlaceHolder.Style, this._getStyleTag(style));
    // Assets
    res = res.replace(
      PlaceHolder.Assets,
      this._getJSTag(`window.assets=${JSON.stringify(assets)}\n`),
    );
    // Settings
    res = res.replace(PlaceHolder.Settings, this._getJSTag(settings));
    // Engine
    res = res.replace(PlaceHolder.EngineJS, this._getJSTag(engineJS));
    // Internal
    res = res.replace(PlaceHolder.InternaJS, this._getJSTag(internalJS));
    // Main
    res = res.replace(PlaceHolder.MainJS, this._getJSTag(mainJS));
    // JS
    res = res.replace(PlaceHolder.ProjectJS, this._getJSTag(js));

    return res;
  }

  private _getHTMLTag(tag: string, value: string): string {
    return `<${tag}>\n${value}</${tag}>`;
  }

  private _getJSTag(value: string): string {
    return this._getHTMLTag('script', value);
  }

  private _getStyleTag(value: string): string {
    return this._getHTMLTag('style', value);
  }
}
