const { Reader } = require('../../lib/packer');

const kSampleHTML = '<!DOCTYPE html>\n';
const kSampleMobileStyle = `#Cocos2dGameContainer {
  position: absolute;
  margin: 0;
  left: 0px;
  top: 0px;

  display: -webkit-box;
  -webkit-box-orient: horizontal;
  -webkit-box-align: center;
  -webkit-box-pack: center;
}
`;
const kSampleSettings = 'window._CCSettings={};\n'
const kSampleEngineScript = 'function helloCocos() {}\n';

Reader.setWorkingDir('src/__tests__');

test('test read html', () => {
  expect(Reader.readHTML()).toEqual(kSampleHTML);
});

test('test read style', () => {
  expect(Reader.readStyle()).toEqual(kSampleMobileStyle);
});

test('test read settings', () => {
  expect(Reader.readSettings()).toEqual(kSampleSettings);
});

test('test read engine source', () => {
  const data = Reader.readEngineSource();
  expect(data).toEqual(kSampleEngineScript);
});

// test('walk directory', () => {
//   const data = [];
//   Reader.walk(data, 'src/__tests__');
//   expect(data).toEqual(kSampleWalk);
// });

// test('read assets', () => {
//   Reader.set
// })
