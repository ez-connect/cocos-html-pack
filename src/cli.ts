#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
import { Command } from 'commander';
import minify from 'minify';

import { Packer } from './Packer';
import { Reader } from './Reader';
import { Util } from './Util';

const kOverrideTemplatesDir = 'pack-templates';

const program = new Command();
program
  .name('cocos-html-pack ')
  .description('Single html web mobile template for Cocos')
  .version('0.1.0')
  .option('--templates', `override template dir in '${kOverrideTemplatesDir}'`)
  .option('-i, --input <path>', 'input dir, build/web-mobile for example')
  .option('-o, --output <path>', 'output dir')
  .option('-t, --title <value>', 'page title if use the default template')
  .option('-m, --min', 'minimize HTML');

program.parse(process.argv);

const { templates, input, output, title, min } = program;

if (templates) {
  console.log(`Copy templates to '${kOverrideTemplatesDir}'`);
  if (fs.statSync(kOverrideTemplatesDir)) {
    fs.rmdirSync(kOverrideTemplatesDir, { recursive: true });
  }

  fs.mkdirSync(kOverrideTemplatesDir);
  Util.copyDirSync(
    path.join(require.main?.path ?? '', '..', kOverrideTemplatesDir),
    kOverrideTemplatesDir,
  );
  exit(0);
}

if (input === '') {
  console.error('missing input dir');
  exit(1);
}

if (output === '') {
  console.error('missing output dir');
  exit(1);
}

if (input === output) {
  console.error('output dir must be different input dir');
  exit(1);
}

// Copy all from input
if (fs.existsSync(output)) {
  fs.rmdirSync(output, { recursive: true });
}

fs.mkdirSync(output, { recursive: true });
Util.copyDirSync(input, output);

// Check override templates
const platform = path.basename(input); // build flatform name
const templateDir = fs.existsSync(path.join(kOverrideTemplatesDir, platform))
  ? path.join(kOverrideTemplatesDir, platform)
  : path.join(require.main?.path ?? '', '..', kOverrideTemplatesDir, platform);

// Copy template files
Util.copyFilesSync(templateDir, output);

const data = Reader.readAll(output);
Packer.load(data, title);
const html = Packer.patch();
Util.write(path.join(output, 'index.html'), html);

if (min) {
  const outputHTML = path.join(output, 'index.html');
  minify(outputHTML).then((value) => {
    Util.write(outputHTML, value);
  });
}

// Remove unused files
fs.unlinkSync(path.join(output, 'main.js'));
const keepFiles = fs.readdirSync(templateDir);
const filenames = fs.readdirSync(output);
for (const name of filenames) {
  if (!keepFiles.includes(name)) {
    const filename = path.join(output, name);
    if (fs.statSync(filename).isFile()) {
      fs.unlinkSync(filename);
    } else {
      fs.rmdirSync(filename, { recursive: true });
    }
  }
}
