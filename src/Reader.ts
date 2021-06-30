import * as fs from 'fs';
import * as path from 'path';

import { MapString } from './types';
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
    const ext = path.extname(filename);
    // Is binary file?
    if (Object.getOwnPropertyDescriptor(kBinaryFormat, ext)) {
      return `${kBinaryFormat[ext]}${data.toString('base64')}`;
    }
    // Plain text
    return data.toString('utf-8');
  }

  readAll(dir: string): MapString {
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
      const value = this.read(filename);
      data[key] = value;
    }

    return data;
  }
}
