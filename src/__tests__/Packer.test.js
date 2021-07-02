/* eslint-disable */
const path = require('path');
const { Packer, Reader, Util } = require('../../lib');

test('pack', () => {
  const reader = new Reader();
  const data = reader.readAll(path.join('src', '__tests__', 'example'), path.join('src', '__tests__', 'example', 'settings', 'settings.json'));
  Util.writeJSON(path.join('src', '__tests__', 'game.json'), data);

  const packer = new Packer(data);
  const html = packer.patch('Single HTML', 'landscape');
  Util.write(path.join('src', '__tests__', 'game.html'), html);
});

test('pack use lz', () => {
  const reader = new Reader();
  const data = reader.readAll(path.join('src', '__tests__', 'example'));
  const packer = new Packer(data);
  const html = packer.patch('Single HTML', 'landscape', true);
  Util.write(path.join('src', '__tests__', 'game-compressed.html'), html);
});
