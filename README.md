PRouter.js
==========

[Demo page(in Chinese)][imsun]

查看中文文档请[点击此处][imsun]

My English is poor, and I expect someone can help me correct this document.

[imsun]: http://www.imsun.net/project/PRouter.js/

##Overview

###PRouter = pushState + router

PRouter is a URL router written in native javascript. It will mark current URL with key-value pairs and add event listener to each KVP's changing. Once KVP changes, listener will be called with the value being parameter.

PRouter also offers a group of functions to operate URL. When we operate current URL, the browser won't attempt to load it with HTML5 history API (pushState).

##Usage

URL mark consists of two parts: prefix and KVPs.

For example, in `http://www.imsun.net/?s=1&p=hello-world`, "?s=1&p=hello-world" is the URL mark, where "?"(you can define it as you like) is prefix and "s=1&p=hello-world" is KVPs.

Consider the following page, suppose the URL for it is "http://www.imsun.net/".

``` html
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<p><a href="?tab=you_select_tab1" url-opt="push">tab1</a></p>
	<p><a href="?tab=you_select_tab2" url-opt="push">tab2</a></p>
	<div id="container">
	</div>
<script src="prouter.js"></script>
<script>
PRouter.bind('tab', function(value){ // function will be called when KVP changes
	document.getElementById('container').innerHTML = value;
});
PRouter.start(); // start PRouter
PRouter.bindForTag('a');
</script>
</body>
</html>
```
When we click tab1, current URL will become "http://www.imsun.net/?tab=1". But the browser won't attempt to load it, and the inner HTML of container will become "you_select_tab1". `PRouter.bindForTag` will change current URL when we click links whose name is 'a' and `url-opt` is 'push', `PRouter.bind` will bind a function to key 'tab' and `PRouter.start` will add event listener to URL changing and call the function bound to the key with the value being parameter.

##Methods

###`PRouter.start()`

It will start the router by add event listener to URL's changing and analyse current URL. Be sure that it is put after `PRouter.bind`.

###`PRouter.bind(key, listener)`

- **key** _\[string\]_: Necessary. The key you want to watch. Once it appears in URL mark or the value for it changes, the listener will be called with the value being parameter.

- **listener** _\[function\]_: Necessary. Refer words above. You can define it like `function(value){ /*some code...*/ }`.

It will  bind the function to key. Once the key appears in URL mark or the value for it changes, the function will be called with the value being parameter.

###`PRouter.bindForTag(tagName)`

- **tagName** _\[string\]_: NOT necessary. The target elements' tag name. Default tag is "a".

For a simpler usage of PRouter, you can run this function after elements being loaded. It will add listener to click event to elements whose tag is `tagName` and `url-opt` is "push", "replace" or "go", sunch as `<a href="?tab=1" url-opt="push"></a>`.

Suppose the element were clicked, case "push", current URL will become its href and it will be pushed into browser's history; case "replace", current URL will become its href and it will replace former URL in browser's history; case "go", the browser will load its href, just like there is no `url-opt`.

###`PRouter.setPrefix(prefix)`

- **prefix** _\[string\]_: Necessary. URL mark's prefix that you want to change to.

URL mark's default prefix is "?". It means that if there exist the prefix in URL and PRouter has started, PRouter will regard string after prefix (except URL hash) as URL mark. You can define it with this function as you like.

###KVP Operate Functions

Considering we use KVP in URL mark, PRouter offers a group of functions to operate KVPs.

####`PRouter.get(key)`

- **key** _\[string\]_: Necessary. Key for the value you want to get.

It will return key's value in URL mark.

####`PRouter.set(key, value, opt)` or `PRouter.set(KVPs, opt)`

- **key** _\[string\]_: Necessary. The key you want to set.

- **value** _\[string\]_: Necessary. The value you wang to set.

- **KVPs** _\[object\]_: Necessary. Several KVPs to change, such as `{"tab":"1", "p":"hello"}`.

- **opt** _\[string\]_: NOT necessary. The option you want to take when change URL mark and the defailt option is "push". Case "push", PRouter will generate a target URL and it will be pushed into browser's history; case "replace", PRouter will generate a target URL and it will replace former URL in browser's history; case "go", PRouter will generate a target URL and the browser will load it; case "ignore", the target URL won't be generated
until next KVP operate function works.

It will change the value for the key in URL mark. If there is no such key, it will add a new KVP in URL mark.

You can also use it as `PRouter.set({object}, opt)` to change several KVPs in one time.

####`PRouter.remove(key, opt)` or `PRouter.remove(KVPs, opt)`

- **key** _\[string\]_: Necessary. The key you want to remove.

- **KVPs** _\[object\]_: Necessary. Several KVPs you want to remove, such as `{"tab":"1", "p":"hello"}`.

- **opt** _\[string\]_: NOT necessary. Refer `PRouter.set`.

It will remove target KVP in URL mark.

####`PRouter.clear()`

It will clear URL mark.