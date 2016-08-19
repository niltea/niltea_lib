// namespace
var NILTEA = NILTEA || {};

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
