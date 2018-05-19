//右クリックメニューの作成
try{
	chrome.contextMenus.create({
		title: "Save to 2525AC Server",
		contexts: ["all"],
		documentUrlPatterns: ["http://www.nicovideo.jp/watch/*"],
		type: "normal",
		id: "start_nico_save"
	});
	chrome.contextMenus.create({
		title: "NicoSaveを開く",
		contexts: ["all"],
		documentUrlPatterns: ["http://www.nicovideo.jp/watch/*"],
		type: "normal",
		id: "show_nico_save"
	});
}catch(e){
}

//クリックされた時の動作
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "start_nico_save") {
		chrome.tabs.getSelected(window.id, function (tab) {
			try{
				//HTTPリクエスト
				var xhr = new XMLHttpRequest();
				xhr.open( 'GET', 'http://localhost:8080/add?url='+tab.url, false );
				xhr.send("");
				var result = JSON.parse(xhr.responseText);
				if (result.Message == "OK"){
					chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 255, 100]});
					chrome.browserAction.setBadgeText({text:"OK"});
					setTimeout( function() {
						chrome.browserAction.setBadgeText({text:""});
					}, 1500 );
				}else if(result.Message == "Already Exist"){
					alert("既にダウンロード済みです");
				}else{
					alert("サーバーでエラーが発生しました");
				}
			}catch(e){
				alert("不明なエラーが発生しました");
				console.log(e.message);
			}
		});
    }else if (info.menuItemId === "show_nico_save"){
		//新しいタブでWebUIページで開く
		chrome.tabs.create({url: "getList.html" });
	}
});