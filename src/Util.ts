import * as fs from 'fs';
import * as path from 'path';
import minify from 'minify';
import tinify from 'tinify';

class Util {
  walk(res: string[], dir: string, ext?: string): void {
    const names = fs.readdirSync(dir);
    for (const name of names) {
      const filename = path.join(dir, name);

      if (fs.statSync(filename).isDirectory()) {
        // Walk into each dir
        this.walk(res, filename, ext);
      } else {
        // Or match
        const ok = ext ? path.extname(filename) === ext : true;
        if (ok) {
          res.push(filename);
        }
      }
    }
  }

  existFileSync(path: string) {
    return fs.existsSync(path);
  }

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

  /// Compress HTML + JS with minify
  async useMinify(filename: string) {
    const data = await minify(filename);
    this.write(filename, data);
  }

  /// Compress image with TinyPNG
  async useTinify(key: string, dir: string): Promise<void[]> {
    tinify.key = key;

    const filenames: string[] = [];
    this.walk(filenames, dir, '.png');
    return Promise.all(
      filenames.map((e) => {
        return tinify.fromFile(e).toFile(e);
      }),
    );
  }
}

const singleton = new Util();
export { singleton as Util };
