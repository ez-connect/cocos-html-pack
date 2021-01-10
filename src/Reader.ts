import * as fs from 'fs';
import * as path from 'path';

import { MapString, Resource } from './types';
import { Util } from './Util';

// Template
export type Platform = 'web-mobile' | 'web-desktop' | string;

// Encode to base64 for these files
const kBinaryFormat: MapString = {
  '.webp': 'data:image/webp;base64,',
  '.png': 'data:image/png;base64,',
  '.jpg': 'data:image/jpeg;base64,',
  '.mp3': '',
  '.ttf': '',
  // '.plist': 'data:text/plist;base64,',
};

// index.html
const kPathHTML = 'index.html';
// style-desktop.css
const kPathStyleDesktop = 'style-desktop.css';
// style-mobile.css
const kPathStyleMobile = 'style-mobile.css';
// assets
const kPathAssets = 'assets';
// settings.json
const kPathSetting = path.join('src', 'settings.js');
// cocos2d-js-min.js
const kPathEngineJS = 'cocos2d-js-min.js';
// assets/internal/index.js
const kPathInternalJS = path.join(kPathAssets, 'internal', 'index.js');
// main.js
const kPathMainJS = 'main.js';
// assets/main/index.js
const kPathJS = path.join(kPathAssets, 'main', 'index.js');

export class Reader {
  _platform: Platform;

  constructor(platform: Platform = 'web-mobile') {
    this._platform = platform;
  }

  read(filename: string): string {
    // Read the file
    const data = fs.readFileSync(filename);
    // Get extension
    const ext = path.extname(filename);
    // Is binary file?
    if (Object.getOwnPropertyDescriptor(kBinaryFormat, ext)) {
      return `${kBinaryFormat[ext]}${data.toString('base64')}`;
    }
    // Plain text
    return data.toString('utf-8');
  }

  readAll(dir: string): Resource {
    // Get all scripts + assets files
    const filenames: string[] = [];
    const assetsDir = path.join(dir, kPathAssets);
    Util.walk(filenames, assetsDir);

    const assets: MapString = {};
    for (const filename of filenames) {
      const ext = path.extname(filename);
      if (ext === '.js') {
        continue;
      }

      let key = filename.replace(`${assetsDir}${path.sep}`, '');
      if (path.sep === '\\') {
        key = key.replace(/\\/g, '/'); // replaceAll not supports
      }
      const value = this.read(filename);
      assets[key] = value;
    }

    return {
      html: this.read(path.join(dir, kPathHTML)),
      style:
        this._platform === 'web-desktop'
          ? this.read(path.join(dir, kPathStyleDesktop))
          : this.read(path.join(dir, kPathStyleMobile)),
      assets,
      settings: this.read(path.join(dir, kPathSetting)),
      engineJS: this.read(path.join(dir, kPathEngineJS)),
      internalJS: this.read(path.join(dir, kPathInternalJS)),
      mainJS: this.read(path.join(dir, kPathMainJS)),
      js: this.read(path.join(dir, kPathJS)),
    };
  }
}
