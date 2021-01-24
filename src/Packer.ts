import fs from 'fs';
import path from 'path';
import pako from 'pako';
import { Resource } from './types';

// HTML placeholder
enum PlaceHolder {
  Title = '${title}', // html title
  Style = '${style}', // html style
  Orientation = '${orientation}', // html orientation
  Compressed = '${compressed}',
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

  patch(
    title: string,
    orientation = 'portrait',
    useCompress?: boolean,
  ): string {
    let { html } = this._data;
    html = html.replace(PlaceHolder.Title, title);
    const regex = new RegExp(`\\${PlaceHolder.Orientation}`, 'g');
    html = html.replace(regex, orientation); // replaceAll not supports

    const { style, settings, internalJS, mainJS } = this._data;
    let { assets, engineJS, js } = this._data;

    // Style
    let res = html.replace(PlaceHolder.Style, this._getStyleTag(style));

    // Compressed
    let compressed = '';
    if (useCompress) {
      // Compress assets, engineJS and js
      const uncompressed = JSON.stringify({ assets, engineJS, js });
      // Remove uncompress data to remove placeholder
      assets = {};
      engineJS = '';
      js = '';
      // Compress to base64
      compressed = `window.compressed=\`${Buffer.from(
        pako.deflate(uncompressed),
      ).toString('base64')}\`;\n`;

      // Pako source
      const inflateJS = fs.readFileSync(
        path.join(__dirname, '../node_modules/pako/dist/pako_inflate.js'),
      );
      compressed += inflateJS;
    }
    res = res.replace(PlaceHolder.Compressed, this._getJSTag(compressed));

    // Assets
    res = res.replace(
      PlaceHolder.Assets,
      this._getJSTag(`window.assets=${JSON.stringify(assets)};\n`),
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

  private _getHTMLTag(tag: string, value?: string): string {
    if (!value || value.length === 0) return '';
    return `<${tag}>\n${value}</${tag}>`;
  }

  private _getJSTag(value?: string): string {
    return this._getHTMLTag('script', value);
  }

  private _getStyleTag(value?: string): string {
    return this._getHTMLTag('style', value);
  }
}
