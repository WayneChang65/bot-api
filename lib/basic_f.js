'use strict';

/**
 * [自動將輸入的數字用0補足前面位數的函式]
 * @param       {[number]} num    [要補0的數字]
 * @param       {[number]} length [0加上去後的總位數]
 * @return      {[string]}        [補完0的數字]
 */
// 這裏length的引數，是包含num的位數。例如，想要00087的輸出，num要是87，length要給5，不是給 3！！！
function _numAddString0(num, length){
	for(let len = (num + '').length; len < length; len = num.length) {
		num = '0' + num;
	}
	return num;
}

/**
 * [依照輸入的上下限，取得上下限數字中間的任一亂數]
 * @param       {[type]} minNum [最小值]
 * @param       {[type]} maxNum [最大值]
 * @return      {[type]}        [最小與最大值中的任一亂數]
 */
function _getRandom(minNum, maxNum){
	return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
}

//////////////  Module Exports //////////////////
module.exports = {
	numAddString0 : _numAddString0,
	getRandom : _getRandom
};

