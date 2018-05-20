//テーブルを読み込む
function load_table(saba){
	$('tbody').empty();
	$.getJSON(saba+"/list", function(json){
		var rows = "";
		for (i = 0; i < json.length; i++) {
			id = json[i]["Name"].slice(0,json[i]["Name"].indexOf("_"))
			rows += "<tr>";
			rows += "<td>"+"<a href='"+saba+"/play?url=http://www.nicovideo.jp/watch/"+id+"'>"+json[i]["Name"].slice(json[i]["Name"].indexOf("_")+1)+"</a>"+"</td>";
			rows += "<td>"+id+"</td>";
			rows += "<td>"+json[i]["Stat"]+"</td>";
			rows += "<td>"+json[i]["Size"]+"</td>";
			rows += "<td>"+json[i]["Date"]+"</td>";                 
			rows += "<td>"+'<input id="remove" type="button" value="削除" />'+"</td>";             
			rows += "</tr>";
		}
		$('p').text('Total '+json.length+" Items");
		$("#data_table").append(rows);
	});
}

//絞り込む
function shiboru(){
	var re = new RegExp($('#search').val());
	$('#data_table tbody tr').each(function(){
		var txt = $(this).find("td:eq(0)").html();
		if(txt.match(re) != null){
			$(this).show();
		}else{
			$(this).hide();
		}
	});
	$('p').text('Total '+$('#data_table tbody tr').filter(':visible').length+" Items");
}

//画面構築完了後
$(function() {
	//サーバーアドレス指定
	chrome.storage.local.get("server_address", function(result){
		load_table(result.server_address);
	});
	//テーブルにデータを取得
	
	//再読み込みする
	$("#reload").click(function(){
		load_table()
	});
});