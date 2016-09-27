// namespace
var NILTEA = NILTEA || {};

(function(window, undefined){
	"use strict";

	/**
	* function creates namespace
	* @param {String} 作成したいnamespace
	* @return {String} globalオブジェクト
	*/
	NILTEA.namespace = function (nsStr) {
		var
		parts = nsStr.split('.'),
		parent = NILTEA,
		i;

		// remove global object
		if (parts[0] === 'NILTEA') {
			parts = parts.slice(1);
		}

		for (i = 0; i < parts.length; i++){
			// if not exist object, create it as new object
			if (typeof(parent[parts[i]]) === 'undefined') {
				parent[parts[i]] = {};
			}
			// set child object as new parent
			parent = parent[parts[i]];
		}
		return parent;
	};

	// add utilties
	NILTEA.namespace('NILTEA.util');
	NILTEA.util = (function(){
		/**
		* function offers sort
		* @param {String} a, b: 比較文字列
		* @return {Number} a>bのとき: 1, a<bのとき: -1, a=bのとき: 0
		*/
		var sorter = function (a, b) {
			if (a > b) {
				return 1;
			} else if (a < b) {
				return -1;
			} else {
				return 0;
			}
		};
		return {
			sorter: sorter
		};
	}());

	/**
	* ブラウザ判定系
	* 即時実行関数 checkUA によって browser オブジェクト内のプロパティに環境をセットする
	**/
	NILTEA.browser = {};
	NILTEA.browser.getVer = function (ua, sarchStr, endstr) {
		var version, endStrPosition;

		// 開始位置を検出
		var startStrPosition = ua.indexOf(sarchStr);
		if (startStrPosition < 0) return undefined;

		// 開始位置を検索文字数ぶんシフト
		// バージョン文字数区切りのスペースの位置を探る（開始文字分減じて文字数とする）
		startStrPosition += sarchStr.length;
		endStrPosition = ua.indexOf(endstr, startStrPosition);
		endStrPosition -= startStrPosition;

		// バージョン文字を取り出し
		version = ua.substr(startStrPosition, endStrPosition);
		version = version.replace('_', '.');

		return version;
	};
	NILTEA.browser = function () {
		var _this = NILTEA.browser;
		var ua = navigator.userAgent;
		ua = ua.toLowerCase();
		var startStrPosition, endStrPosition, sarchStr;

		// 返すオブジェクトを仮生成
		var browser = {
			isPC: true,
			isSP: false,
			isIE: false,
			isiOS: false,
			isAndroid: false,
			browserVer: null,
			OSVer: null
		};
		// IE
		if (ua.match(/msie|trident/)) {
			// 環境セット
			browser.isIE = true;

			// browser.OSVer = 'windows ' + _this.getVer(ua, "windows ", ";");

			browser.browserVer = _this.getVer(ua, "msie ", ";");
			if (browser.browserVer === undefined) {
				browser.browserVer = parseFloat(_this.getVer(ua, "trident/", ";"), 10) + 4;
				browser.browserVer = browser.browserVer.toString();
			}
		}
		// iOS系
		if (ua.match(/iphone|ipad/)) {
			// 環境セット
			browser.isPC = false;
			browser.isSP = true;
			browser.isiOS = true;

			browser.OSVer = _this.getVer(ua, "iphone os ", " ");
		}
		// Android
		if (ua.match(/android/)) {
			// 環境セット
			browser.isPC = false;
			browser.isSP = true;
			browser.isAndroid = true;

			browser.OSVer = _this.getVer(ua, "android ", ";");
		}
		// 仮オブジェクト返す
		return browser;
	}();
}(this));