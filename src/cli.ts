#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { exit } from 'process';
import { Command } from 'commander';

import { Packer } from './Packer';
import { Reader } from './Reader';
import { Util } from './Util';

const kOverrideTemplatesDir = 'pack-templates';

async function main(
  templates: boolean,
  input: string,
  output: string,
  title: string,
  orientation: string,
  minify: boolean,
  tinify: string,
  compress?: boolean,
) {
  if (templates) {
    console.log(`Copy templates to '${kOverrideTemplatesDir}'`);
    if (fs.existsSync(kOverrideTemplatesDir)) {
      fs.rmdirSync(kOverrideTemplatesDir, { recursive: true });
    }

    fs.mkdirSync(kOverrideTemplatesDir);
    Util.copyDirSync(
      path.join(require.main?.path ?? '', '..', kOverrideTemplatesDir),
      kOverrideTemplatesDir,
    );
    exit(0);
  }

  if (!input) {
    console.error('missing input dir');
    exit(1);
  }

  if (!output) {
    console.error('missing output dir');
    exit(1);
  }

  if (input === output) {
    console.error('output dir must be different input dir');
    exit(1);
  }

  // Copy all from input
  console.log('Pack', input, '->', output);
  if (fs.existsSync(output)) {
    fs.rmdirSync(output, { recursive: true });
  }

  fs.mkdirSync(output, { recursive: true });
  Util.copyDirSync(input, output);

  // Check override templates
  console.log('Copy templates');
  const platform = path.basename(input); // build flatform name
  const useOverrideTemplate = fs.existsSync(
    path.join(kOverrideTemplatesDir, platform),
  );
  if (useOverrideTemplate) {
    console.log('  use override templates');
  } else {
    console.log('  use built-in template');
  }

  const templateDir = useOverrideTemplate
    ? path.join(kOverrideTemplatesDir, platform)
    : path.join(
      require.main?.path ?? '',
      '..',
      kOverrideTemplatesDir,
      platform,
    );
  Util.copyFilesSync(templateDir, output);

  // Compress images
  if (tinify) {
    console.log('Compress images with tinypng');
    await Util.useTinify(tinify, output);
  }

  console.log('Pack');
  const reader = new Reader(platform);
  const data = reader.readAll(output);
  const packer = new Packer(data);
  const html = packer.patch(title, orientation, compress);
  Util.write(path.join(output, 'index.html'), html);

  if (minify) {
    console.log('Compress html with minify');
    await Util.useMinify(path.join(output, 'index.html'));
  }

  // Remove unused files
  console.log('Remove unused files');
  const filenames = fs.readdirSync(output);
  for (const name of filenames) {
    if (name === 'index.html') {
      continue;
    }

    const filename = path.join(output, name);
    if (fs.statSync(filename).isFile()) {
      fs.unlinkSync(filename);
    } else {
      fs.rmdirSync(filename, { recursive: true });
    }
  }

  console.log(
    'File size:',
    fs.statSync(path.join(output, 'index.html')).size,
    'bytes',
  );
}

const program = new Command();
program
  .name('cocos-html-pack ')
  .description('Single html web mobile template for Cocos')
  .version('0.3.0')
  .option('--templates', `override template dir in '${kOverrideTemplatesDir}'`)
  .option('-i, --input <path>', 'input dir, build/web-mobile for example')
  .option('-o, --output <path>', 'output dir')
  .option('-t, --title <value>', 'page title if use the default template')
  .option('-c, --settings <value>', 'json file contain: assets mapping, ...')
  .option('--orientation <value>', 'portrait or landscape', 'portrait')
  .option('--minify', 'compress js, css and html')
  .option('--tinify <key>', 'compress and optimize JPEG and PNG images')
  .option('--compress', 'compress assets and js');

program.parse(process.argv);

const {
  templates,
  input,
  output,
  title,
  orientation,
  minify,
  tinify,
  compress,
} = program.opts();

main(templates, input, output, title, orientation, minify, tinify, compress);
