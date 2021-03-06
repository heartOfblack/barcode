window.code128 = function(code) {
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
				console.log(sum + 'SUM');
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