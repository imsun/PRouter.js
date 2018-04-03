
PRouter.js
==========

[Demo page(in Chinese)][imsun]

查看中文文档请[点击此处][imsun]

[imsun]: http://www.imsun.net/project/PRouter.js/

## Overview

### PRouter = pushState + router

PRouter is a front-end library written in native javascript to modify and monitor the URL.

PRouter uses `pushState` to manage the URL. The histories are well maintained so that when the URL is change, the correspond page will be present. This library allows a developer to modify the URL without refreshing the webpage.

## Usage

Considering the following page, suppose the host is "www.imsun.net/".

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
When we click `button1`, the current URL will become "http://www.imsun.net/demo/1-1". However, browser won't really load it, and the inner HTML of `container` will become "This is demo 1-1". 

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
This is a friendlier way to users and search engines. `PRouter.bindForTag()` will bind click-event listeners to all `a` elements with `href-opt` attributes (will override previous listener). When a link is clicked, PRouter will change the current URL according to its href using `history.pushState()`.

## Methods

### `PRouter.start()`

It will start the router by adding a listener to `popState`. Be sure to put the listener after `PRouter.route()` or `PRouter.queryRoute`.

### `PRouter.route(route, callback, event)`

- **route** _\[String\]_: A route such like '/demo' or '/demo/:num' or '/demo/p:num'.

- **callback** _\[Function\]_: It will be called when the current URL matches the route.

- **event** _\[String, optional\]_: Determin when the callback will be called. The default is 'change' (when route matched first time or param in route changes). You may also use 'show'(everytime when route matched).

### `PRouter.queryRoute(key, callback, event)`

- **key** _\[String\]_: A key may appear in URL query.

- **callback** _\[Function\]_: It will be called when the key appears in current URL or value for it changes.

- **event** _\[String, optional\]_: Determin when the callback will be called. The default is 'change'(when the key appears first time or value for it changes). You may also use 'show'(everytime when key is in URL).

### `PRouter.bindForTag(tagName)`

- **tagName** _\[String, optional\]_: Tag name for target elements. Default "a".

For a simpler usage of PRouter, you can run this function after elements being loaded. It will add a click-event listener to elements whose tag name is `tagName` and has `href-opt`(can be "push" or "replace") attribute, such as `<a href="/demo" href-opt="push">demo</a>`.

### `PRouter.push(url, checkURL)`

- **url** _\[String\]_: Target URL.

- **checkURL** _\[Boolean\]_: Optional. Determin whether check URL after changing it. Default true.

### `PRouter.replace(url, checkURL)`

- **url** _\[String\]_: Target URL.

- **checkURL** _\[Boolean\]_: Optional. Determin whether check URL after changing it. Default true.
