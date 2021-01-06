/* eslint-disable */
const path = require('path');
const { Packer, Reader, Util } = require('../../lib');

test('pack', () => {
  const data = Reader.readAll(path.join('src', '__tests__', 'example'));
  Packer.load(data, 'Single HTML');
  Util.writeJSON(path.join('src', '__tests__', 'game.json'), data);
  const html = Packer.patch();
  Util.write(path.join('src', '__tests__', 'game.html'), html);
});
