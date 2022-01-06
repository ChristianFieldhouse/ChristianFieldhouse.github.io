var refresh_milliseconds = 10000

function reloadIFrames() {
	console.log("not reloading charts -- this is old news")
	return;
	for (var i = 0; i < urls.length; i++){
		document.getElementById(charts[i][1 - toggle]).style.display = "none";
		document.getElementById(charts[i][toggle]).style.display = "block";
	}
	for (var i = 0; i < urls.length; i++){
		document.getElementById(charts[i][1 - toggle]).src=urls[i];
	}
	toggle = 1 - toggle;
}