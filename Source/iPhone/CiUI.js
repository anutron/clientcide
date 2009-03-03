/*
Script: CiUI.js

Handles iPhone-optimized pages and mimics iPhone UI behavior

Version: 0.3

License:
	http://www.clientcide.com/wiki/cnet-libraries#license
*/

(function() {

if (!window.addEventListener) return;

var bodyEl; // see ciUI.initialize() for details
var buttonForward = "go_forward";
var buttonBackward = "go_back";
var buttonLoadMore = "load_more";
var cachePage = "cache";
var backButtonEl; // see ciUI.initialize() for details
var backButtonTextEl; // see ciUI.initialize() for details
var pageTitleEl; // see ciUI.initialize() for details
var update = "do_update";
var updateAttr = "update";

var pages = []; // see ciUI.initialize() for details
var pageHistory = [];
var cachedPages = [];
var cacheCounter = 0;
var cachedPagePrefix = "__cached-"; 

var homePage = location.href;
var hashPrefix = "#__";
var currentHash = hashPrefix + 0;
var currentPage = 1; // possible values are 1 or -1 (1: from, -1: to)

var animSpeed = 20; // smaller number means slower animation
var navigationCheckInterval = 300;
var navigtionChangeTimer;
var httpRequest = null;
var uiIsActive;

window.ciUI = {
	initialize: function() {
		bodyEl = $("iphone_body");
		backButtonEl = $("iphone_backbutton");
		backButtonTextEl = $("iphone_backbutton_text");
		pageTitleEl = $("iphone_title");
		if (!bodyEl || !backButtonEl || !backButtonTextEl || !pageTitleEl) return;
		if (pageTitleEl && pageTitleEl.innerHTML == "") pageTitleEl.innerHTML = document.title;
		this.setupPages();
		this.animating = false;
		this.shouldCache = null;		
		setTimeout(scrollTo, 100, 0, 1);
		return true;
	},
	
	setupPages: function() {
		var page1 = document.createElement('div');
		var page2 = document.createElement('div');
		var home  = document.createElement('div');
		var ascrolltop = document.createElement('a');

		page1.id = "__page1__";
		page1.className = "iphone_page";
		page1.style.left = "0%";
		page1.style.display = "block";
		
		page2.id = "__page2__";
		page2.className = "iphone_page";
		page2.style.left = "100%";
		page2.style.display = "none";
		
		home.id	= "__home__";
		home.style.display = "none";
		ascrolltop.id = "__scroll_top__";
		ascrolltop.name = "";
		
		page1.innerHTML = home.innerHTML = bodyEl.innerHTML;
		bodyEl.innerHTML = "";
		bodyEl.appendChild(page1);
		bodyEl.appendChild(page2);		
		document.body.appendChild(home);
		document.body.insertBefore(ascrolltop, document.body.firstChild);

		this.adjustBodyToEl(page1);
	
		pages[1] = $(page1.id);
		pages[0] = $(home.id);
		pages[-1] = $(page2.id);
	},
	
	goToPage: function(target, backwards, shouldBeCached) {
		this.slidePages(backwards);
		// Cache if needed
		if (this.shouldCache) {
			this.saveCurrentPageToCache();
			this.shouldCache = null;
		}
		// BACKWARD
		if (backwards) { 
			currentHash = location.hash;
			pageHistory.splice(pageHistory.indexOf(target)+1, pageHistory.length);
		}
		// FORWARD
		else {
   			pageHistory.push(target);								
			if (shouldBeCached && !cachedPages[escape(target.href)]) {
				this.shouldCache = target.href;			
			}
		}

		this.updatePage(target);				
	},
	
	loadMore: function(target) {
		target.className = "load_more_loading";
		(new this.ajax(target.href, updatePage)).run();
		
		function updatePage(content) {
			target.parentNode.removeChild(target);
			pages[currentPage].innerHTML += content;
			ciUI.adjustBodyToEl(pages[currentPage]);
		}
	},
	
	updatePage: function(target) {
		var nextHash = hashPrefix + (pageHistory.length);
		backButtonEl.style.display = (pageIndexFromHash(nextHash) == 0 || !target) ? "none" : "block";
		// Update body with new page content
		if (pageIndexFromHash(nextHash) == 0 || !target) {
			pageTitleEl.innerHTML = trim(document.title);
			this.updatePageContent(pages[0].innerHTML); // page[0] is home, no need for AJAX
		}
		else if ((idx = cachedPages[escape(target.href)]) != null) {
			backButtonTextEl.innerHTML = (pageHistory[pageHistory.length-2]) ? trim(pageHistory[pageHistory.length-2].title, 15) : "Back";
			pageTitleEl.innerHTML = trim(target.title);
			this.updatePageContent($(cachedPagePrefix + idx).innerHTML);			
		}			
		else {
			backButtonTextEl.innerHTML = (pageHistory[pageHistory.length-2]) ? trim(pageHistory[pageHistory.length-2].title, 15) : "Back";
			pageTitleEl.innerHTML = trim(target.title);			
			var url = target.href;
			if (!url && target.tagName.toLowerCase() == "form") url = target.action+"?"+target.toQueryString();
			(new this.ajax(url, this.updatePageContent)).run();
		}
	},
	
	saveCurrentPageToCache: function() {
		var page = document.createElement("div");
		page.style.display = "none";
		page.innerHTML = pages[currentPage].innerHTML;
		page.id = cachedPagePrefix + cacheCounter;
		cachedPages[escape(this.shouldCache)] = cacheCounter++;
		document.body.appendChild(page);	
	},
	
	updatePageContent: function(content) {
		var updateTimer = setInterval(update, 0);
			
		function update() {
			if (!ciUI.animating) {
				$("__scroll_top__").name = currentHashName(true);
				pages[currentPage].innerHTML = content;
				pages[-currentPage].innerHTML = "";
				clearInterval(updateTimer);								
				ciUI.adjustBodyToEl(pages[currentPage]);				
				location.href = currentHash = currentHashName();
				if (ciUI.callbackFunct) ciUI.callbackFunct();
			}			
		}		
	},
	
	slidePages: function(backwards) {
		this.animating = true;
		
		var fromPage = pages[currentPage];
		var toPage = pages[-currentPage];
		var progress = 100;
		
		toPage.innerHTML = this.loadingPage();
		toPage.style.display = "block";
		
		if (!backwards) toPage.style.left = "100%";
		
		clearInterval(navigationChangeTimer); // pause the history daemon during animation.
		setTimeout(scrollTo, 100, 0, 1);
		var animTimer = setInterval(animate, 0);
		
		function animate() {
			progress -= animSpeed;
			
			if (progress <= 0) {
				clearInterval(animTimer);				
				navigationChangeTimer = setInterval(navigationChangeAgent, navigationCheckInterval); // restart the history daemon
				currentPage *= -1;
				progress = 0;
				ciUI.animating = false;
			}			
			fromPage.style.left = (backwards ? (100 - progress) : (progress - 100)) + "%";
			toPage.style.left = (backwards ? -progress : progress) + "%";
		}
	},
	
	ajax: function(sourceURL, responseConsumer, responseType) {
		this.run = function()
		{
			if (httpRequest != null) {				
				httpRequest.abort();
				httpRequest = null;
			}				

			if (responseType === undefined) responseType = "TEXT";
			responseType = responseType.toUpperCase();
			
			if (window.XMLHttpRequest) { 
				httpRequest = new XMLHttpRequest();
				if (httpRequest.overrideMimeType) {
					httpRequest.overrideMimeType('text/xml');
				}
			} 
			else if (window.ActiveXObject) { 
				try {
					httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
				} 
				catch (e) {
					try {
						httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
					} 
					catch (e) {}
				}
			}
			
			if (!httpRequest) {
				//console.log('Giving up, cannot create an XMLHTTP instance');
				return false;
			}
	
		
			httpRequest.open('GET', sourceURL, true);
			httpRequest.onreadystatechange = getResponse;
			httpRequest.send(null);	
		};
		
		function getResponse() {	
			if (httpRequest.readyState == 4)
				if (httpRequest.status == 200) {
					if (responseType == "XML")
						responseConsumer(httpRequest.responseXML);
					else
						responseConsumer(httpRequest.responseText);
					httpRequest = null;
				}
				else
					;//console.log("There was a problem with the request: " + sourceUrl);
		}
	},
	
	update: function(url, element) {	
		(new this.ajax(url, function(html){
			if (!element.tagName) element = $(element);
			element.innerHTML = html;
		})).run();
	},
		
	cancel: function(event) {
		history.back();
		event.preventDefault();
		return false;
	},
	
	loadingPage: function() {
		return $("iphone_loading_page").innerHTML;
	},
	
	// a dirty hack to move the footer to proper location since iphone_body doesn't expand with content
	adjustBodyToEl: function(el) {
		bodyEl.style.height = el.offsetHeight + "px";
	}	
};

addEventListener("load", function(event) {
	uiIsActive = ciUI.initialize();
	if (uiIsActive) navigationChangeTimer = setInterval(navigationChangeAgent, navigationCheckInterval);
}, false);

addEventListener("click", function(event) {
	if (!uiIsActive) return;
	var a = findParent(event.target, "a");
	// We don't want to prevent defaults by default because there may be actual hrefs going to outside pages
	var shouldCachePage = a.hasClass(cachePage);
	if (a && a.hasClass(buttonForward)) {
		ciUI.goToPage(a, false, shouldCachePage);
		event.preventDefault();
	} else if (a && a.hasClass(buttonBackward)) {
		history.back();	
		event.preventDefault();
	} else if (a && a.hasClass(buttonLoadMore)) {
		ciUI.loadMore(a);
		event.preventDefault();	
	}	
}, true);

addEventListener("submit", function(event) {
	if (!uiIsActive) return;
	var a;
	var form = findParent(event.target, "form");
	if (!form) return;
	if (form.hasClass(buttonForward)) {	
		event.preventDefault();
		return ciUI.goToPage(form, false);
	} else if (form.hasClass(update)) {
		event.preventDefault();
		ciUI.update(form.action+"?"+form.toQueryString(), form.getAttribute(updateAttr));
		}
}, true);

addEventListener("click", function(event) {
	if (!uiIsActive) return;
	var a = findParent(event.target, ("a"));
	if (!a || !a.hasClass(update)) return;
	ciUI.update(a.href, a.getAttribute(updateAttr));
}, true);

function trim(text, maxLength) {
	if (maxLength === undefined) maxLength = 20;
	return (text.length > maxLength) ? text.substring(0, maxLength - 3) + "..." : text;
};

function currentHashName(ommitHashSymbol) {
	return (ommitHashSymbol) ? hashPrefix.substr(1, hashPrefix.length) + (pageHistory.length) : hashPrefix + (pageHistory.length);
};

function navigationChangeAgent() {
	if (currentHash != location.hash) {
		ciUI.goToPage(pageHistory[pageHistory.length-2], true);
	}
};

function pageIndexFromHash(hash) {
	return (hash) ? hash.substr(hash.lastIndexOf("_") + 1, hash.length) : 0;
};

Element.prototype.hasClass = function(name) {
	return this.className.indexOf(name) != -1;
};

Element.prototype.toQueryString = function(){
	var qs = "";
	var getvals = function(element){
		var kids = element.childNodes;
		for (var i=0; i < kids.length; i++) {
			var el = kids[i];
			if (el.tagName) {
				var t = el.tagName.toLowerCase();
				if (t.toLowerCase() == "input" && el.getAttribute("type") == "checkbox" && !el.checked) {
					qs += el.name + "=" + 0  + "&";
					continue;
				}
				if (t.toLowerCase() == "input" || t.toLowerCase() == "textarea") qs += el.name + "=" + escape(el.value) + "&";
				else if (t == "select") qs += el.name + "=" + escape(el.options[el.selectedIndex].value) + "&"; //no support for multiselect yet
				else getvals(el);
			}
		}
	};
	getvals(this);
	return qs;
}

// This function is courtesy of iUI
function findParent(node, localName) {
    while (node && (node.nodeType != 1 || node.localName.toLowerCase() != localName))
        node = node.parentNode;
    return node;
};

function $(id) { return document.getElementById(id); };

})();