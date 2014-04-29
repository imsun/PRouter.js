(() ->
	root = this
	PRouter = root.PRouter = {}
	rules = PRouter.rules = {}
	queryRules = PRouter.queryRules = {}
	_hasPushState = !!(this.history and this.history.pushState)

	PRouter.lastPath = 
		key: ''
		value: ''
	PRouter.lastQuery = {}

	# Start PRouter
	PRouter.start = ->
		# Use `setTimeout` to avoid duplicate routing in webkit.
		setTimeout(() ->
			root.addEventListener('popstate', (event) ->
				PRouter._checkURL()
			, false)
		, 0)
		PRouter._checkURL()

	# Add a route and call callbacks when event happens.
	# @param  {String}   route    A route like '/test/:num'.
	# @param  {Function} callback Called when event happens.
	# @param  {String}   event    Optional. The trigger event. Default 'change'.
	PRouter.route = (route, callback, event) ->
		pattern = this._getPattern(route)

		rules[pattern] = [] if not rules[pattern]
		rules[pattern].push
			fn: callback
			event: event or 'change'

	# Add a route to URL query and call callbacks when event happens.
	# @param  {String}   key      Any key in query.
	# @param  {Function} callback Called when event happens.
	# @param  {String}   event    Optional. The trigger event. Default 'change'.
	PRouter.queryRoute = (key, callback, event) ->
		queryRules[key] = [] if not queryRules[key]
		queryRules[key].push
			fn: callback
			event: event or 'change'

	# While tag have attribute 'push-href', the href will be pushed without jump.
	# @param  {String} tagName Optional. Default 'a'.
	PRouter.bindForTag = (tagName) ->
		tag = tagName or 'a'
		items = document.getElementsByTagName tag
		for i in [0..items.length - 1]
			hrefOpt = items[i].getAttribute 'href-opt'
			if hrefOpt
				items[i].onclick = (event) ->
					PRouter[this.getAttribute 'href-opt'] this.href
					event.preventDefault();

	# Use `pushState` to change current URL.
	# @param  {String} url    Target URL.
	# @param  {Boolean} checkURL Optional. Determin whether check URL after changing it. Default true.
	PRouter.push = (url, checkURL) ->
		config =
			back: location.href
		checkURL = checkURL or true

		if _hasPushState
			root.history.pushState(config, document.title, url)
			PRouter._checkURL() if checkURL
		else location.href = url

	# Use `pushState` to change current URL.
	# @param  {String} url    Target URL.
	# @param  {Boolean} checkURL Optional. Determin whether check URL after changing it. Default true.
	PRouter.replace = (url, checkURL) ->
		config =
			back: location.href
		checkURL = checkURL or true

		if _hasPushState
			root.history.replaceState(config, document.title, url)
			PRouter._checkURL() if checkURL
		else location.href = url

	# Check current URL and route.
	# @param  {String} url Optional. Default location.pathname.
	PRouter._checkURL = (url) ->
		url = url or location.pathname or ''
		regexp = new RegExp

		# Check location.pathname and route it.
		for pattern of rules
			regexp.compile pattern
			args = url.match regexp
			if args
				for i in [0..rules[pattern].length - 1]
					if PRouter._checkPathEvent(rules[pattern][i].event,
							key: pattern
							value: args.toString()
						)
						rules[pattern][i].fn.apply(this, args.slice 1)
				PRouter.lastPath =
					key: pattern
					value: args.toString()
				break

		# Check location.search and route it.
		query = PRouter._splitQuery()
		for key of query
			if typeof(PRouter.queryRules[key]) isnt 'undefined'
				for i in [0..PRouter.queryRules[key].length - 1]
					if PRouter._checkQueryEvent(PRouter.queryRules[key][i].event, query)
						PRouter.queryRules[key][i].fn.apply(this, [query[key]])
		PRouter.lastQuery = query

	# Generate RegExp pattern of a route.
	# @param  {String} route
	# @return {String}       Pattern string.
	PRouter._getPattern = (route) ->
		# From backbone.js :)
		optionalParam = /\((.*?)\)/g
		namedParam = /(\(\?)?:\w+/g
		splatParam = /\*\w+/g
		escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g
		pattern = route.replace(escapeRegExp, '\\$&')
						.replace(optionalParam, '(?:$1)?')
						.replace(namedParam, (match, optional) ->
							if optional
								return match
							else return '([^/?]+)'
						)
						.replace(splatParam, '([^?]*?)')
		'^' + pattern + '(?:\\?([\\s\\S]*))?$'

	# Check if the event happened.
	# @param  {String} event
	# @param  {Object} currentPath The path to exact.
	# @return {Bollean}            Return true when event happened otherwise false.
	PRouter._checkPathEvent = (event, currentPath) ->
		switch event
			when 'show' then return true
			else
				return true if PRouter.lastPath.value isnt currentPath.value
				return false

	# Check if the event happened.
	# @param  {String} event
	# @param  {Object} currentQuery The query to exact.
	# @return {Bollean}             Return true when event happened otherwise false.
	PRouter._checkQueryEvent = (event, currentQuery) ->
		for key of currentQuery
			switch event
				when 'show' then return true
				else
					return true if PRouter.lastQuery[key] isnt currentQuery[key]
					return false

	# Split URL query into object.
	# @param  {String} query Optional. Default location.search.
	# @return {Object}       Query object
	PRouter._splitQuery = (query) ->
		queryStr = query or location.search.substr 1
		queryStrArray = queryStr.split '&'
		queryObj = {}

		for i in [0..queryStrArray.length - 1]
			queryObj[queryStrArray[i].split('=')[0]] = queryStrArray[i].split('=')[1]

		return queryObj
)()