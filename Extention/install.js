function add_contexts(){
	chrome.contextMenus.create({
		title: "Save to Server",
		contexts: ["all"],
		documentUrlPatterns: ["http://www.nicovideo.jp/watch/*"],
		type: "normal",
		id: "start_nico_save"
	});
	chrome.contextMenus.create({
		title: "Open Saved list",
		contexts: ["all"],
		documentUrlPatterns: ["http://www.nicovideo.jp/watch/*"],
		type: "normal",
		id: "show_nico_save"
	});
}

//クリックされた時の動作
chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if (info.menuItemId === "start_nico_save") {
		chrome.tabs.getSelected(window.id, function (tab) {
			try{
				//HTTPリクエスト
				var xhr = new XMLHttpRequest();
				chrome.storage.local.get("server_address", function(result){
					if (result.server_address != undefined){
						try{
							xhr.open( 'GET', result.server_address+'/add?url='+tab.url, false );
							xhr.send("");
							var result = JSON.parse(xhr.responseText);
							if (result.Message == "OK"){
								chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 255, 100]});
								chrome.browserAction.setBadgeText({text:"OK"});
								setTimeout( function() {
									chrome.browserAction.setBadgeText({text:""});
								}, 5000 );
							}else if(result.Message == "Already Exist"){
								alert("既にダウンロード済みです");
							}else if(result.Message == "Not MovieID"){
								alert("ページアドレスが不正です");
							}else{
								alert("サーバーでエラーが発生しました");
							}
						}catch(e){
							alert("サーバーでエラーが発生しました");
						}
					}else{
						alert("サーバーアドレスを指定してください");
					}
				});
			}catch(e){
				alert("不明なエラーが発生しました");
				console.log(e.message);
			}
		});
		return true;
	}else if (info.menuItemId === "show_nico_save"){
		//新しいタブでWebUIページで開く
		chrome.tabs.create({url: "List.html" });
	}
});	

//check.jsから処理を受け取る(backgroundのJSでしかchrome.～は弄れないため)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	switch(request.action){
		case 'disable_nicosave_icon':
			chrome.contextMenus.update("start_nico_save", {
				enabled: false
			});
			break;
		case 'enable_nicosave_icon':
			chrome.contextMenus.update("start_nico_save", {
				title: "Save to Server",
				contexts: ["all"],
				documentUrlPatterns: ["http://www.nicovideo.jp/watch/*"],
				type: "normal",
				enabled: true
			});
			break;
		case 'disable_nicosave_webui':
			chrome.contextMenus.update("show_nico_save", {
				enabled: false
			});
			break;
		case 'enable_nicosave_webui':
			chrome.contextMenus.update("show_nico_save", {
				title: "Open Saved list",
				contexts: ["all"],
				documentUrlPatterns: ["http://www.nicovideo.jp/watch/*"],
				type: "normal",
				enabled: true
			});
			break;
		case 'get_url':
			chrome.tabs.getSelected(window.id, function (tab) {
				sendResponse(tab.url);
			});
			break;
		case 'badge':
			chrome.browserAction.setBadgeText({text:request.data});
			break;
		case 'unload':
			chrome.contextMenus.removeAll();
			break;
		case 'load':
			add_contexts();
			break;
	}
	return true;
});
console.log("Install NicoSave Success");