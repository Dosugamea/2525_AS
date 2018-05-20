console.log("NicoSave Working");
chrome.runtime.sendMessage({action: "badge",data: ""});
chrome.runtime.sendMessage({action: "load"});
chrome.storage.local.get("server_address", function(result){
	server = result.server_address;
});
chrome.storage.local.get("ns_check_saved", function(resultB){
	ns_chk = resultB.ns_check_saved
});
chrome.runtime.sendMessage({action: "get_url"}, function(response) {
	console.log(response);
	if (ns_chk == "on"){
		//HTTPリクエスト
		var xhr = new XMLHttpRequest();
		try{
			xhr.open( 'GET', server+'/check?url='+response, false );
			xhr.send("");
			var result = JSON.parse(xhr.responseText);
			if (result.Message == "NotExist"){
				chrome.runtime.sendMessage({action: "enable_nicosave_icon"});
				chrome.runtime.sendMessage({action: "enable_nicosave_webui"});
			}else{
				chrome.runtime.sendMessage({action: "badge",data: "ACed"});
				chrome.runtime.sendMessage({action: "disable_nicosave_icon"});
				chrome.runtime.sendMessage({action: "enable_nicosave_webui"});
				setTimeout( function() {
					chrome.browserAction.setBadgeText({text:""});
				}, 5000 );
			}
		}catch(e){
			chrome.runtime.sendMessage({action: "badge",data: "ERR"});
			console.log("NicoSaveサーバーに接続できませんでした");
			chrome.runtime.sendMessage({action: "disable_nicosave_icon"});
			chrome.runtime.sendMessage({action: "disable_nicosave_webui"});
		}
	}else{
		chrome.runtime.sendMessage({action: "enable_nicosave_icon"});
		chrome.runtime.sendMessage({action: "enable_nicosave_webui"});
	}
});
window.addEventListener('beforeunload', function(){
	chrome.runtime.sendMessage({action: "unload"});
});