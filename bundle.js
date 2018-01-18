/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var EAN13=__webpack_require__(1);
new EAN13('535350244626').draw('canvas', 2, 100);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var EAN13 = function(code) {
				this.code = code;

			}

			EAN13.prototype.init = function() {

				var code = this.format(this.code);

				var charset = {
					0: [0, 0, 0, 0, 0, 0],
					1: [0, 0, 1, 0, 1, 1],
					2: [0, 0, 1, 1, 0, 1],
					3: [0, 0, 1, 1, 1, 0],
					4: [0, 1, 0, 0, 1, 1],
					5: [0, 1, 1, 0, 0, 1],
					6: [0, 1, 1, 1, 0, 0],
					7: [0, 1, 0, 1, 0, 1],
					8: [0, 1, 0, 1, 1, 0],
					9: [0, 1, 1, 0, 1, 0]
				};
				var map = {
					0: ["0001101", "0100111", "1110010"],
					1: ["0011001", "0110011", "1100110"],
					2: ["0010011", "0011011", "1101100"],
					3: ["0111101", "0100001", "1000010"],
					4: ["0100011", "0011101", "1011100"],
					5: ["0110001", "0111001", "1001110"],
					6: ["0101111", "0000101", "1010000"],
					7: ["0111011", "0010001", "1000100"],
					8: ["0110111", "0001001", "1001000"],
					9: ["0001011", "0010111", "1110100"]
				}

				var front = code.substr(0, 1);
				var left = code.substr(1, 6);
				var right = code.substr(7);
				console.log(left);
				console.log(right);
				var start = '101'; //起始符
				var spl = '01010'; //中间符
				var end = '101'; //终止符
				var blank = '00000000000'; //空白区域，前面空白区域最少》=11，后面空白区域>=7
				var _charset = charset[front]; //前置码选择的编码类型
				var leftB = rightB = ''; //左侧、右侧二进制码
				for(i in left) {

					leftB += map[left[i]][_charset[i]];
				}

				for(i in right) {
					rightB += map[right[i]][2];
				}

				var checkCode = map[this.checkCode(code)][2];

				//拼接所有二进制码
				code = blank + start + leftB + spl + rightB + checkCode + end + blank;

				return code;

			}
			//检查传入的格式
			EAN13.prototype.format = function(code) {
				return code.length < 12 && false || code;

			}
			EAN13.prototype.checkCode = function(code) {
				var c1 = c2 = c = 0;
				for(i in code) {
					i % 2 == 0 && (c1 += parseInt(code[i])) || (c2 += parseInt(code[i]));

				}

				c = (10 - (c1 + c2 * 3) % 10) % 10;
				return c;

			}

			EAN13.prototype.draw = function(id, width, height) {

				var canvas = document.getElementById(id);
				var ctx = canvas.getContext('2d');

				var num = 0; //累计
				var binary = this.init();
				for(i in binary) {
					binary[i] == '0' && (ctx.fillStyle = 'white', ctx.fillRect(num * width, 0, width, height), true) || (ctx.fillStyle = 'black', ctx.fillRect(num * width, 0, width, height));

					num++;
				}

			}
			
module.exports=EAN13;

/***/ })
/******/ ]);