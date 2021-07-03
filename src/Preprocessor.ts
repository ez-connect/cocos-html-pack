// Preprocess some special data before pack

import path from "path";

export class Preprocessor {
  static exec(key: string, data: string, jsRegisterName?: string): string {
    switch(key) {
    case 'assets':
      data = `window.assets=${data};\n`;
      break;
    // case '/index.js':
    //   // add name for systemjs register
    //   data = data.replace('System.register(["./application.js"]', 'System.register("index.js", ["application.js"]');
    //   break;
    // case '/cocos-js/cc.js':
    //   // add name for systemjs register
    //   data = data.replace('System.register(', 'System.register("cc", ');
    //   break;
    default:
      if(key.endsWith('.js')) {
        data = data.replace(/\$/g, '$$$');
        data = data.replace(/import\("\.\//g, 'import("');
        data = data.replace(/(['"]\s*)*System\.register\((?<name>["'].+["'])*,*\s*\[(?<deps>[^\]]+)*\]/, (substring, unexpect, name, deps) => {
          if(unexpect) {
            return substring;
          }
          name = jsRegisterName ? `"${jsRegisterName}"` : (name ? name : `"${path.basename(key)}"`);
          return `System.register(${name}, [${deps ? deps.replace(/\.\//g, '') : ''}]`;
        });
      }
      break;
    }
    return data;
  }
}
