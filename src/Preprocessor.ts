// Preprocess some special data before pack

export class Preprocessor {
  static exec(key: string, data: string, jsRegisterName?: string): string {
    switch(key) {
    case 'assets':
      data = `window.assets=${data};\n`;
      break;
    default:
      if(key.endsWith('.js')) {
        data = data.replace(/\$/g, '$$$');
        data = data.replace(/import\("\.\//g, 'import("');
        data = data.replace(/(['"]\s*)*System\.register\((?<name>["'].+["'])*,*\s*\[(?<deps>[^\]]+)*\]/, (substring, unexpect, name, deps) => {
          if(unexpect) {
            return substring;
          }
          name = jsRegisterName ? `"${jsRegisterName}"` : (name ? name : `"${key.substr(1)}"`);
          return `System.register(${name}, [${deps ? deps.replace(/\.\//g, '') : ''}]`;
        });
      }
      break;
    }
    return data;
  }
}
