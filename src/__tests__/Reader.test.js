/* eslint-disable */
const path = require('path');
const { Reader } = require('../../lib');

test('read all', () => {
  const reader = new Reader();
  const data = reader.readAll(path.join('src', '__tests__', 'example'));
  expect(data).toBeDefined();
});
