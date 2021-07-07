import * as fs from 'fs';
import * as path from 'path';

import { MapString } from './types';
import { Util } from './Util';

// Template
export type Platform = 'web-mobile' | 'web-desktop' | string;
const kPathAssets = '/assets';

// Encode to base64 for these files
const kBinaryFormat: MapString = {
  '.webp': 'data:image/webp;base64,',
  '.png': 'data:image/png;base64,',
  '.jpg': 'data:image/jpeg;base64,',
  '.mp3': '',
  '.ttf': '',
  // Facebook Playable Preview issue if plist in plain text
  // Because of missing `</dict></plist>` after injected
  '.plist': '',
};
export class Reader {
  _platform: Platform;

  constructor(platform: Platform = 'web-mobile') {
    this._platform = platform;
  }

  read(filename: string): string {
    // Read the file
    const data = fs.readFileSync(filename);
    // Get extension
    const ext = path.extname(filename).toLowerCase();
    // Is binary file?
    if (Object.getOwnPropertyDescriptor(kBinaryFormat, ext)) {
      return `${kBinaryFormat[ext]}${data.toString('base64')}`;
    }
    // Plain text
    return data.toString('utf-8');
  }

  readAll(dir: string, settingsPath?: string): MapString {
    // Read settings
    let settings = undefined;
    if(settingsPath && Util.existFileSync(settingsPath)) {
      settings = JSON.parse(this.read(settingsPath));
    }

    // Get all scripts + assets files
    const filenames: string[] = [];
    Util.walk(filenames, dir);

    const data: MapString = {};
    for (const filename of filenames) {
      // console.log(filename);
      let key = filename.replace(dir, '');
      if (path.sep === '\\') {
        key = key.replace(/\\/g, '/'); // replaceAll not supports
      }

      // replace assets
      let value = '';
      if(settings?.[path.basename(filename)]) {
        if(settings[path.basename(filename)]['type'] === 'image') {
          value = this.read(settings[path.basename(filename)]['replacer'] ?? filename);
        } else if(settings[path.basename(filename)]['type'] === 'json') {
          value = this.read(filename);
          const items = settings[path.basename(filename)]['items'];
          for(const k of Object.keys(items)) {
            value = value.replace(`"${k}":${items[k]['default']}`, `"${k}":${items[k]['value']}`);
            console.log(`"${k}":${items[k]['default']}`, `"${k}":${items[k]['value']}`, value);
          }
        }
      } else {
        value = this.read(filename);
      }

      data[key] = value;
    }

    return data;
  }
}
