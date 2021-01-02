import * as fs from 'fs';

import { Resource } from './types';

class Packer {
  _data?: Resource;

  load(value: Resource) {
    this._data = value;
  }

  patch(
    styleHolder = '{$style}',
    jsHolder = '{$js}',
    assetsHolder = '{$assets}',
  ): string {
    if (!this._data) {
      throw new Error('No resouces found');
    }

    const { html, style, js, assets } = this._data;

    // Style
    let res = html.replace(styleHolder, style);
    // JS
    res = res.replace(jsHolder, Object.values(js).join('\n'));
    // Assets
    res = res.replace(assetsHolder, JSON.stringify(assets));

    return res;
  }

  write(filename: string, value: string) {
    fs.writeFileSync(filename, value);
  }

  writeJSON(filename: string) {
    this.write(filename, JSON.stringify(this._data, null, 2));
  }
}

const singleton = new Packer();
export { singleton as Packer };
