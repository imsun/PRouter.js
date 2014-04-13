$(document).ready(function(){
	select(1);
	PRouter.route('/tab/:num', function(num){
		select(num);
	});
	PRouter.queryRoute('loc', function(value){
		scrollTo(value);
	});
	PRouter.start();
	$('.tab').click(function(){
		PRouter.push('/tab/' + this.id.substring(3));
	});
	catalogInit();
});
var scrollTop = {};
var selected;
function _(id){
	return document.getElementById(id);
}
function scrollTo(loc, old){
	var top = isNaN(loc) ? (_(loc).offsetTop - 81) || 0 : loc;
	var n = selected || 1;
	var id = 'page' + n;
	var element = _(id) || document.body;
	var oldTop = element.scrollTop;
	var speed = parseInt(Math.abs(element.scrollTop - top) / 20);
	if (element.scrollTop == top || element.scrollTop == old) return false;
	element.scrollTop += element.scrollTop < top ? speed : -speed;
	setTimeout(function(){scrollTo(top, oldTop)}, 1);
}
function select(count){
	var n = count || 1;
	_('container').style.left = 100 * (1 - n) + '%';
	scrollTop[n] = scrollTop[n] || 0;
	if (selected) {
		scrollTop[selected] = _('page' + selected).scrollTop;
		_('page' + selected).style.overflowY = 'hidden';
		_('tab' + selected).className = 'tab';
		setTimeout(function(){
			_('page' + n).style.overflowY = 'auto';
			//scrollTo(scrollTop[n]);
		}, 500);
	}else{
		setTimeout(function(){
			_('container').className += ' animation';
		}, 1);
	}
	
	_('tab' + n).className += ' selected';
	selected = n;
}
function catalogInit(catalogId){
	var id = catalogId || 'catalog';
	var count = 0;
	var nodes = $('#' + id).find('li');
	for (var i = 0; i < nodes.length; i++) {
		var length = nodes[i].childNodes.length;
		for (var j = 0; j < nodes[i].childNodes.length; j++) {
			if(nodes[i].childNodes[j].nodeName == 'A'){
				count++;
				nodes[i].childNodes[j].tgt = count;
				nodes[i].childNodes[j].addEventListener('click', function(){
					PRouter.push('?loc=' + 'title' + this.tgt);
				});
				break;
			};
		};
	};
}

function runDemmo(demoCode){
	var code = demoCode || '';
	var inner = '<!DOCTYPE html>\
	<html>\
	<head>\
	<title>Demo</title>\
	<meta charset="utf-8" />\
	<link rel="stylesheet" href="css/googlecode.css">\
	<style>\
	body{background:#333}\
	a,a:link,a:visited{text-decoration: underline;cursor: pointer;color: #276677;}\
	.main{margin:0 auto;width:1050px;}\
	textarea,.show{font-family:mon-space;float:left;margin:10px;border:0;width:1000px;height:300px;background:#fff;}\
	</style>\
	</head>\
	<body>\
	<div class="main">\
		<textarea readonly="readonly">' + code +
		'</textarea>\
		<div class="show">' + code + '\
		</div>\
	</div>\
	</body>\
	</html>'
	var openWindow = window.open();
	openWindow.document.write(inner);
}
$('#demo1').click(function(){
	var code = '\
<!DOCTYPE html>\n\
<html>\n\
<head>\n\
</head>\n\
<body>\n\
	<button id="button1" onclick="PRouter.push(\'/demo/1-1\')">demo 1-1</button>\n\
	<button id="button2" onclick="PRouter.push(\'/demo/1-2\')">demo 1-2</button>\n\
	<div id="container"></div>\n\
	<script src="prouter.js"></script>\n\
	<script>\n\
	// 当 "/demo/:num" 出现在 URL 中或 `num` 的值改变时回调函数就会被执行, 同时 `num` 将作为函数参数.\n\
	PRouter.route(\'/demo/:num\', function(num){\n\
		document.getElementById(\'container\').innerHTML = \'This is demo \' + num;\n\
	});\n\
\n\
	// 启动 PRouter.\n\
	PRouter.start();\n\
	</script>\n\
</body>\n\
</html>';
	runDemmo(code);
});
$('#demo2').click(function(){
	var code = '\
<!DOCTYPE html>\n\
<html>\n\
</head>\n\
<body>\n\
	<a href="/demo/2-1" href-opt="push">demo 2-1</a>\n\
	<a href="/demo/2-2" href-opt="push">demo 2-2</a>\n\
	<div id="container"></div>\n\
	<script src="prouter.js"></script>\n\
	<script>\n\
	// 当 "/demo/:num" 出现在 URL 中或 `num` 的值改变时回调函数就会被执行, 同时 `num` 将作为函数参数.\n\
	PRouter.route(\'/demo/:num\', function(num){\n\
		document.getElementById(\'container\').innerHTML = \'This is demo \' + num;\n\
	});\n\
	\n\
	// 向所有有 `href-opt` 属性的 `a` 元素绑定点击事件.\n\
	PRouter.bindForTag();\n\
	\n\
	// 启动 PRouter.\n\
	PRouter.start();\n\
	</script>\n\
</body>\n\
</html>';
	runDemmo(code);
});