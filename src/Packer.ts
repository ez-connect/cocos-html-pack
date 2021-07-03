import fs from 'fs';
import path from 'path';
import pako from 'pako';
import { MapString } from './types';
import { Preprocessor } from './Preprocessor';

// Asset keys
enum DataKeys {
  Html = '/index.html',
  Template = '/template',
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
    let template = this._data[DataKeys.Template];

    // pack css
    html = html.replace(/<link rel="stylesheet".+href="(?<href>[^"]+)"\/>/g, (substring, href) => {
      const value = this._data[`/${href}`];
      delete this._data[`/${href}`];
      return `<style>\n${value}\n</style>`;
    });

    // remove script loaded in html
    html = html.replace(/<script.*>[\s\S]*<\/script>/g, '');

    // get all DataKeys in html with format: ${DataKey}
    const datakeys = [];
    const regex = /\$\{(.+)\}/g;
    let m;
    while ((m = regex.exec(template)) !== null) {
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
          assetsScripts += `${Preprocessor.exec(k, v)}\n`;
        }
      }
    }
    this._data['assets'] = JSON.stringify(assets);
    this._data['assetsScripts'] = assetsScripts;

    let cocosLibs = '';
    for (const [k, v] of Object.entries(this._data)) {
      if (k.startsWith(kPathCocosLibs)) {
        if(k.endsWith('.js')) {
          let t = v;
          if(!k.endsWith('cc.js')) {
            // update URL for wasm
            t = t.replace(/new URL\("(.+\.wasm)",.+\.meta\.url\)/g, (substring, x) => `new URL("${kPathCocosLibs}/${x}",window.location.href)`);
            t = Preprocessor.exec(k, t, k.replace(kPathCocosLibs, '').substr(1));
          } else {
            t = Preprocessor.exec(k, t, 'cc');
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
          const value = Preprocessor.exec(e, this._data[e]);
          template = template.replace(`\${${e}}`, `//${e}\n${value}\n`);
        }
        return;
      }
    });

    const value = template.replace(/\$/g, '$$$');
    html = html.replace('</body>', `${value}\n</body>`);

    return html;
  }
}
