import Commander from 'commander';

import { Packer, Reader } from './packer';

function main(dir: string, filename: string, verbose?: boolean) {
  console.log(dir, filename, verbose);

  Reader.setWorkingDir(dir);
  const data = Reader.readAll();
  Packer.load(data);
  const html = Packer.patch();
  Packer.write(filename, html);
}

Commander
  .description('Single html web mobile template for Cocos')
  .version('0.0.1')
  .arguments('<dir> <filename>')
  .option('-v --verbose [verbose]', 'output log')
  .action((dir, filename) => {
    main(dir, filename, Commander.verbose);
  });

Commander.parse(process.argv);
