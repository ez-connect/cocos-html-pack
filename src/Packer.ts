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

    // get all DataKeys in html with format: ${DataKey}
    const datakeys = [];
    const regex = /\$\{(.+)\}/g;
    let m;
    while ((m = regex.exec(html)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      datakeys.push(m[1]);
    }

    this._data['title'] = title;
    this._data['orientation'] = orientation;

    // Assets
    const assets: MapString = {};
    let assetsScripts = '';
    for (const [k, v] of Object.entries(this._data)) {
      if (k.startsWith(kPathAssets)) {
        // exclude js in assets
        if(!k.endsWith('.js')) {
          assets[k.replace(`${kPathAssets}/`, '')] = v;
        } else {
          assetsScripts += `${v.replace('System.register([', `System.register("${k.substr(1)}", [`)}\n`;
        }
      }
    }
    this._data['assets'] = JSON.stringify(assets);
    this._data['assetsScripts'] = assetsScripts;

    let cocosLibs = '';
    for (const [k, v] of Object.entries(this._data)) {
      if (k.startsWith(kPathCocosLibs)) {
        if(k.endsWith('.js')) {
          let t = v.replace(/"\.\//g, '"');
          if(!k.endsWith('cc.js')) {
            // update URL for wasm
            t = t.replace(/new URL\("(.+\.wasm)",.+\.meta\.url\)/g, (substring, x) => `new URL("${kPathCocosLibs}/${x}",window.location.href)`);
            t = t.replace('System.register([', `System.register("${path.basename(k)}", [`);
          } else {
            t = t.replace('System.register([', 'System.register("cc", [');
          }
          cocosLibs += `${t}\n`;
        }
      }
    }
    this._data['cocosLibs'] = cocosLibs;

    datakeys.forEach((e) => {
      // console.log(e);
      switch(e) {
      // replace all for orentation
      case 'orientation':
        html = html.replace(/\$\{orientation\}/g, orientation);
        break;
      default:
        if(this._data[e]) {
          let value = this._data[e].replace(/\$/g, '$$$');
          value = Preprocessor.exec(e, value);
          html = html.replace(`\${${e}}`, `//${e}\n${value}\n`);
        }
        return;
      }
    });

    return html;
  }
}
