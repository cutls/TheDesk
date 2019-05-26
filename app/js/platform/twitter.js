"use strict";
var _createClass = function () {
  function a(e, f) {
    for (var h, g = 0; g < f.length; g++) h = f[g], h.enumerable = h.enumerable || !1, h.configurable = !0, "value" in h && (h.writable = !0), Object.defineProperty(e, h.key, h)
  }
  return function (e, f, g) {
    return f && a(e.prototype, f), g && a(e, g), e
  }
}();

function _classCallCheck(a, e) {
  if (!(a instanceof e)) throw new TypeError("Cannot call a class as a function")
}
var TJScrollTask = function () {
  function a(e, f, g) {
    _classCallCheck(this, a), this.tjDeck = e, this.$t = e.$wrap, this.x = f, this.d = g, this.sl = e.wrapL, this.sTime = Date.now(), this.ended = !1, this._bindAnim = this._anim.bind(this);
    var h = e.getClms();
    0 > f || f > h[0].offsetWidth * (h.length - 1) ? this.ended = !0 : requestAnimationFrame(this._bindAnim)
  }
  return _createClass(a, [{
    key: "stop",
    value: function stop() {
      this.ended || (this.ended = !0, cancelAnimationFrame(this._bindAnim))
    }
  }, {
    key: "_anim",
    value: function _anim() {
      if (!this.ended) {
        var e = (Date.now() - this.sTime) / this.d,
          f = this.sl,
          g = this.x - this.sl;
        1 < e && !this.ended && (this.stop(), e = 1), this.tjDeck.scrollWrap(this._easeOut(e, f, g, 1)), 1 > e && requestAnimationFrame(this._bindAnim)
      }
    }
  }, {
    key: "_easeOut",
    value: function _easeOut(e, f, g, h) {
      return e /= h, --e, g * (e * e * e + 1) + f
    }
  }]), a
}(),
  TJDeck = function () {
    function a() {
      _classCallCheck(this, a), this.version = "0.0.9", this.$wrap = document.querySelector(".js-app-columns"), this.wrapL = 0, this.scrollTask = null, this.options = this.getOptionObj(), this.setOptionFromObj(this.options), this.$options = this.createOptionPanel(), document.body.appendChild(this.$options), this.updateBlur(), this.updateLight()
    }
    return _createClass(a, [{
      key: "getOption",
      value: function getOption(e, f) {
        var g = localStorage.getItem("tj_deck_" + e);
        return g ? "true" == g : f
      }
    }, {
      key: "getOptionObj",
      value: function getOptionObj() {
        return {
          light: this.getOption("light", !0),
          light_clm: this.getOption("light_clm", !1),
          blur: this.getOption("blur", !1)
        }
      }
    }, {
      key: "setOption",
      value: function setOption(e, f) {
        localStorage.setItem("tj_deck_" + e, f)
      }
    }, {
      key: "setOptionFromObj",
      value: function setOptionFromObj(e) {
        for (var f = Object.keys(e), g = 0; g < f.length; g++) this.setOption(f[g], e[f[g]])
      }
    }, {
      key: "getClms",
      value: function getClms() {
        return this.$wrap.querySelectorAll("section.column")
      }
    }, {
      key: "back",
      value: function back() {
        if ("none" != this.$options.style.display) return this.updateOption(), void this.hideOptionPanel();
        var e = document.querySelector(".mdl-dismiss");
        if (e) return void e.click();
        if (this.isShownDrawer()) return void this.hideDrawer();
        var f = this.getClosestColumn(this.wrapL),
          g = f.querySelector(".js-column-back");
        if (g) return void g.click()
      }
    }, {
      key: "isShownItem",
      value: function isShownItem() {
        return !!document.querySelector(".mdl-dismiss") || this.isShownDrawer()
      }
    }, {
      key: "isShownDrawer",
      value: function isShownDrawer() {
        return !!document.querySelector(".hide-detail-view-inline")
      }
    }, {
      key: "hideDrawer",
      value: function hideDrawer() {
        var e = document.querySelector(".js-hide-drawer");
        e && e.click()
      }
    }, {
      key: "showDrawer",
      value: function showDrawer() {
        var e = document.querySelector(".js-show-drawer");
        e && e.click()
      }
    }, {
      key: "manageBack",
      value: function manageBack() {
        history.pushState(null, null, ""), window.addEventListener("popstate", function () {
          this.back(), history.pushState(null, null, "")
        }.bind(this))
      }
    }, {
      key: "observeModals",
      value: function observeModals() {
        for (var e = new MutationObserver(function (j) {
          for (var k, l, m = 0; m < j.length; m++) {
            k = j[m];
            for (var o = 0; o < k.addedNodes.length; o++) l = k.addedNodes[m], this.stopAnkerFromModal(l)
          }
        }.bind(this)), f = {
          attributes: !1,
          characterData: !0,
          childList: !0
        }, g = document.querySelectorAll(".js-modals-container, .js-modal"), h = 0; h < g.length; h++) e.observe(g[h], f)
      }
    }, {
      key: "stopAnkerFromModal",
      value: function stopAnkerFromModal(e) {
        for (var g, f = e.querySelectorAll("a"), h = function (k) {
          return k.preventDefault(), k.target.removeEventListener("click", h), !1
        }, j = 0; j < f.length; j++) g = f[j], g.href && g.href.match(/#$/) && g.addEventListener("click", h)
      }
    }, {
      key: "observeClms",
      value: function observeClms() {
        var e = new MutationObserver(function (g) {
          for (var h, j, k = 0; k < g.length; k++) j = g[k], j.addedNodes[0] && (h = j.addedNodes[0]), j.removedNodes[0] && (j.nextSibling instanceof Element ? h = j.nextSibling : j.previousSibling instanceof Element ? h = j.previousSibling : h = this.getClms()[0]);
          h && h instanceof Element && this.scrollWrapAnim(h.offsetLeft)
        }.bind(this));
        e.observe(this.$wrap, {
          attributes: !1,
          characterData: !1,
          childList: !0
        })
      }
    }, {
      key: "manageScroll",
      value: function manageScroll() {
        var e, g, h, f = Date.now(),
          j = null;
        document.querySelector(".js-app-columns-container").addEventListener("scroll", function (k) {
          //k.target.scrollLeft = 0
        }.bind(this)), document.querySelector(".js-app-columns").addEventListener("drag", function (k) {
          1 < k.touches.length || this.isShownItem() || (e = this._getPosObj(k), g = e, j = -1, f = Date.now(), h = this.getClosestColumn(this.wrapL))
        }.bind(this)), window.addEventListener("touchmove", function (k) {
          if (j) {
            if (0 > j) {
              var l = this._getPosObj(k);
              if (Math.abs(l.x - e.x) < Math.abs(l.y - e.y)) return void (j = 0);
              j = 1
            }
            if (1 == j) {
              this.scrollTask && this.scrollTask.stop();
              var l = this._getPosObj(k);
              g = l, this.options.light_clm || this.scrollWrap(this.wrapL + g.x - l.x)
            }
          }
        }.bind(this)), window.addEventListener("touchend", function () {
          if (!(1 > j)) {
            j = null;
            var p, l = Date.now(),
              m = g,
              o = e.x - m.x;
            0.5 <= Math.abs(o) / (l - f) ? 0 < o ? (p = h.nextElementSibling, this.hideMenu()) : (p = h.previousElementSibling, !p && this.showMenu()) : p = this.getClosestColumn(this.wrapL), p && p instanceof Element && this.scrollWrapAnim(p.offsetLeft)
          }
        }.bind(this))
      }
    }, {
      key: "scrollWrapAnim",
      value: function scrollWrapAnim(e) {
        this.scrollTask && this.scrollTask.stop(), this.scrollTask = new TJScrollTask(this, e, this.options.light_clm ? 0 : 500)
      }
    }, {
      key: "scrollWrap",
      value: function scrollWrap(e) {
        var f = this.getClms();
        0 > e || e > f[0].offsetWidth * (f.length - 1) || !isFinite(e) || (this.$wrap.style.transform = "translateX(" + -e + "px)", this.wrapL = e)
      }
    }, {
      key: "getClosestColumn",
      value: function getClosestColumn(e) {
        for (var h, f = this.getClms(), g = 0; g < f.length; g++)
          if (h = Math.abs(e - f[g].offsetLeft), h <= f[g].offsetWidth / 2) return f[g];
        return f[f.length - 1]
      }
    }, {
      key: "_getPosObj",
      value: function _getPosObj(e) {
        return {
          x: e.touches[0].pageX,
          y: e.touches[0].pageY
        }
      }
    }, {
      key: "hideMenu",
      value: function hideMenu() {
        document.body.classList.add("tj_hide_menu")
      }
    }, {
      key: "showMenu",
      value: function showMenu() {
        document.body.classList.remove("tj_hide_menu")
      }
    }, {
      key: "showTJSetting",
      value: function showTJSetting() { }
    }, {
      key: "addTJNav",
      value: function addTJNav() {
        var e = document.createElement("nav");
        e.classList.add("tj_nav"), e.appendChild(this.createTweetBtn()), e.appendChild(this.createSettingBtn()), document.querySelector(".js-app-content").appendChild(e)
      }
    }, {
      key: "createTweetBtn",
      value: function createTweetBtn() {
        var e = document.createElement("button");
        return e.classList.add("tj_tweet_btn", "Button", "Button--primary", "tweet-button"), e.innerHTML = "<i class=\"Icon icon-compose icon-medium\"></i>", e.addEventListener("click", this.showDrawer.bind(this)), e
      }
    }, {
      key: "createSettingBtn",
      value: function createSettingBtn() {
        var e = document.createElement("a");
        return e.classList.add("tj_setting_btn"), e.href = "javascript:void(0)", e.innerHTML = "<i class=\"Icon icon-settings\"></i>", e.addEventListener("click", this.showOptionPanel.bind(this)), e
      }
    }, {
      key: "createOptionPanel",
      value: function createOptionPanel() {
        var e = document.createElement("div");
        return e.classList.add("tj_options"), e.style.display = "none", e.innerHTML = "\n<p class=\"title\">TJDeck 設定</p>\n<div>(Customed by Cutls P: https://gist.github.com/cutls/<br>8787a55d2c1c53274e68a427966046a6)</div><div>\n\t<label for=\"tj_ops_light\">基本アニメーションをなくす:</label>\n\t<input type=\"checkbox\" name=\"tj_ops_light\" id=\"tj_ops_light\">\n</div>\n<div>\n\t<label for=\"tj_ops_light_clm\">カラム切り替えアニメーションをなくす:</label>\n\t<input type=\"checkbox\" name=\"tj_ops_light_clm\" id=\"tj_ops_light_clm\">\n</div>\n<div>\n\t<label for=\"tj_ops_blur\">カラムをぼかす(撮影用):</label>\n\t<input type=\"checkbox\" name=\"tj_ops_blur\" id=\"tj_ops_blur\">\n</div>\n<div>\n\t<p>Script Version: " + this.version + "</p>\n</div>\n<div>\n\t<a href=\"javascript:void(0)\" class=\"tj_ops_close\">閉じる</a>\n</div>\n", e.querySelector(".tj_ops_close").addEventListener("click", function () {
          this.updateOption(), this.hideOptionPanel()
        }.bind(this)), e
      }
    }, {
      key: "hideOptionPanel",
      value: function hideOptionPanel() {
        var e = this.$options;
        e.style.display = "none"
      }
    }, {
      key: "showOptionPanel",
      value: function showOptionPanel() {
        var e = this.$options;
        this.updateOptionPanel(e), e.style.display = ""
      }
    }, {
      key: "updateOptionPanel",
      value: function updateOptionPanel() {
        var e = this.$options;
        ["light", "light_clm", "blur"].forEach(function (f) {
          var g = e.querySelector("#tj_ops_" + f);
          g.checked = this.options[f]
        }.bind(this))
      }
    }, {
      key: "updateOption",
      value: function updateOption() {
        var e = this.$options;
        ["light", "light_clm", "blur"].forEach(function (f) {
          var g = e.querySelector("#tj_ops_" + f);
          this.options[f] = !!g && g.checked
        }.bind(this)), this.setOptionFromObj(this.options), this.updateBlur(), this.updateLight()
      }
    }, {
      key: "updateBlur",
      value: function updateBlur() {
        this.options.blur ? this.$wrap.classList.add("tj_blur") : this.$wrap.classList.remove("tj_blur")
      }
    }, {
      key: "updateLight",
      value: function updateLight() {
        this.options.light ? document.body.classList.add("tj_light") : document.body.classList.remove("tj_light")
      }
    }, {
      key: "manageStyle",
      value: function manageStyle() {
        this.addStyle();
        var e = window.innerWidth;
        window.addEventListener("resize", function () {
          if (e != window.innerWidth) {
            var f = document.querySelector("#tj_deck_css");
            f && f.remove(), this.addStyle(), this.scrollWrap(this.wrapL * (window.innerWidth / e)), e = window.innerWidth
          }
        }.bind(this))
      }
    }, {
      key: "refreshStyle",
      value: function refreshStyle() { }
    }, {
      key: "addStyle",
      value: function addStyle() {
        var e = document.querySelector("head"),
          f = document.createElement("style");
        f.type = "text/css", f.id = "tj_deck_css", f.innerHTML = "\nhtml {\n\t/*overscroll-behavior: none; プルダウンでリロードさせない */\n}\n\nbody.tj_light,\nbody.tj_light * {\n\ttransition-duration: 0ms!important;\n}\nbody.tj_light .inline-reply {\n\t/* 0にするとアニメーションイベントが発生せずに動作がおかしくなるので1ms */\n\ttransition-duration: 1ms!important;\n}\n\n.js-column-options {\n\tdisplay: none!important;\n}\n.is-options-open .js-column-options {\n\tdisplay: block!important;\n}\n\n/* TJDeck オプションパネル */\n.tj_options {\n\tposition: fixed;\n\twidth: 100%;\n\theight: 100%;\n\ttop: 0;\n\tleft: 0;\n\tpadding: 1em;\n\tbackground: #fff;\n\tcolor: #222;\n\tz-index: 300;\n}\n.tj_options .title {\n\tmargin-bottom: 1em;\n\tfont-size: 1.1em;\n\tfont-weight: bold;\n\ttext-align: center;\n}\n.tj_options > div {\n\tmargin: 1em 0;\n}\n.tj_options label,\n.tj_options input {\n\tdisplay: inline-block!important;\n\tmargin: 0!important;\n\tvertical-align: middle!important;\n}\n\n\n/* サイドメニューの表示切替 */\n.js-app-header {\n\tposition: fixed!important;\n}\n.tj_hide_menu .js-app-header {\n\ttransform: translateX(-50px);\n}\n\n/* メインの位置を左端に */\n.js-app-content {\n\tleft: 0!important;\n}\n\n\n/* サイドバーが出たらナビを隠す */\n.hide-detail-view-inline .tj_nav {\n\tdisplay: none;\n}\n\n.tj_tweet_btn {\n\tposition: fixed!important;\n\twidth: 60px!important;\n\theight: 60px!important;\n\tbottom: 1em!important;\n\tright: 1em!important;\n\tpadding: 0;\n\tbackground-color: #1da1f2;\n\tcolor: #fff;\n\tborder-radius: 36px;\n\tfont-size: 16px;\n\tline-height: 1em;\n\ttext-align: center;\n\tbox-shadow: 1px 1px 5px rgba(0, 0, 0, .5);\n\tz-index: 200;\n}\n.tj_tweet_btn .icon-compose,\n.tj_setting_btn .icon-settings {\n\tdisplay: inline-block;\n\tmargin-top: 0;\n\tfont-size: 20px!important;\n}\n.tj_setting_btn {\n\tposition: fixed;\n\twidth: 50px;\n\theight: 50px;\n\ttop: 0!important;\n\tright: 40px!important;\n\tbackground-color: transparent;\n\tcolor: #333;\n\ttext-align: center;\n\tbox-shadow: none;\n\tz-index: 200;\n}\n.tj_setting_btn > i.icon-settings {\n\tmargin-top: -2px;\n\tline-height: 50px;\n}\n\n.application {\n\tz-index: auto;\n}\n\n/* カラムの余白をなくす */\n.app-columns {\n\tpadding: 0!important;\n}\n\n\n/* カラムを幅いっぱいに表示 */\n.column {\n\twidth: " + document.body.clientWidth + "px!important;\n\theight: " + document.body.clientHeight + "px!important;\n\tmax-width: 600px!important;\n\tmargin: 0!important;\n}\n\n/* カラムの設定をabsoluteに */\n.js-column-options-container {\n\tposition: absolute!important;\n\twidth: 100%;\n}\n\n/* サイドパネルを表示したときにメインを動かなくする */\n.application > .app-content {\n\tmargin-right: 0!important;\n\ttransform: translateX(0px)!important;\n}\n\n/* メインエリアのスクロールを禁止 */\n#container {\n\toverflow: hidden!important;\n}\n\n/* サイドパネルを幅いっぱいに表示 */\n.js-drawer {\n\twidth: " + document.body.clientWidth + "px!important;\n\tmax-width: 600px!important;\n\t/*left: -" + document.body.clientWidth + "px!important;*/\n\tleft: 0!important;\n\ttransform: translateX(-" + document.body.clientWidth + "px);\n}\n.hide-detail-view-inline .js-drawer {/* 表示中 */\n\twidth: " + document.body.clientWidth + "px!important;\n\tmax-width: 600px!important;\n\t/*left: 0!important;*/\n\ttransform: translateX(0);\n\tz-index: 201!important;\n}\n.hide-detail-view-inline .js-drawer:after {\n\tdisplay: none!important;\n}\n\n/* サイドパネルのタイトルを消す */\n.js-docked-compose .compose-text-title {\n\tdisplay: none!important;\n}\n/* アカウント選択アイコン位置を上にずらす */\n.js-docked-compose .compose-accounts {\n\twidth: 200px!important;\n\tmargin-top: -50px;\n}\n\n/* ツイート入力エリアをすこし小さくする */\n.js-docked-compose .compose-text-container {\n\tpadding: 5px!important;\n}\n.js-docked-compose .js-compose-text {\n\theight: 90px!important;\n}\n\n/* ツイートボタンを大きく */\n.js-docked-compose .js-send-button {\n\twidth: 100px!important;\n\ttext-align: center;\n}\n\n/* 各種ボタンを小さくして横並びにする */\n.js-docked-compose .compose-content button.js-add-image-button,\n.js-docked-compose .compose-content .js-schedule-button,\n.js-docked-compose .compose-content .js-tweet-button,\n.js-docked-compose .compose-content .js-dm-button {\n\tdisplay: inline-block!important;\n\twidth: auto!important;\n}\n.js-docked-compose .compose-content .js-tweet-button.is-hidden,\n.js-docked-compose .compose-content .js-dm-button.is-hidden {\n\tdisplay: none!important;\n}\n.js-add-image-button > .label,\n.js-schedule-button > .label,\n.js-tweet-button > .label,\n.js-dm-button > .label {\n\tdisplay: none!important;\n}\n.js-add-image-button,\n.js-scheduler,\n.js-tweet-type-button {\n\tdisplay: inline-block;\n\ttransform: translateY(-65px);\n}\n\n\n/* サイドパネルのフッターを消す */\n.js-docked-compose > footer {\n\tdisplay: none!important;\n}\n.js-docked-compose .compose-content {\n\tbottom: 0!important;\n}\n\n/* サイドパネルのヘッダーを消す */\n.js-compose-header {\n\tposition: absolute!important;\n\tright: 20px!important;\n\tborder: 0!important;\n}\nheader.js-compose-header div.compose-title {\n\tdisplay: none!important;\n}\n.js-account-selector-grid-toggle {\n\tmargin-right: 50px!important;\n}\n\n/* モーダルの位置調整 */\n.overlay:before,\n.ovl-plain:before,\n.ovl:before {\n\tdisplay: none!important;\n}\n\n/* リツイートモーダルの幅設定 */\n#actions-modal > .mdl {\n\tmax-width: 100%!important;\n}\n\n/* モーダルのメディア表示調整 */\n.js-modal-panel .js-embeditem {/* 画面いっぱいに表示 */\n\theight: 100%!important;\n\ttop: 0!important;\n\tbottom: 0!important;\n}\n.js-modal-panel .js-embeditem iframe {\n\tmax-width: 100%!important;\n\tmax-height: 100%!important;\n}\n.js-modal-panel .js-med-tweet {/* ツイートを非表示 */\n\tdisplay: none!important;\n}\n\n/* 閉じるボタン */\n.js-modal-panel .mdl-dismiss {\n\tz-index: 2;\n}\n\n/* 画像表示を調整する */\n.js-modal-panel .js-embeditem {\n\tdisplay: flex!important;\n\tflex-direction: column;\n\tz-index: 1;\n}\n/* 画像表示部分 */\n.js-modal-panel .js-embeditem .l-table {\n\tposition: relative!important;\n\tdisplay: block!important;\n\theight: auto!important;\n\tflex: auto;\n}\n\n.js-modal-panel .js-embeditem .l-table div,\n.js-modal-panel .js-embeditem .l-table a {\n\tposition: static!important;\n}\n.js-modal-panel .js-embeditem .l-table .js-media-image-link {\n\tpointer-events: none;\n}\n\n/* 画像サイズ指定 */\n.js-modal-panel .js-embeditem .l-table img,\n.js-modal-panel .js-embeditem .l-table iframe {\n\tposition: absolute;\n\tmax-width: 100%!important;\n\tmax-height: 100%!important;\n\twidth: auto!important;\n\theight: auto!important;\n\ttop: 0!important;\n\tbottom: 0!important;\n\tleft: 0!important;\n\tright: 0!important;\n\tmargin: auto!important;\n}\n.js-modal-panel .js-embeditem .l-table iframe {\n\twidth: 100%!important;\n\theight: 100%!important;\n}\n\n/* 画像検索ボタンの位置調整 */\n.js-modal-panel .js-embeditem .l-table .reverse-image-search {\n\tposition: fixed!important;\n\tdisplay: block!important;\n\tleft: 10px!important;\n}\n\n/* 画像移動ボタンの表示位置を調整する */\n.js-modal-panel .js-embeditem .js-media-gallery-prev,\n.js-modal-panel .js-embeditem .js-media-gallery-next {\n\tposition: relative!important;\n\ttop: auto!important;\n\twidth: 50%!important;\n\theight: 60px!important;\n}\n.js-modal-panel .js-embeditem .js-media-gallery-next {\n\tmargin-top: -60px;\n\talign-self: flex-end;\n}\n\n/* 画像下部のリンクを非表示 */\n.med-origlink,\n.med-flaglink {\n\tdisplay: none!important;\n}\n\n\n/* デバッグ用モザイク */\n.tj_blur .js-stream-item-content {\n\tfilter: blur(5px);\n}\n.tj_blur section.column:nth-child(1) .js-stream-item-content {\n\tfilter: none;\n}\n", e.appendChild(f)
      }
    }]), a
  }();
window.tj_deck = null;

function tjDeckStart() {
  console.log("TJDeckスタート！！！"), window.tj_deck = new TJDeck, window.tj_deck.manageStyle(), window.tj_deck.manageScroll(), window.tj_deck.manageBack(), window.tj_deck.observeClms(), window.tj_deck.observeModals(), window.tj_deck.hideMenu(), window.tj_deck.addTJNav(), document.querySelector("textarea.js-compose-text").spellcheck = !1
}
if (document.querySelector(".js-app-columns")) tjDeckStart();
else var timer = setInterval(function () {
  document.querySelector(".js-app-columns") ? (tjDeckStart(), clearInterval(timer)) : console.log("まだロード中")
}, 500);
