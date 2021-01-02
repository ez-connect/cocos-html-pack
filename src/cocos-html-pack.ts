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
  console.log(dir, filename, verbose);

  Reader.setWorkingDir(dir);
  const data = Reader.readAll();
  Packer.load(data, 'Single HTML');
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
  .option('-v --verbose [verbose]', 'output log')
  .option('-min --minify [minify]', 'Minimize HTML')
  .action((dir, title, filename) => {
    main(dir, title, filename, Commander.minify, Commander.verbose);
  });

Commander.parse(process.argv);
