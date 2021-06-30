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

    // Assets
    const assets: MapString = {};
    for (const [k, v] of Object.entries(this._data)) {
      if (k.startsWith(kPathAssets)) {
        assets[k] = v;
      }
    }

    datakeys.forEach((e) => {
      // console.log(e);
      switch(e) {
      case 'title':
        html = html.replace('${title}', title);
        break;
      case 'orientation':
        html = html.replace(/\$\{orientation\}/g, orientation);
        break;
      case 'assets':
        html = html.replace('${assets}', `window.assets=${JSON.stringify(assets)};\n`);
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
