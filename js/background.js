var BrowserKind = Object.freeze({"FIREFOX": 1, "CHROME": 2})

function getBrowserKind() {
	var ua = navigator.userAgent;
	if (ua.includes("Chrome")) 
		return BrowserKind.CHROME;
	if (ua.includes("Firefox")) 
		return BrowserKind.FIREFOX;
}

var actualBrowser = null;

if (getBrowserKind() == BrowserKind.CHROME) {
	actualBrowser = chrome;
} else if (getBrowserKind() == BrowserKind.FIREFOX) {
	actualBrowser = browser;
}

function getExtensionPageURL(kind, url) {
	if (kind === BrowserKind.FIREFOX) {
		return "moz-extension://" + window.location.hostname + url;
	} else {
		return "chrome-extension://"+window.location.hostname+ url;
	}
}

function requestBlockHandler(details) {
	var a = document.createElement('a');
	a.href = details.url;
	domain = a.hostname;
	if ( a.hostname.indexOf("www.") == 0 ){
		domain = domain.replace(/([a-zA-Z0-9]+.)/,"");
	}

	if ( axel.indexOf( domain ) != -1 ){
		var browserKind = getBrowserKind();
		var blockURL = getExtensionPageURL(browserKind, "/html/block.html");
		console.log(blockURL);

		var blockingResponse = {
			redirectUrl: blockURL
		};

		console.log(blockingResponse);
		return blockingResponse;
	}
}

function openHelp() {
	actualBrowser.tabs.create({
			url: getExtensionPageURL(getBrowserKind(), "/help.html")
		});
}

actualBrowser.webRequest.onBeforeRequest.addListener(
	requestBlockHandler,{
		urls: ["<all_urls>"]
	},["blocking"]
);

actualBrowser.browserAction.onClicked.addListener(openHelp);

