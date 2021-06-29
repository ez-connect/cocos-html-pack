System.register("chunks:///_virtual/Button.ts",["./_rollupPluginModLoBabelHelpers.js","cc"],(function(t){"use strict";var e,n,r,i,o,l,a,c,u,s;return{setters:[function(t){e=t.applyDecoratedDescriptor,n=t.inheritsLoose,r=t.initializerDefineProperty,i=t.assertThisInitialized},function(t){o=t.cclegacy,l=t._decorator,a=t.Node,c=t.assert,u=t.Label,s=t.Component}],execute:function(){var p,f,b,h,y;o._RF.push({},"125f2xSB3VIyoS3qzpBuMct","Button",void 0);var d=l.ccclass,g=l.property;t("Button",(p=d("Button"),f=g(a),p((y=e((h=function(t){function e(){for(var e,n=arguments.length,o=new Array(n),l=0;l<n;l++)o[l]=arguments[l];return e=t.call.apply(t,[this].concat(o))||this,r(i(e),"label",y,i(e)),e}return n(e,t),e.prototype.onClick=function(){if(c(null!=this.label),this.label){var t=this.label.getComponent(u);t&&(t.string="Clicked")}},e}(s)).prototype,"label",[f],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return null}}),b=h))||b));o._RF.pop()}}}));

System.register("chunks:///_virtual/main",["./Button.ts"],(function(){"use strict";return{setters:[null],execute:function(){}}}));

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});