import * as fs from 'fs';
import * as path from 'path';

type MapString = { [key: string]: string };

// Template
enum Template {
  Mobile,
  Desktop,
}

// Encode to base64 for these files
const kBinaryFormat: MapString = {
  '.webp': 'data:image/webp;base64,',
  '.png': 'data:image/png;base64,',
  '.jpg': 'data:image/jpeg;base64,',
  '.mp3': '',
  '.ttf': '',
  '.plist': 'data:text/plist;base64,',
};

const kBuildDir = path.join('build', 'web-mobile');

// index.html
const kPathHTML = path.join(kBuildDir, 'index.html');
// style-desktop.css
const kPathStyleDesktop = path.join(kBuildDir, 'style-desktop.css');
// style-mobile.css
const kPathStyleMobile = path.join(kBuildDir, 'style-mobile.css');
// settings.json
const kPathSettingPath = path.join(kBuildDir, 'src', 'settings.js');
// cocos2d-js-min.js
const kPathEnginePath = path.join(kBuildDir, 'cocos2d-js-min.js');
// assets
const kPathAssets = path.join(kBuildDir, 'assets');
// main.js
const kPathScript = path.join(kPathAssets, 'main.js');
// internal/index.js
const kPathInternalScript = path.join(kPathAssets, 'internal', 'index.js');

class Reader {
  _workingDir: string = 'build/web-mobile';
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

  readHTML(): string {
    return this.read(path.join(this._workingDir, kPathHTML));
  }

  readStyle(): string {
    const filename =
      this._template === Template.Mobile ? kPathStyleMobile : kPathStyleDesktop;
    return this.read(path.join(this._workingDir, filename));
  }

  readSettings(): string {
    return this.read(path.join(this._workingDir, kPathSettingPath));
  }

  readEngineSource(): string {
    return this.read(path.join(this._workingDir, kPathEnginePath));
  }

  readScriptSource(): string {
    return this.read(path.join(this._workingDir, kPathScript));
  }

  readInternalScriptSource(): string {
    return this.read(path.join(this._workingDir, kPathInternalScript));
  }

  readerAssets(): MapString | undefined {
    const assetsDir = path.join(this._workingDir, kPathAssets);
    const res: MapString = {};
    const filenames: string[] = [];
    this.walk(filenames, assetsDir);
    for (const filename of filenames) {
      // Ignore script
      if (path.extname(filename) === '.js') {
        break;
      }

      // Remove `this._workingDir/kPathAssets`
      const key = filename.replace(assetsDir, '');
      res[key] = this.read(filename);
    }

    return res;
  }
}

const singleton = new Reader();
export { singleton as Reader };
