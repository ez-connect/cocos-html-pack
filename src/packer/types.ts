
export type MapString = { [key: string]: string };

export interface Resource {
  html: string;
  style: string;
  js: MapString;
  assets: MapString;
}

// Template
export enum Template {
  Mobile,
  Desktop,
}
