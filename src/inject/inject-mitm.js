chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
        window.dlgr = window.dlgr || {};
        chrome.storage.sync.get(['experiment_url', 'participant_id'], function (vals) {
            window.dlgr.experiment_url = (vals.experiment_url || '').replace(/\/$/, "");
            window.dlgr.participant_id = vals.participant_id;
            var script = document.createElement('script');
            script.setAttribute('type','text/javascript');
            script.setAttribute('src', window.dlgr.experiment_url + '/static/scripts/tracker.js');
            document.getElementsByTagName('head')[0].appendChild(script);
        });
		console.log("Monitoring this site.");
		chrome.pageAction.show(tabId);
	}
	}, 10);
});
