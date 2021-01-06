
export type MapString = { [key: string]: string };

export interface Resource {
  html: string;
  style: string;
  assets: MapString;
  settings: string;
  engineJS: string;
  internalJS: string;
  mainJS: string;
  js: string;
}

// Template
export enum Template {
  Mobile,
  Desktop,
}
