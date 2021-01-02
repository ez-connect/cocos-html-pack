import * as fs from 'fs';
import * as path from 'path';

import { MapString, Resource, Template } from './types';

// Encode to base64 for these files
const kBinaryFormat: MapString = {
  '.webp': 'data:image/webp;base64,',
  '.png': 'data:image/png;base64,',
  '.jpg': 'data:image/jpeg;base64,',
  '.mp3': '',
  '.ttf': '',
  '.plist': 'data:text/plist;base64,',
};

// const kBuildDir = path.join('build', 'web-mobile');

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

class Reader {
  _workingDir = 'build/web-mobile';
  _template: Template = Template.Mobile;

  setWorkingDir(value: string) {
    this._workingDir = value;
  }

  setTemplate(value: Template) {
    this._template = value;
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

  walk(res: string[], dir: string): void {
    const names = fs.readdirSync(dir);
    for (const name of names) {
      const filename = path.join(dir, name);

      if (fs.statSync(filename).isDirectory()) {
        // Walk into each dir
        this.walk(res, filename);
      } else {
        // Or break
        res.push(filename);
      }
    }
  }

  readAll(): Resource {
    // Get all scripts + assets files
    const filenames: string[] = [];
    const assetsDir = path.join(this._workingDir, kPathAssets);
    this.walk(filenames, assetsDir);

    const assets: MapString = {};
    for (const filename of filenames) {
      const ext = path.extname(filename);
      if (ext === '.js') {
        continue;
      }

      let key = filename.replace(`${assetsDir}${path.sep}`, '');
      if (path.sep === '\\') {
        key = key.replace('\\', '/');
      }
      const value = this.read(filename);
      assets[key] = value;
    }

    return {
      html: this.read(path.join(this._workingDir, kPathHTML)),
      style:
        this._template === Template.Mobile
          ? this.read(path.join(this._workingDir, kPathStyleMobile))
          : this.read(path.join(this._workingDir, kPathStyleDesktop)),
      assets,
      settings: this.read(path.join(this._workingDir, kPathSetting)),
      engineJS: this.read(path.join(this._workingDir, kPathEngineJS)),
      internalJS: this.read(path.join(this._workingDir, kPathInternalJS)),
      mainJS: this.read(path.join(this._workingDir, kPathMainJS)),
      js: this.read(path.join(this._workingDir, kPathJS)),
    };
  }
}

const singleton = new Reader();
export { singleton as Reader };
