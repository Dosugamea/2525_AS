$(function(){
  // セーブボタンが押されたら、
  // ローカルストレージに保存する。
  $("#save").click(function () {
	chrome.storage.local.set({'server_address': $("#server_address").val()}, function() {
		if($('[name=active_check]').prop('checked')){
			chrome.storage.local.set({'ns_check_saved': "on"}, function() {
				alert("保存しました");
			});
		}else{
			chrome.storage.local.set({'ns_check_saved': "off"}, function() {
				alert("保存しました");
			});
		}
	});
  });

  // オプション画面の初期値を設定する
  chrome.storage.local.get("server_address", function(result){
    if (result.server_address != undefined){
		$("#server_address").val(result.server_address);
	}
  });
  chrome.storage.local.get('ns_check_saved', function(result){
	if (result.ns_check_saved == "on"){
		$('[name=active_check]').prop('checked',true);
	}
  });
});