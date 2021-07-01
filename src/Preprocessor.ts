// Preprocess some special data before pack

export class Preprocessor {
  static exec(key: string, data: string): string {
    switch(key) {
    case 'assets':
      data = `window.assets=${JSON.stringify(data)};\n`;
      break;
    case '/index.js':
      // add name for systemjs register
      data = data.replace('System.register(["./application.js"]', 'System.register("index.js", ["application.js"]');
      break;
    case '/cocos-js/cc.js':
      // add name for systemjs register
      data = data.replace('System.register(', 'System.register("cc", ');
      break;
    default:
      if(key.endsWith('.js')) {
        // remove / character in first because systemjs see it is a path
        data = data.replace('System.register([', `System.register("${key.substr(1)}", [`);
      }
      break;
    }
    return data;
  }
}
