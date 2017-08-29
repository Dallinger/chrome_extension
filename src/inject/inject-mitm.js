chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		console.log("Monitoring this site.");
		chrome.pageAction.show(tabId);
	}
	}, 10);
});