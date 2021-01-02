/* eslint-disable */
const path = require('path');
const { Reader } = require('../../lib/packer');

Reader.setWorkingDir(path.join('src', '__tests__', 'example'));

test('read all', () => {
  const data = Reader.readAll();
  expect(data).toBeDefined();
});
