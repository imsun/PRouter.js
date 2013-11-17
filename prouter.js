window.PRouter = {
		prefix: '?',
		noKV: true,
		keys: {}, // store keys and functions
		kvdb: {}, // store KVPs
		start: function(options) {
			// check URL automatically when URL changes
			window.addEventListener("popstate", function() {
				PRouter._checkURL();
			}, false);

			// fire up the router by checking current URL
			this._checkURL();
		},
		setPrefix: function(prefix){
			this.prefix = prefix;
		},
		// bind function for key
		bind: function(key, callback) {
			this.keys[key] = callback;
		},
		bindForTag: function(tagName){
			var tag = tagName || 'a';
			var items = document.getElementsByTagName(tag);
			for (var i = 0; i < items.length; i++) {
				if (items[i].getAttribute('url-opt')) {
					items[i].onclick = function(){
					 	PRouter._generateURL(this.getAttribute('url-opt'), this.href);
					 	return false;
					};
				}
			};
		},
		// KVP operater
		get: function(key) {
			var keyVal = this._splitURL();
			return keyVal[key];
		},
		set: function(key, value, option) {
			var oldVal = this.kvdb[key];
			if (typeof(key) == 'object') {
				var opt = value || 'push';
				for (var item in key) {
					this.kvdb[key] = key[item];
				};
			}else{
				var opt = option || 'push';
				this.kvdb[key] = value;
			}
			if (opt != 'ignore') this._generateURL(opt);
			if (typeof(this.keys[key]) != 'undefined') {
				this.keys[key](value);
			};
		},
		remove: function(key, option) {
			if (!key) return false;
			var opt = option || 'push';
			if (typeof(key) == 'object') {
				for (var i = 0; i < key.length; i++) {
					delete this.kvdb[key[i]];
				};
			}else delete this.kvdb[key];
			if (opt != 'ignore') this._generateURL(opt);
		},
		clear: function() {
			this.kvdb = {};
			this._generateURL();
		},
		_checkURL: function() {

			//return false when prefix doesn't match the format
			if (location.href.split(this.prefix).length == 1) {
				if (!this.noKV) {
					location.reload();
				};
				return false;
			}
			this.noKV = false;

			var keyVal = this._splitURL();

			for (var key in this.kvdb){
				if (!keyVal[key]) {
					delete this.kvdb[key];
				};
			}
			for (var key in keyVal){
				if (typeof(this.keys[key]) != 'undefined' && this.kvdb[key] != keyVal[key]) {
					this.kvdb[key] = keyVal[key];
					this.keys[key](keyVal[key]);
				}
			}
		},
		// return an object whith key-values in it
		_splitURL: function(){
			if (location.href.split(this.prefix).length == 1) {
				return false;
			}
			var kvString = location.href.split(this.prefix)[1].split('#')[0];
			var kv = kvString.split('&');
			var keyVal = {};
			for (i = 0; i < kv.length; i++){
				keyVal[kv[i].split('=')[0]] = decodeURI(kv[i].split('=')[1]);
			}
			return keyVal;
		},
		_generateURL: function(option, url){
			var kvString = this.prefix;
			var opt = option || 'push';
			for (var key in this.kvdb){
				kvString +=  key + '=' + this.kvdb[key] + '&';
			};
			kvString = url || kvString;
			var stateObj = { 'PoweredBy': 'Dave Sun', 'MyBlog': 'www.imsun.net'};
			switch(opt){
				case 'push':
					history.pushState(stateObj, '', kvString);
				break;
				case 'replace':
					history.replaceState(stateObj, '', kvString);
				break;
				case 'go':
					location.href =	 kvString;
				break;
					history.pushState(stateObj, '', kvString);
				default:
			}
			PRouter._checkURL();
		}
};