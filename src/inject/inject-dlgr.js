chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			/** This is a Dallinger app page, we should link in with the
			 *  experiment's chrome to allow it to request additional
			 *  scopes for optional permissions.
			 *  
			 *  You must provide a button that has the appropriate data
			 *  attributes and id e.g.:
			 * 
			 *  <button id="request-external-monitoring"
			 * 			data-urls="https://*.wikipedia.org/*;https://www.bbc.co.uk/news/*">
			 *  	Allow access
			 *  </button>
			**/ 
			document.getElementById('request-external-monitoring').onclick=function(evt) {
				console.log("Enabling experiment integration");
				var button = this;
				chrome.runtime.sendMessage(
					{
						type: 'request',
						gain_access: this.dataset.urls.split(';')
					}, function(response) {
						if (response.success) {
							eval(button.dataset.onapproved);
						} else {
							eval(button.dataset.onrejected);
						}
					}
				);
				evt.preventDefault();
				return;
			};
		}
	}, 10);
});