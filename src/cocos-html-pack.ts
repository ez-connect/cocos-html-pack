import * as fs from 'fs';
import * as path from 'path';
import Commander from 'commander';
import minify from 'minify';

import { Packer, Reader } from './packer';

function main(
  dir: string,
  title: string,
  filename: string,
  min?: boolean,
  verbose?: boolean,
) {
  if (verbose) {
    console.log('Input dir:', dir);
    console.log('Output file:', filename);
  }

  // Copy template
  const templateDir = path.join(
    require.main?.path ?? '',
    '..',
    'templates',
    'web-mobile',
  );
  fs.copyFileSync(
    path.join(templateDir, 'index.html'),
    path.join(dir, 'index.html'),
  );
  fs.copyFileSync(path.join(templateDir, 'main.js'), path.join(dir, 'main.js'));

  Reader.setWorkingDir(dir);
  const data = Reader.readAll();
  Packer.load(data, title);
  const html = Packer.patch();
  Packer.write(filename, html);

  if (min) {
    minify(filename).then((value) => {
      Packer.write(filename, value);
    });
  }
}

Commander.description('Single html web mobile template for Cocos')
  .version('0.0.1')
  .arguments('<dir> <title> <filename>')
  .option('-min --minify [minify]', 'Minimize HTML')
  .option('-v --verbose [verbose]', 'output log')
  .action((dir, title, filename) => {
    main(dir, title, filename, Commander.minify, Commander.verbose);
  });

Commander.parse(process.argv);
