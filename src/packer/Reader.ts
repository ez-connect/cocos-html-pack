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
// // settings.json
// const kPathSetting = path.join('src', 'settings.js');
// // cocos2d-js-min.js
// const kPathEngine = 'cocos2d-js-min.js';
// // assets
// const kPathAssets =  'assets';
// // main.js
// const kPathScript = path.join(kPathAssets, 'main.js');
// // internal/index.js
// const kPathInternalScript = path.join(kPathAssets, 'internal', 'index.js');

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
    const res: Resource = {
      html: '',
      style: '',
      js: {},
      assets: {},
    };

    // Get all scripts + assets files
    const filenames: string[] = [];
    this.walk(filenames, this._workingDir);

    for (const filename of filenames) {
      const key = filename.replace(this._workingDir, '');
      const value = this.read(filename);
      const ext = path.extname(filename);
      switch (ext) {
      case '.html':
        if (filename.includes(kPathHTML)) {
          res.html = value;
        }
        break;
      case '.css':
        if (
          filename.includes(kPathStyleMobile) &&
            this._template === Template.Mobile
        ) {
          res.style = value;
        } else if (
          filename.includes(kPathStyleDesktop) &&
            this._template === Template.Desktop
        ) {
          res.style = value;
        } else {
          // console.warn('Unknow CSS', filename);
        }
        break;
      case '.js':
        res.js[key] = value;
        break;
      default:
        res.assets[key] = value;
        break;
      }
    }

    return res;
  }
}

const singleton = new Reader();
export { singleton as Reader };
