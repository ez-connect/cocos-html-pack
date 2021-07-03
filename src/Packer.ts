import fs from 'fs';
import path from 'path';
import pako from 'pako';
import { MapString } from './types';
import { Preprocessor } from './Preprocessor';

// Asset keys
enum DataKeys {
  Html = '/index.html',
}

const kPathAssets = '/assets';
const kPathCocosLibs = '/cocos-js';

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

    // pack css
    html = html.replace(/<link rel="stylesheet".+href="(?<href>[^"]+)"\/>/g, (substring, href) => {
      const value = this._data[`/${href}`];
      delete this._data[`/${href}`];
      return `<style>\n${value}\n</style>`;
    });

    // pack scripts loaded in html
    html = html.replace(/<script src="(?<source>[^"]+)" (type="systemjs-importmap")?.*>.*<\/script>/g, (substring, source, type) => {
      let value = this._data[`/${source}`];
      delete this._data[`/${source}`];
      // import js by json
      if(type) {
        const importmap = JSON.parse(value)?.imports;
        if(importmap) {
          value = '';
          for(const i in importmap) {
            const t = Object.keys(this._data).find((v) => importmap[i].endsWith(v));
            if(t && this._data[t]) {
              value += `\n//${t}\n${Preprocessor.exec(t, this._data[t], i)}`;
            }
          }
        }
      } else {
        value = `\n//${source}\n${Preprocessor.exec(source, value)}`;
      }
      return `<script>\n${value}\n</script>`;
    });

    // pack assets
    const assets: MapString = {};
    let assetsScripts = '';
    for (const [k, v] of Object.entries(this._data)) {
      if (k.startsWith(kPathAssets)) {
        // exclude js in assets
        if (!k.endsWith('.js')) {
          assets[k.replace(`${kPathAssets}/`, '')] = v;
        } else {
          assetsScripts += `\n//${k}\n${Preprocessor.exec(k, v)}\n`;
        }
        delete this._data[k];
      }
    }

    // pack others scripts
    let otherScripts = '';
    for (const [k, v] of Object.entries(this._data)) {
      if (k.endsWith('.js')) {
        // update URL for wasm
        const t = v.replace(/new URL\("(.+\.wasm)",.+\.meta\.url\)/g, (substring, x) => `new URL("${kPathCocosLibs}/${x}",window.location.href)`);
        otherScripts += `\n//${k}\n${Preprocessor.exec(k, t)}\n`;
      }
    }

    // datakeys.forEach((e) => {
    //   // console.log(e);
    //   switch (e) {
    //     // replace all for orentation
    //     case 'orientation':
    //       html = html.replace(/\$\{orientation\}/g, orientation);
    //       break;
    //     default:
    //       if (this._data[e]) {
    //         let value = this._data[e].replace(/\$/g, '$$$');
    //         value = Preprocessor.exec(e, value);
    //         template = template.replace(`\${${e}}`, `//${e}\n${value}\n`);
    //       }
    //       return;
    //   }
    // });
    // template = template.replace(/\$/g, '$$$');
    // html = html.replace('</body>', `${template}\n</body>`);
    html = html.replace('System.import(\'./index.js\')', `window.settings=${this._data['/src/settings.json']};\nwindow.assets=${JSON.stringify(assets)};\n${assetsScripts}\n${otherScripts}\nSystem.import('index.js')`);
    return html;
  }
}
