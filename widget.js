/*
 @licstart  The following is the entire license notice for the
    JavaScript code in this page.

 Copyright (C) 2014 Center for Rights in Action
 Copyright (C) 2014 Jeff Lyon

 The JavaScript code in this page is free software: you can
 redistribute it and/or modify it under the terms of the GNU
 General Public License (GNU GPL) as published by the Free Software
 Foundation, either version 3 of the License, or (at your option)
 any later version. The code is distributed WITHOUT ANY WARRANTY;
 without even the implied warranty of MERCHANTABILITY or FITNESS
 FOR A PARTICULAR PURPOSE. See the GNU GPL for more details.

 As additional permission under GNU GPL version 3 section 7, you
 may distribute non-source (e.g., minimized or compacted) forms of
 that code without the copy of the GNU GPL normally required by
 section 4, provided you include this license notice and a URL
 through which recipients can access the Corresponding Source.

 @licend  The above is the entire license notice
    for the JavaScript code in this page.
*/

(function(){ // :)

// Default URL for animation iframe. This gets overlay'ed over your page.
var dfurl = 'https://widget.substacks.com/stacks/sms-marketing/coupon-webpage-embed';


/**
--------------------------------------------------------------------------------
CONFIGURATION OPTIONS
--------------------------------------------------------------------------------
These are default configuration values for the widget. You can override any of
these by pre-defining an object named _substacks_smsmcwe_options and setting the appropriate
properties as desired.
--------------------------------------------------------------------------------
*/

// The _substacks_smsmcwe_options object is created if it isn't already defined by you
if (typeof _substacks_smsmcwe_options == "undefined")
	_substacks_smsmcwe_options = {};

// The path to the iframe that gets injected over your page
if (typeof _substacks_smsmcwe_options.iframe_base_path == "undefined")
	_substacks_smsmcwe_options.iframe_base_path = dfurl;

// How long to delay before showing the widget
if (typeof _substacks_smsmcwe_options.delay == "undefined")
	_substacks_smsmcwe_options.delay = 0;

// If set to true, we will log stuff to the console
if (typeof _substacks_smsmcwe_options.debug == "undefined")
	_substacks_smsmcwe_options.debug = true;

// Usually a cookie is used to only show the widget once. You can override here.
if (typeof _substacks_smsmcwe_options.always_show_widget == "undefined")
	_substacks_smsmcwe_options.always_show_widget = true;

/**
--------------------------------------------------------------------------------
ANIMATION DEFINITIONS
--------------------------------------------------------------------------------
Here's where the functionality and defaults for each of the animations (either
"modal" or "banner" to begin with). Each animation has its own options property,
which is an object containing default behaviors for that animation. These can be
overridden by passing the appropriately-named properties into the _substacks_smsmcwe_options
object (above). This will get merged over the defaults when init is called.
--------------------------------------------------------------------------------
*/
var _substacks_smsmcwe_animations = {

	// MODAL ANIMATION
	modal: {

		// Default options: Override these with _substacks_smsmcwe_options object (see above)
		options: {
			modalAnimation: 'modal',
			skipEmailSignup: false,
			skipCallTool: false,
			fastAnimation: false,
			boxUnchecked: false,
			org: null
		},

		// init copies the _substacks_smsmcwe_options properties over the default options
		init: function(options) {
			for (var k in options) this.options[k] = options[k];
			return this;
		},

		// what to do when the animation starts
		start: function() {
			var css = '#_substacks_smsmcwe_iframe { position: fixed; left: 0px; top: 0px; \
				width: 100%; height: 100%; z-index: 100001; }'

			_substacks_smsmcwe_util.injectCSS('_substacks_smsmcwe_iframe_css', css);

			var iframe = _substacks_smsmcwe_util.createIframe(this.options.modalAnimation);
			_substacks_smsmcwe_util.bindIframeCommunicator(iframe, this);
		}
	},

	// BANNER ANIMATION
	banner: {

		// Default options: Override these with _substacks_smsmcwe_options object (see above)
		options: {
			modalAnimation: 'banner',
			position: 'topright', // topright|bottomright
			width: 430,
			height: 104,
			offsetY: 20,
			url: 'https://www.battleforthenet.com',
			theme: 'light'
		},

		// init copies the _substacks_smsmcwe_options properties over the default options
		init: function(options) {
			for (var k in options) this.options[k] = options[k];
			return this;
		},

		// what to do when the animation starts
		start: function() {

			console.log('width: ', this.options.width);

			switch (this.options.position) {

				case 'bottomright':
					var pos = 'bottom: '+this.options.offsetY+'px; right: 0px;';
					var stripPos = 'bottom';
					break;

				default:
					var pos = 'top: '+this.options.offsetY+'px; right: 0px;'
					var stripPos = 'top';
					break;
			}

			// The window must be a certain width to show the floating banner
			// otherwise it will be fixed to the top / bottom
			var minFloatWidth = this.options.width-1;

			var css = '#_substacks_smsmcwe_iframe { \
					position: fixed; '+pos+' \
					width: '+this.options.width+'px; \
					height: '+this.options.height+'px; \
					z-index: 100001; \
				} \
				@media (max-width:'+minFloatWidth+'px) { \
					#_substacks_smsmcwe_iframe { \
						position: absolute; \
						width: 100%; \
						left: 0px; \
						'+stripPos+': 0px; \
					} \
				}';

			_substacks_smsmcwe_util.injectCSS('_substacks_smsmcwe_iframe_css', css);

			var iframe = _substacks_smsmcwe_util.createIframe(this.options.modalAnimation);
			_substacks_smsmcwe_util.bindIframeCommunicator(iframe, this);
		}
	}
}

/**
--------------------------------------------------------------------------------
UTILITY FUNCTIONS
--------------------------------------------------------------------------------
*/
var _substacks_smsmcwe_util = {

	// Inject CSS styles into the page
	injectCSS: function(id, css)
	{
		var style = document.createElement('style');
		style.type = 'text/css';
		style.id = id;
		if (style.styleSheet) style.styleSheet.cssText = css;
		else style.appendChild(document.createTextNode(css));
		document.head.appendChild(style);
	},

	// Create the iframe used to display the animation  
	createIframe: function(animation) {
		var iframe = document.createElement('iframe');
		iframe.id = '_substacks_smsmcwe_iframe';
		iframe.src = _substacks_smsmcwe_options.iframe_base_path + '.php';
		iframe.frameBorder = 0;
		iframe.allowTransparency = true; 
		iframe.style.display = 'none';
		document.body.appendChild(iframe);
		return iframe;
	},

	// Get the hostname of the web page. Used to track stats for leaderboards
	getHostname: function() {
		var hostname = window.location.host.replace('www.', '');
		return hostname;
	},

	// If _substacks_smsmcwe_options.debug is on, then console.log some stuff
	log: function() {
		if (_substacks_smsmcwe_options.debug)
			console.log.apply(console, arguments);
	}
}

/**
--------------------------------------------------------------------------------
MAIN FUNCTIONALITY (called once the page is ready)
--------------------------------------------------------------------------------
*/
var ready = function() {

	setTimeout(function() {
		animation.init(_substacks_smsmcwe_options).start();
	}, _substacks_smsmcwe_options.delay);
	
}

// Wait for DOM content to load.
var curState = document.readyState;
if (curState=="complete" || curState=="loaded" || curState=="interactive") {
	ready();
} else if (document.addEventListener) {
	document.addEventListener('DOMContentLoaded', ready, false);
}


})(); // :)
