import fs from 'fs';
import path from 'path';
import pako from 'pako';
import { MapString } from './types';

// Asset keys
enum DataKeys {
  Html = '/index.html',
  Style = '/style.css',
  Polyfills = '/polyfills.bundle.js',
  SystemJS = '/src/system.bundle.js',
  ImportMapJS = '/src/import-map.json',
  EngineJS = '/cocos-js/cc.js',
}

const kPathAssets = '/assets';

export class Packer {
  _data: MapString;

  constructor(value: MapString) {
    this._data = value;
  }

  patch(
    title: string,
    orientation = 'portrait',
    useCompress?: boolean,
  ): string {
    let html = this._data[DataKeys.Html];
    html = html.replace('${title}', title);
    const regex = new RegExp('${orientation}', 'g');
    html = html.replace(regex, orientation); // replaceAll not supports

    // Style
    const style = this._data[DataKeys.Style];
    html = html.replace(this._getHTMLHolder(DataKeys.Style), this._getStyleTag(style));

    // Assets
    const assets: MapString = {};
    for (const [k, v] of Object.entries(this._data)) {
      if (k.startsWith(kPathAssets)) {
        assets[k] = v;
      }
    }
    html = html.replace('${assets}', this._getJSTag(`window.assets=${JSON.stringify(assets)};\n`));

    // Replace
    for (const [_, v] of Object.entries(DataKeys)) {
      console.log(this._getHTMLHolder(v));
      console.log(v != null);
      html = html.replace(this._getHTMLHolder(v), this._data[v]);
    }


    // // Assets
    // res = res.replace(
    //   PlaceHolder.Assets,
    //   this._getJSTag(`window.assets=${JSON.stringify(assets)};\n`),
    // );
    // // Settings
    // res = res.replace(PlaceHolder.Settings, this._getJSTag(settings));
    // // Engine
    // res = res.replace(PlaceHolder.EngineJS, this._getJSTag(engineJS));
    // // Internal
    // res = res.replace(PlaceHolder.InternaJS, this._getJSTag(internalJS));
    // // Main
    // res = res.replace(PlaceHolder.MainJS, this._getJSTag(mainJS));
    // // JS
    // res = res.replace(PlaceHolder.ProjectJS, this._getJSTag(js));

    // // const { style, settings, internalJS, mainJS } = this._data;
    // // let { assets, engineJS, js } = this._data;

    // // Style
    // let res = html.replace(PlaceHolder.Style, this._getStyleTag(style));

    // // Compressed
    // let compressed = '';
    // if (useCompress) {
    //   // Compress assets, engineJS and js
    //   const uncompressed = JSON.stringify({ assets, engineJS, js });
    //   // Remove uncompress data to remove placeholder
    //   assets = {};
    //   engineJS = '';
    //   js = '';
    //   // Compress to base64
    //   compressed = `window.compressed=\`${Buffer.from(
    //     pako.deflate(uncompressed),
    //   ).toString('base64')}\`;\n`;

    //   // Pako source
    //   const inflateJS = fs.readFileSync(
    //     path.join(__dirname, '../node_modules/pako/dist/pako_inflate.js'),
    //   );
    //   compressed += inflateJS;
    // }
    // res = res.replace(PlaceHolder.Compressed, this._getJSTag(compressed));



    return html;
  }

  /**
   * Get a placeholder in `index.html` template, where to replace
   * @param key data key
   * @returns a placeholder
   */
  private _getHTMLHolder(key: string): string {
    return '${' + key + '}';
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
