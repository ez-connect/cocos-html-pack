// Preprocess some special data before pack

export class Preprocessor {
  static exec(key: string, data: string): string {
    switch(key) {
    case '/index.js':
      // add name for systemjs register
      data = data.replace('System.register(["./application.js"]', 'System.register("index.js", ["application.js"]');
      break;
    case '/application.js':
      // add name for systemjs register
      data = data.replace('System.register(', 'System.register("application.js", ');
      break;
    case '/cocos-js/cc.js':
      // add name for systemjs register
      data = data.replace('System.register(', 'System.register("cc", ');
      break;
    default:
      break;
    }
    return data;
  }
}
