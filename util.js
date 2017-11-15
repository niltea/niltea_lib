// polyfill of Array.forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(callback, thisArg) {
		var T, k;

		if (this === null) {
			throw new TypeError(' this is null or not defined');
		}
		var O = Object(this);

		var len = O.length >>> 0;

		if (typeof callback !== 'function') {
			throw new TypeError(callback + ' is not a function');
		}

		if (arguments.length > 1) {
			T = thisArg;
		}

		k = 0;
		while (k < len) {
			var kValue;
			if (k in O) {
				kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k++;
		}
	};
}

// polyfill of Array.from
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		return function from(arrayLike) {
			var C = this;

			var items = Object(arrayLike);

			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			var len = toLength(items.length);

			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			var k = 0;
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			A.length = len;
			return A;
		};
	}());
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
		|| window[vendors[x]+'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};
	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
		clearTimeout(id);
	};
}());
export default new class Util{
	constructor() {
		this.browser = this.browser();
		// document.body.classList.add((this.browser.isPC) ? 'pc' : 'sp');
	}
	browser () {
		const ua = navigator.userAgent.toLowerCase();
		const getVer = (ua, sarchStr, endstr) => {
			// 開始位置を検出
			let start = ua.indexOf(sarchStr);
			if (start < 0) return undefined;

			// 開始位置を検索文字数ぶんシフト
			// バージョン文字数区切りのスペースの位置を探る（開始文字分減じて文字数とする）
			start += sarchStr.length;
			let end = ua.indexOf(endstr, start);
			end -= start;

			// バージョン文字を取り出しreturn
			return ua.substr(start, end).replace('_', '.');
		};

		// 返すオブジェクトを仮生成
		let browser = {
			isPC: true,
			isSP: false,
			isIE: false,
			isWebKit: false,
			isiOS: false,
			isAndroid: false,
			browserVer: null,
			OSVer: null
		};
		// IE
		if (ua.match(/msie|trident/)) {
			browser.isIE = true;
			browser.OSVer = 'windows ' + getVer(ua, 'windows ', ';');
			browser.browserVer = getVer(ua, 'msie ', ';');
			if (browser.browserVer === undefined) {
				browser.browserVer = parseFloat(getVer(ua, 'trident/', ';'), 10) + 4;
			}
		}
		//WebKit
		if (ua.match(/webkit/)) {
			browser.isWebKit= true;
		}
		// iOS系
		if (ua.match(/iphone|ipad/)) {
			browser.isPC = false;
			browser.isSP = true;
			browser.isiOS = true;
			browser.OSVer = getVer(ua, 'iphone os ', ' ');
		}
		// Android
		if (ua.match(/android/)) {
			browser.isPC = false;
			browser.isSP = true;
			browser.isAndroid = true;

			browser.OSVer = getVer(ua, 'android ', ';');
		}
		window.clickEv = (browser.isPC) ? 'click' : 'touchend';
		window.scrollEv = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		// 仮オブジェクト返す
		return browser;
	}

	/**
	* function addChild
	* @param {Object} param 生成する子要素の設定
	* param.parent {string} 生成した要素を挿入する親要素
	* param.after {boolean} 親要素の最後に追加するか
	* param.element {string ? div} 生成する要素のタグ名
	* param.id {string} 生成する要素に付けるID
	* param.class {string} 生成する要素に付けるclass
	*/
	addChild (param){
		var el = (param.element) ? param.element : 'div';
		var newEl = param.HTMLelement || document.createElement(el);
		var where;
		if (param.id) newEl.setAttribute('id', param.id);
		if (param.class) newEl.setAttribute('class', param.class);
		if (param.attr) {
			for (var key in param.attr) {
				newEl.setAttribute(key, param.attr[key]);
			}
		}
		// parentの指定が無いときは要素を返す
		if (!param.parent) {
			return newEl;
		}
		if(param.parent.firstChild) {
			where = (param.after) ? null : param.parent.firstChild;
		} else {
			where = null;
		}
		return param.parent.insertBefore(newEl, where);
	}
	// ブラウザ間の差異を吸収しつつscroll位置をセットする
	setScrollTop (top) {
		const tgt = (this.browser.isWebKit) ? document.body : document.documentElement;
		tgt.scrollTop = top;
	}
	getScrollTop () {
		const d = window.document;
		const b = d.body;
		return (window.pageYOffset) ?
			window.pageYOffset : (d.documentElement || b.parentNode || b).scrollTop;
	}

	// XSS対策：textをサニタイズする関数
	sanitizer (string) {
		if(typeof string !== 'string') {
			return string;
		}
		string = string.replace(/<img ([a-z=\-0-9 "]+)src="([a-z0-9:/.\-_]+).*/g, '{!img:$2:!img}');
		string = string.replace(/[&'`"<>/]/g, (match) => {
			return {
				'&': '&amp;',
				'\'': '&#x27;',
				'`': '&#x60;',
				'<': '&lt;',
				'"': '&quot;',
				'>': '&gt;',
				'/': '&#x2F;',
			}[match];
		});
		string = string.replace(/&lt;strong&gt;/g, '<strong>');
		string = string.replace(/&lt;&#x2F;strong&gt;/g, '</strong>');
		string = string.replace(/&lt;p&gt;/g, '<p>');
		string = string.replace(/&lt;&#x2F;p&gt;/g, '</p>');
		string = string.replace(/&lt;br &#x2F;&gt;/g, '<br />');
		string = string.replace(/{!img:(([a-z0-9:/.\-_]|&#x2F;)+):!img}/g, '<img src="$1">');
		return string;
	}

	// cookieのread/write
	cookieReader () {
		const cookie = document.cookie.split(';');
		let cookieObj = {};
		cookie.forEach(elm => {
			const ca = elm.indexOf('=');
			const key = elm.slice(0, ca).replace(/^\s/, '');
			const val = elm.slice(ca + 1);
			cookieObj[key] = val;
		});
		return cookieObj;
	}

	cookieSetter (key, value, expireHour) {
		const now = new Date().getTime();
		const extime = new Date(now + (60*60*1000*expireHour)).toGMTString();
		document.cookie = key + '=' + value + ';' + 'expires=' + extime;
	}

	cookieRemover (key) {
		const keys = (typeof key == 'string') ? [key] : key;
		if (key.constructor !== Array) return false;
		const extime = new Date().getTime();
		keys.forEach(item => {
			document.cookie = item + '=;expires=' + extime;
		});
	}
};
