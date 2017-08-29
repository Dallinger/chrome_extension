chrome.runtime.sendMessage(
    {
        type: 'list'
    }, function(response) {
        for (var i = 0; i < response.origins.length; i++) {
            var item = document.createElement('li');
            item.innerHTML = response.origins[i];
            if (response.origins[i] != 'https://*.herokuapp.com/*') {
                // Don't mention the heroku whitelist, as that's not used
                // by the mitm script
                document.getElementsByTagName("ul")[0].appendChild(item);                
            }
        }
    }
);


document.getElementById('resetbutton').onclick = function (evt) {
    chrome.runtime.sendMessage(
        {
            type: 'end'
        }, function(response) {
        }
    );
}