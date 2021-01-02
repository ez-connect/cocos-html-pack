import Commander from 'commander';
import minify from 'minify';

import { Packer, Reader } from './packer';

function main(
  dir: string,
  filename: string,
  min?: boolean,
  verbose?: boolean,
) {
  console.log(dir, filename, verbose);

  Reader.setWorkingDir(dir);
  const data = Reader.readAll();
  Packer.load(data);
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
  .arguments('<dir> <filename>')
  .option('-v --verbose [verbose]', 'output log')
  .option('-min --minify [minify]', 'Minimize HTML')
  .action((dir, filename) => {
    main(dir, filename, Commander.minify, Commander.verbose);
  });

Commander.parse(process.argv);
