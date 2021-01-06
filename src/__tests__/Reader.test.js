/* eslint-disable */
const path = require('path');
const { Reader } = require('../../lib');

test('read all', () => {
  const data = Reader.readAll(path.join('src', '__tests__', 'example'));
  expect(data).toBeDefined();
});
