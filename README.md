# Cocos HTML Pack

Single html web mobile template for Cocos

Based on https://github.com/revelatiosgn/SingleHTML5Generator

Tested on Cocos Creator v2.4.3

## Install

As a global package

```
npm i -g cocos-html-pack
```

Or a dependency package

```
npm i cocos-html-pack --save-dev
yarn add -D cocos-html-pack
```

## Build config

Disable `MD5 Cache` in `Project > Build...`

## Usage

```
cocos-html-pack [options]

Options:
  -V, --version        output the version number
  --templates          override template dir in 'pack-templates'
  -i, --input <path>   input dir, build/web-mobile for example
  -o, --output <path>  output dir
  -t, --title <value>  page title if use the default template
  -m, --min            minimize HTML
  -h, --help           display help for command
```

## Example

Pack from `build/web-mobile` to `build/web-mobile-pack`

```
cocos-html-pack --input build/web-mobile build/web-mobile-pack --title Test
```

If you want to override templates

```
cocos-html-pack --templates
```

Add or change templates in `./pack-templates`, they will be used instead of default templates

```
cocos-html-pack --input build/web-mobile build/web-mobile-pack
```

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="JTld5n4" data-color="#5F7FFF" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#ffffff" data-coffee-color="#FFDD00" ></script>
