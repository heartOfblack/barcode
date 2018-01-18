> 用于条码生成，当前只有EAN13商品条码生成

### 安装
```
浏览器导入：<script src="js/EAN13_b.js" type="text/javascript" charset="utf-8"></script>

NPM：install --save-dev canvas-barcode
require('canvas-barcode');
```

**调用draw方法，第一个参数是canvas的id，第二个参数为每个条形模块的宽度，第三个参数为条形码高度**
```
new EAN13('535350244626').draw('canvas', 2, 100);
```
