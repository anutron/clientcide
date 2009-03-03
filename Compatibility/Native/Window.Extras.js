$extend(window, {
    getQueryStringValues: Browser.getQueryStringValues,
    getQueryStringValue: Browser.getQueryStringValue
});

window.addEvent('domready', function() {
    window.isLoaded = true;
});
