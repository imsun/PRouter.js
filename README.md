PRouter.js
==========

[Demo page(in Chinese)][imsun]

查看中文文档请[点击此处][imsun]

[imsun]: http://www.imsun.net/project/PRouter.js/

##Overview

###PRouter = pushState + router

PRouter is a URL router written in native javascript. You can add a route to either a URL path or a query.

PRouter also offers ways to operate URL. When we change current URL, the browser won't attempt to load it with HTML5 history API (pushState).

##Usage

Consider the following page, suppose the host is "www.imsun.net/".

``` html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<button id="button1" onclick="PRouter.push('/demo/1-1')">demo 1-1</button>
	<button id="button2" onclick="PRouter.push('/demo/1-2')">demo 1-2</button>
	<div id="container">
	</div>
	<script src="prouter.js"></script>
	<script>
	// function will be called when "/demo/:num" appears in URL or `num` changes, with `num` being param.
	PRouter.route('/demo/:num', function(num){
		document.getElementById('container').innerHTML = 'This is demo ' + num;
	});

	// start PRouter.
	PRouter.start();
	</script>
</body>
</html>
```
When we click `button1`, current URL will become "http://www.imsun.net/demo/1-1" but browser won't really load it, and the inner HTML of `container` will become "This is demo 1-1". 

Futher, sometimes we may want a easy access to change URL without refresh, then you can do like this.

``` html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<a href="/demo/2-1" href-opt="push">demo 2-1</a>
	<a href="/demo/2-2" href-opt="push">demo 2-2</a>
	<div id="container">
	</div>
	<script src="prouter.js"></script>
	<script>
	// function will be called when "/demo/:num" appear in URL or `num` changes, with `num` being param.
	PRouter.route('/demo/:num', function(num){
		document.getElementById('container').innerHTML = 'This is demo ' + num;
	});

	// bind click-event listeners to all `a` elements with `href-opt`.
	PRouter.bindForTag();

	// start PRouter.
	PRouter.start();
	</script>
</body>
</html>
```
This is a more friendly way to users and search engines. `PRouter.bindForTag()` will bind click-event listeners to all `a` elements with `href-opt`(will override previous listener). When it is clicked, PRouter will change current URL according to its href using `history.pushState()`.

##Methods

###`PRouter.start()`

It will start the router by add a listener to `popState`. Be sure it is put after `PRouter.route()` or `PRouter.queryRoute`.

###`PRouter.route(route, callback, event)`

- **route** _\[String\]_: a route such like '/demo' or '/demo/:num' or '/demo/p:num'.

- **callback** _\[Function\]_: It will be called when current URL match the route.

- **event** _\[String, optional\]_: Determin when the callback will be called. Default 'change'(when route matched first time or param in route changes), 'show'(everytime when route matched) is also avalible.

###`PRouter.queryRoute(key, callback, event)`

- **key** _\[String\]_: a key that may appears in URL query.

- **callback** _\[Function\]_: It will be called when the key appears in current URL or or value for it changes.

- **event** _\[String, optional\]_: Determin when the callback will be called. Default 'change'(when the key appears first time or value for it changes), 'show'(everytime when key is in URL) is also avalible.

###`PRouter.bindForTag(tagName)`

- **tagName** _\[String, optional\]_: Tag name for target elements. Default "a".

For a simpler usage of PRouter, you can run this function after elements being loaded. It will add a click-event listener to elements whose tag name is `tagName` and has `href-opt`(can be "push" or "replace"), such as `<a href="/demo" href-opt="push">demo</a>`.

###`PRouter.push(url, checkURL)`

- **url** _\[String\]_: Target URL.

- **checkURL** _\[Boolean\]_: Optional. Determin whether check URL after changing it. Default true.

###`PRouter.replace(url, checkURL)`

- **url** _\[String\]_: Target URL.

- **checkURL** _\[Boolean\]_: Optional. Determin whether check URL after changing it. Default true.
