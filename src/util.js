/* eslint-disable no-extend-native */
// polyfill of Array.forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = (callback, thisArg) => {
		let T;
		let k;

		if (this === null) {
			throw new TypeError(' this is null or not defined');
		}
		const O = Object(this);

		const len = O.length >>> 0;

		if (typeof callback !== 'function') {
			throw new TypeError(`${callback} is not a function`);
		}

		if (arguments.length > 1) {
			T = thisArg;
		}

		k = 0;
		while (k < len) {
			if (k in O) {
				const kValue = O[k];
				callback.call(T, kValue, k, O);
			}
			k += 1;
		}
	};
}

// polyfill of Array.from
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
	Array.from = (() => {
		const toStr = Object.prototype.toString;
		const isCallable = fn => typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		const toInteger = (value) => {
			const number = Number(value);
			if (Number.isNaN(number)) { return 0; }
			if (number === 0 || !Number.isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		const maxSafeInteger = Math.pow(2, 53) - 1;
		const toLength = (value) => {
			const len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		return function from(arrayLike) {
			const C = this;

			const items = Object(arrayLike);

			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			const mapFn = arguments.length > 1 ? arguments[1] : undefined;
			let T;
			if (typeof mapFn !== 'undefined') {
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			const len = toLength(items.length);

			const A = isCallable(C) ? Object(new C(len)) : new Array(len);

			let k = 0;
			let kValue;
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
	})();
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
(() => {
	let lastTime = 0;
	const vendors = ['ms', 'moz', 'webkit', 'o'];
	for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[`${vendors[x]}RequestAnimationFrame`];
		window.cancelAnimationFrame = window[`${vendors[x]}CancelAnimationFrame`]
		|| window[`${vendors[x]}CancelRequestAnimationFrame`];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (callback) => {
			const currTime = new Date().getTime();
			const timeToCall = Math.max(0, 16 - (currTime - lastTime));
			const id = window.setTimeout(() => { callback(currTime + timeToCall); }, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = (id) => {
			clearTimeout(id);
		};
	}
})();

// options {
// 	target       : target DOM to handle
// 	button       : target DOM to trigger
// 	closeButton  : target DOM to close trigger
// 	visibleClass : (string) class name when target is visible
// 	hiddenClass    : (string) class name when target is hidden
// }
class OpenClose {
	constructor(options) {
		const self = this;
		this.button = options.button;
		this.target = options.target;
		const { closeButton } = options;
		this.visibleClass = options.visibleClass || 'is-visible';
		this.hiddenClass = options.hiddenClass || 'is-hidden';

		this.showCallback = options.showCallback;
		this.hideCallback = options.hideCallback;

		const initialShown = options.initialShown || false;

		if (!this.button || !this.target) return;
		// this.wrapper = document.getElementById('wrapper');
		this.isShown = false;
		this.scrollY = 0;
		this.button.addEventListener('click', this.tgtDisp.bind(this));
		if (closeButton) {
			if (closeButton.constructor === Array) {
				closeButton.forEach((button) => {
					button.addEventListener('click', self.toClose.bind(self));
				});
			} else {
				closeButton.addEventListener('click', self.toClose.bind(self));
			}
		}
		if (options.isCloseByTarget) {
			self.gnav.addEventListener('click', self.toClose.bind(self));
		}

		// 初期状態をセット
		this.tgtDisp(initialShown);
		if (options.initCallback) options.initCallback();
	}
	// 表示・非表示を切り替える関数
	//	opt		:	Boolean [true | false]
	// 	true	:	強制的に表示する
	// 	false	:	強制的に隠す
	// 	null	:	(default) 表示のトグル
	tgtDisp(opt) {
		let toShow = opt;
		if (opt.constructor !== Boolean) {
			// true/false以外が渡されたときは現在の表示状況に応じてオプションを設定
			toShow = this.isShown !== true;
		}
		if (toShow === true) {
			// to Show
			if (this.visibleClass) {
				this.target.classList.add(this.visibleClass);
				this.button.classList.add(this.visibleClass);
			}
			if (this.hiddenClass) {
				this.target.classList.remove(this.hiddenClass);
				this.button.classList.remove(this.hiddenClass);
			}
			this.isShown = true;
			// this.scrollY = util.getScrollTop();
			// this.wrapper.style.position = 'fixed';
			// this.wrapper.style.top = self.scrollY * -1 + 'px';
			if (this.showCallback) this.showCallback();
		} else {
			// to Hide
			if (this.visibleClass) {
				this.target.classList.remove(this.visibleClass);
				this.button.classList.remove(this.visibleClass);
			}
			if (this.hiddenClass) {
				this.target.classList.add(this.hiddenClass);
				this.button.classList.add(this.hiddenClass);
			}
			this.isShown = false;
			// this.wrapper.style.position = '';
			// this.wrapper.style.top = '';
			// util.setScrollTop(this.scrollY);
			if (this.hideCallback) this.hideCallback();
		}
	}
	toClose() { this.tgtDisp(false); }
}

class Util {
	static browserEnv() {
		const ua = navigator.userAgent.toLowerCase();
		const getVer = (tmpAgent, sarchStr, endstr) => {
			// 開始位置を検出
			let start = tmpAgent.indexOf(sarchStr);
			if (start < 0) return undefined;

			// 開始位置を検索文字数ぶんシフト
			// バージョン文字数区切りのスペースの位置を探る（開始文字分減じて文字数とする）
			start += sarchStr.length;
			let end = tmpAgent.indexOf(endstr, start);
			end -= start;

			// バージョン文字を取り出しreturn
			return tmpAgent.substr(start, end).replace('_', '.');
		};

		// 返すオブジェクトを仮生成
		const probBrowser = {
			isPC      : true,
			isSP      : false,
			isIE      : false,
			isWebKit  : false,
			isiOS     : false,
			isAndroid : false,
			browserVer: null,
			OSVer     : null,
		};
		// IE
		if (ua.match(/msie|trident/)) {
			probBrowser.isIE = true;
			probBrowser.OSVer = `windows ${getVer(ua, 'windows ', ';')}`;
			probBrowser.browserVer = getVer(ua, 'msie ', ';');
			if (probBrowser.browserVer === undefined) {
				probBrowser.browserVer = parseFloat(getVer(ua, 'trident/', ';'), 10) + 4;
			}
		}
		// WebKit
		if (ua.match(/webkit/)) {
			probBrowser.isWebKit = true;
		}
		// iOS系
		if (ua.match(/iphone|ipad/)) {
			probBrowser.isPC = false;
			probBrowser.isSP = true;
			probBrowser.isiOS = true;
			probBrowser.OSVer = getVer(ua, 'iphone os ', ' ');
		}
		// Android
		if (ua.match(/android/)) {
			probBrowser.isPC = false;
			probBrowser.isSP = true;
			probBrowser.isAndroid = true;

			probBrowser.OSVer = getVer(ua, 'android ', ';');
		}
		window.clickEv = (probBrowser.isPC) ? 'click' : 'touchend';
		window.scrollEv = (() => {
			if ('onwheel' in document) return 'wheel';
			if ('onmousewheel' in document) return 'mousewheel';
			return 'DOMMouseScroll';
		})();
		// 仮オブジェクト返す
		return probBrowser;
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
	static addChild(param) {
		const el = (param.element) ? param.element : 'div';
		const newEl = param.HTMLelement || document.createElement(el);
		let where;
		if (param.id) newEl.setAttribute('id', param.id);
		if (param.class) newEl.setAttribute('class', param.class);
		if (param.attr) {
			Object.keys(param.attr).forEach((key) => {
				newEl.setAttribute(key, param.attr[key]);
			});
		}
		// parentの指定が無いときは要素を返す
		if (!param.parent) {
			return newEl;
		}
		if (param.parent.firstChild) {
			where = (param.after) ? null : param.parent.firstChild;
		} else {
			where = null;
		}
		return param.parent.insertBefore(newEl, where);
	}
	// ブラウザ間の差異を吸収しつつscroll位置をセットする
	static setScrollTop(top) {
		let tgt;
		if ('scrollingElement' in document) {
			tgt = document.scrollingElement;
		} else if (this.browser.isWebKit) {
			tgt = document.body;
		} else {
			tgt = document.documentElement;
		}
		tgt.scrollTop = top;
	}
	static getScrollTop() {
		const d = window.document;
		const b = d.body;
		return (window.pageYOffset) ?
			window.pageYOffset : (d.documentElement || b.parentNode || b).scrollTop;
	}
	static getScrollLeft() {
		const d = window.document;
		const b = d.body;
		return (window.pageXOffset) ?
			window.pageXOffset : (d.documentElement || b.parentNode || b).scrollLeft;
	}

	// XSS対策：textをサニタイズする関数
	static sanitizer(string) {
		if (typeof string !== 'string') {
			return string;
		}
		let replaced = string;
		replaced = replaced.replace(/<img ([a-z=\-0-9 "]+)src="([a-z0-9:/.\-_]+).*/g, '{!img:$2:!img}');
		replaced = replaced.replace(/[&'`"<>/]/g, (match) => {
			const matchObj = {
				'&' : '&amp;',
				'\'': '&#x27;',
				'`' : '&#x60;',
				'<' : '&lt;',
				'"' : '&quot;',
				'>' : '&gt;',
				'/' : '&#x2F;',
			};
			return matchObj[match];
		});
		replaced = replaced.replace(/&lt;strong&gt;/g, '<strong>');
		replaced = replaced.replace(/&lt;&#x2F;strong&gt;/g, '</strong>');
		replaced = replaced.replace(/&lt;p&gt;/g, '<p>');
		replaced = replaced.replace(/&lt;&#x2F;p&gt;/g, '</p>');
		replaced = replaced.replace(/&lt;br &#x2F;&gt;/g, '<br />');
		replaced = replaced.replace(/{!img:(([a-z0-9:/.\-_]|&#x2F;)+):!img}/g, '<img src="$1">');
		return replaced;
	}

	static OpenClose(opts) {
		return new OpenClose(opts);
	}

	// cookieのread/write
	static getCookie() {
		const cookie = document.cookie.split(';');
		const cookieObj = {};
		cookie.forEach((elm) => {
			const ca = elm.indexOf('=');
			const key = elm.slice(0, ca).replace(/^\s/, '');
			const val = elm.slice(ca + 1);
			cookieObj[key] = val;
		});
		return cookieObj;
	}

	static setCookie(key, value, expireHour) {
		const now = new Date().getTime();
		const extime = new Date(now + (60 * 60 * 1000 * expireHour)).toGMTString();
		document.cookie = `${key}=${value};expires=${extime}`;
	}

	static removeCookie(key) {
		const keys = (typeof key === 'string') ? [key] : key;
		if (key.constructor !== Array) return false;

		keys.forEach((item) => {
			this.setCookie(item, null, 0);
		});
		return true;
	}
}
Util.browserEnv();
export default Util;
