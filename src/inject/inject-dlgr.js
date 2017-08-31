chrome.extension.sendMessage({type: 'ping'}, function(response) {
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
			 * 			data-urls="https://*.wikipedia.org/*;https://www.bbc.co.uk/news/*"
			 * 			data-experimentURL="https://dlgr-xxxxxx.herokuapp.com"
			 * 			data-participantId="2"
			 * 			data-instructions="Lorem ipsum dolor sit amet">
			 *  	Allow access
			 *  </button>
			 * 
			 *  You can also listen to the approved and rejected events to help
			 *  direct the user into the experiment
			 * 
			 *  <script>
			 * 		$('#request-external-monitoring').on('approved', function() {
			 * 			alert('Okay');
			 * 		});
			 * 		$('#request-external-monitoring').on('rejected', function() {
			 * 			alert('Retry');
			 * 		});
			 *  </script>
			**/ 
			document.getElementById('request-external-monitoring').onclick=function(evt) {
				console.log("Enabling experiment integration");
				var button = this;
				chrome.runtime.sendMessage(
					{
						type: 'request',
						gain_access: this.dataset.urls.split(';'),
						experiment_url: this.dataset.experimenturl,
						participant_id: this.dataset.participantid,
						instructions: this.dataset.instructions
					}, function(response) {
						var event = document.createEvent('Event');
						if (response.success) {
							event.initEvent('approved', true, true);
						} else {
							event.initEvent('rejected', true, true);
						};
						button.dispatchEvent(event);
					}
				);
				evt.preventDefault();
				return;
			};

			document.getElementById('end-external-monitoring').onclick=function(evt) {
				console.log("Ending experiment integration");
				chrome.runtime.sendMessage({type: 'end'});
				return;
			};

		}
	}, 10);
});