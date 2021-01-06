import * as fs from 'fs';
import * as path from 'path';

class Util {
  copyFilesSync(src: string, dest: string) {
    const names = fs.readdirSync(src);
    for (const name of names) {
      fs.copyFileSync(path.join(src, name), path.join(dest, name));
    }
  }

  copyDirSync(src: string, dest: string) {
    fs.readdirSync(src).forEach((e) => {
      if (fs.lstatSync(path.join(src, e)).isFile()) {
        fs.copyFileSync(path.join(src, e), path.join(dest, e));
      } else {
        fs.mkdirSync(path.join(dest, e));
        this.copyDirSync(path.join(src, e), path.join(dest, e));
      }
    });
  }

  write(filename: string, value: string) {
    fs.writeFileSync(filename, value);
  }

  writeJSON(filename: string, data: unknown) {
    this.write(filename, JSON.stringify(data, null, 2));
  }
}

const singleton = new Util();
export { singleton as Util };
