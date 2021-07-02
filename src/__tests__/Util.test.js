/* eslint-disable */
const path = require('path');
const { Util } = require('../../lib');

test('walk', () => {
  const res = [];
  Util.walk(res, 'src/__tests__/example', '.css');
  expect(res.length).toEqual(1);
})

// test('compress image', () => {
//   jest.setTimeout(10000);
//   expect(Util.compressImage(
//     '',
//     'src/__tests__/example/assets/resources/native/f9/f92dbc16-2404-4f39-aabd-cc049de52ca9.png',
//   )).toBeDefined();
// });
