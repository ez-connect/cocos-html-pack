/* eslint-disable */
const path = require('path');
const { Packer, Reader } = require('../../lib/packer');

test('pack', () => {
  Reader.setWorkingDir(path.join('src', '__tests__', 'example'));
  const data = Reader.readAll();
  Packer.load(data);
  Packer.writeJSON(path.join('src', '__tests__', 'game.json'));
  const html = Packer.patch();
  Packer.write(path.join('src', '__tests__', 'game.html'), html);
});
