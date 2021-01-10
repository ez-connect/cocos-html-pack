/* eslint-disable */
const path = require('path');
const { Packer, Reader, Util } = require('../../lib');

test('pack', () => {
  const reader = new Reader();
  const data = reader.readAll(path.join('src', '__tests__', 'example'));
  Util.writeJSON(path.join('src', '__tests__', 'game.json'), data);

  const packer = new Packer(data);
  const html = packer.patch('Single HTML', 'landscape');
  Util.write(path.join('src', '__tests__', 'game.html'), html);
});
