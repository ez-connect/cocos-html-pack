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
  -V, --version          output the version number
  --templates            override template dir in 'pack-templates'
  -i, --input <path>     input dir, build/web-mobile for example
  -o, --output <path>    output dir
  -t, --title <value>    page title if use the default template
  --orientation <value>  portrait or landscape (default: "portrait")
  --minify               compress js, css and html
  --tinify <key>         compress and optimize JPEG and PNG images
  -h, --help             display help for command
```

## Example

Pack from `build/web-mobile` to `build/web-mobile-pack`

```
cocos-html-pack --input build/web-mobile --output build/web-mobile-pack --title Test
```

If you want to override templates

```
cocos-html-pack --templates
```

Add or change templates in `./pack-templates`, they will be used instead of default templates

```
cocos-html-pack --input build/web-mobile build/web-mobile-pack
```

Minify

```
cocos-html-pack --input build/web-mobile --output build/web-mobile-pack --minify
```

Minify & compress PNG

```
cocos-html-pack --input build/web-mobile --output build/web-mobile-pack --minify --tinify <your-tinypng-key>
```

---

<a href="https://www.buymeacoffee.com/JTld5n4" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>
