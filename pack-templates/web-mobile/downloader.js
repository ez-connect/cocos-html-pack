System.register(['cc'], function (_export, _context) {
  "use strict";
  var cc;
  // Bundle
  function loadBundle(url, options, onComplete) {
    var str = window.assets[url + '/config.json'];
    if (str) {
      var data = JSON.parse(str);
      data.base = url + '/';
      onComplete(null, data);
    } else {
      throw new Error('Cannot found:', url);
    }
  }

  // Json
  function loadJson(url, options, onComplete) {
    var data = JSON.parse(window.assets[url]);
    onComplete(null, data);
  }

  // Plist
  function loadPlist(url, options, onComplete) {
    var data = atob(window.assets[url]);
    onComplete(null, data);
  }

  // Image
  function loadDomImage(url, options, onComplete) {
    var index = url.lastIndexOf('.');
    var strtype = url.substr(index + 1, 4);
    strtype = strtype.toLowerCase();
    var data = window.assets[url];

    var img = new Image();

    if (window.location.protocol !== 'file:') {
      img.crossOrigin = 'anonymous';
    }

    function loadCallback() {
      img.removeEventListener('load', loadCallback);
      img.removeEventListener('error', errorCallback);
      onComplete && onComplete(null, img);
    }

    function errorCallback() {
      img.removeEventListener('load', loadCallback);
      img.removeEventListener('error', errorCallback);
      // onComplete && onComplete(new Error(cc.debug.getError(4930, url)));
    }

    img.addEventListener('load', loadCallback);
    img.addEventListener('error', errorCallback);
    img.src = data;
    return img;
  }

  function loadImage(url, options, onComplete) {
    loadDomImage(url, options, onComplete);
  }

  // Audio
  var __audioSupport;
  var formatSupport;
  var context;

  function loadDomAudio(url, onComplete) {
    var dom = document.createElement('audio');

    dom.muted = true;
    dom.muted = false;

    var data = window.assets[url.split('?')[0]];
    data = base64toBlob(data, 'audio/mpeg');

    if (window.URL) {
      dom.src = window.URL.createObjectURL(data);
    } else {
      dom.src = data;
    }

    var clearEvent = function () {
      clearTimeout(timer);
      dom.removeEventListener('canplaythrough', success, false);
      dom.removeEventListener('error', failure, false);
      if (__audioSupport.USE_LOADER_EVENT)
        dom.removeEventListener(
          __audioSupport.USE_LOADER_EVENT,
          success,
          false,
        );
    };

    var timer = setTimeout(function () {
      if (dom.readyState === 0) failure();
      else success();
    }, 8000);

    var success = function () {
      clearEvent();
      onComplete && onComplete(null, dom);
    };

    var failure = function () {
      clearEvent();
      var message = 'load audio failure - ' + url;
      cc.log(message);
      onComplete && onComplete(new Error(message));
    };

    dom.addEventListener('canplaythrough', success, false);
    dom.addEventListener('error', failure, false);
    if (__audioSupport.USE_LOADER_EVENT)
      dom.addEventListener(__audioSupport.USE_LOADER_EVENT, success, false);
    return dom;
  }

  function loadWebAudio(url, onComplete) {
    if (!context)
      callback(new Error('Audio Downloader: no web audio context.'));

    var data = window.assets[url];
    data = base64toArray(data);

    if (data) {
      context['decodeAudioData'](
        data.buffer,
        function (buffer) {
          onComplete(null, buffer);
        },
        function () {
          onComplete('decode error - ' + url, null);
        },
      );
    } else {
      onComplete('request error - ' + url, null);
    }
  }

  function loadAudio(url, options, onComplete) {
    if (formatSupport.length === 0) {
      return new Error(
        'Audio Downloader: audio not supported on this browser!',
      );
    }

    // If WebAudio is not supported, load using DOM mode
    if (!__audioSupport.WEB_AUDIO) {
      loadDomAudio(url, onComplete);
    } else {
      loadWebAudio(url, onComplete);
    }
  }

  // Font
  function loadFont(url, options, onComplete) {
    var ttfIndex = url.lastIndexOf('.ttf');

    var slashPos = url.lastIndexOf('/');
    var fontFamilyName;
    if (slashPos === -1) {
      fontFamilyName = url.substring(0, ttfIndex) + '_LABEL';
    } else {
      fontFamilyName = url.substring(slashPos + 1, ttfIndex) + '_LABEL';
    }
    if (fontFamilyName.indexOf(' ') !== -1) {
      fontFamilyName = '"' + fontFamilyName + '"';
    }

    // Setup font face style
    let fontStyle = document.createElement('style');
    fontStyle.type = 'text/css';
    let fontStr = '';
    if (isNaN(fontFamilyName - 0))
      fontStr += '@font-face { font-family:' + fontFamilyName + '; src:';
    else fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";

    var data =
      'url(data:application/x-font-woff;charset=utf-8;base64,PASTE-BASE64-HERE) format("woff");';
    data = data.replace('PASTE-BASE64-HERE', window.assets[url]);

    fontStr += data;
    fontStyle.textContent = fontStr + '}';
    document.body.appendChild(fontStyle);

    // Preload font with div
    let preloadDiv = document.createElement('div');
    let divStyle = preloadDiv.style;
    divStyle.fontFamily = fontFamilyName;
    preloadDiv.innerHTML = '.';
    divStyle.position = 'absolute';
    divStyle.left = '-100px';
    divStyle.top = '-100px';
    document.body.appendChild(preloadDiv);

    onComplete(null, fontFamilyName);
  }

  function registerDownloader(cc) {
    cc.assetManager.downloader.register('bundle', loadBundle);
    cc.assetManager.downloader.register('.json', loadJson);
    cc.assetManager.downloader.register('.plist', loadPlist);
    cc.assetManager.downloader.register('.webp', loadImage);
    cc.assetManager.downloader.register('.png', loadImage);
    cc.assetManager.downloader.register('.jpg', loadImage);
    cc.assetManager.downloader.register('.jpeg', loadImage);
    cc.assetManager.downloader.register('.mp3', loadAudio);
    cc.assetManager.downloader.register('.ogg', loadAudio);
    cc.assetManager.downloader.register('.wav', loadAudio);
    cc.assetManager.downloader.register('.m4a', loadAudio);
    cc.assetManager.downloader.register('.ttf', loadFont);
  }

  return {
    setters: [function (_cc) {
      cc = _cc;
    }],
    execute: function () {
      __audioSupport = cc.sys?.__audioSupport;
      formatSupport = __audioSupport?.format;
      context = __audioSupport?.context;
      _export('registerDownloader', registerDownloader);
    }
  };
});
