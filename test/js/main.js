$(document).ready(function(){
	select(1);
	PRouter.bind('s', function(value){
		select(value);
	});
	PRouter.bind('loc', function(value){
		scrollTo(value);
	});
	PRouter.start();
	$('.tab').click(function(){
		PRouter.set('s', this.id.substring(3));
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
					PRouter.set('loc', 'title' + this.tgt);
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
$('#demo2').click(function(){
	var code = '\
<p onclick="alert(\'Current URL is: \' + location)"><a href="?msg=test1" url-opt="push">test1</a></p>\n\n\
<p onclick="alert(\'Current URL is: \' + location)"><a href="?msg=test2" url-opt="push">test2</a></p>\n\n\
\n\n\
<script src="prouter.js"></script>\n\n\
<script>\n\n\
PRouter.bindForTag("a");\n\n\
</script>';
	runDemmo(code);
});
$('#demo3').click(function(){
	var code = '\
<a onclick="PRouter.set(\'msg\', \'set\')">PRouter.set()</a><br>\n\n\
<a onclick="alert(\'The value of msg is: \' + PRouter.get(\'msg\'))">PRouter.get()</a><br>\n\n\
<a onclick="PRouter.remove(\'msg\');">PRouter.remove()</a><br>\n\n\
<a onclick="PRouter.clear();">PRouter.clear()</a>\n\n\
\n\n\
<script src="prouter.js"></script>';
	runDemmo(code);
});