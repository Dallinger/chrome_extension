chrome.extension.sendMessage({type: 'ping'}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
        chrome.storage.sync.get(['experiment_url', 'participant_id'], function (vals) {
            var experiment_url = (vals.experiment_url || '').replace(/\/$/, "");
            var participant_id = vals.participant_id;
            var script1 = document.createElement("script");
            script1.innerHTML = "window.dlgr = window.dlgr || {};\ndlgr.experiment_url = " +
                                JSON.stringify(experiment_url) + ";\ndlgr.participant_id = " +
                                JSON.stringify(participant_id) + ";";
            document.head.appendChild(script1);
            var script2 = document.createElement('script');
            script2.setAttribute('type','text/javascript');
            script2.setAttribute('src', experiment_url + '/static/scripts/tracker.js');
            document.head.appendChild(script2);
        });
		console.log("Monitoring this site.");
        if (chrome.pageAction) {
            chrome.pageAction.show(tabId);
        }
	}
	}, 10);
});
