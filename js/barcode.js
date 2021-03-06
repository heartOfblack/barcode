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

//============================code123 A/B类编码.C类自行将注释的内容，执行就行了
var code128 = function(code) {
				this.code = code;
				this.BARS = [
						212222, 222122, 222221, 121223, 121322, 131222, 122213,
						122312, 132212, 221213, 221312, 231212, 112232, 122132, 122231,
						113222, 123122, 123221, 223211, 221132, 221231, 213212, 223112, 312131,
						311222, 321122, 321221, 312212, 322112, 322211, 212123, 212321, 232121,
						111323, 131123, 131321, 112313, 132113, 132311, 211313, 231113, 231311,
						112133, 112331, 132131, 113123, 113321, 133121, 313121, 211331, 231131,
						213113, 213311, 213131, 311123, 311321, 331121, 312113, 312311, 332111,
						314111, 221411, 431111, 111224, 111422, 121124, 121421, 141122, 141221,
						112214, 112412, 122114, 122411, 142112, 142211, 241211, 221114, 413111,
						241112, 134111, 111242, 121142, 121241, 114212, 124112, 124211, 411212,
						421112, 421211, 212141, 214121, 412121, 111143, 111341, 131141, 114113,
						114311, 411113, 411311, 113141, 114131, 311141, 411131, 211412, 211214,
						211232, 2331112
					]

					,
					this.STARTA = 103,
					this.STARTB = 104,
					this.STARTC = 105,
					this.STOP = 106;
				this.bancodeIndex = [], this.resData = '', this.startType;
			}

			code128.prototype.bs = function(bandCode) {

				for(y in bandCode) {

					for(t = 0; t < parseInt(bandCode[y]); t++) {

						y % 2 == 0 && (this.resData += 'b', true) || (this.resData += 's')

					}

				}

			}

			code128.prototype.checkCode = function() {
				var sum = 0; //初始的开始位
				switch(this.startType) {
					case this.BARS[this.STARTA] + '':
						sum = 103;
						break;
					case this.BARS[this.STARTB] + '':
						sum = 104;
						break;
					case this.BARS[this.STARTC] + '':
						sum = 105;
						break;
				}
				for(i in this.bancodeIndex) {

					sum += (parseInt(i) + 1) * this.bancodeIndex[i];

				}

				return this.BARS[sum % 103];

			}

			code128.prototype.draw = function(id, width, height) {
				var num = 0;
				var canvas = document.getElementById(id);
				var ctx = canvas.getContext('2d');
				var offset = 32; //ASCII编码表偏差，如果是A.B类，偏差32，如果是C类纯数字，偏差48
				//判断 输入的条码 用ABC哪种编码比较适合
				/*if(/^\d*$/.test(this.code)&&this.code.length%2==0)
				{
					//如果是偶数位，且为存数字，则用C类
					this.startType=this.BARS[this.STARTC] + '';
					offset=48;
					console.log('C类');
					
				}
				else*/
				if(/[a-z]+/.test(this.code)) {

					this.startType = this.BARS[this.STARTB] + '';
				
				} else {

					this.startType = this.BARS[this.STARTA] + '';
					
				}

				this.bs(this.startType); //起始符

				//数据符号
				for(i in this.code) {
					var bandCode = this.BARS[this.code[i].charCodeAt() - offset] + '';
					this.bancodeIndex.push((this.code[i].charCodeAt() - offset));
					this.bs(bandCode);

				}

				this.bs(this.checkCode() + ''); //校验码
				this.bs(this.BARS[this.STOP] + ''); //
				for(i in this.resData) {
					this.resData[i] == 's' && (ctx.fillStyle = 'white', ctx.fillRect(num * width, 0, width, height), true) || (ctx.fillStyle = 'black', ctx.fillRect(num * width, 0, width, height));
					num++;
				}

			}



module.exports = {EAN13:EAN13,code128:code128};