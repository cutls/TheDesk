//カード処理やメンション、ハッシュタグの別途表示
//全てのTL処理で呼び出し
function additional(acct_id, tlid) {
	//メンション系
	//$(".mention").attr("href", "");
	
	$(".mention").addClass("parsed");

	$(".hashtag").each(function(i, elem) {
		var tags = $(this).attr("href").match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/tags\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
		);
		$(this).attr("href","#");
		if(tags){
			if(tags[2]){
				$(this).attr("onclick",'tagShow(\'' + tags[2] + '\')');
			}
			
		}
		
		
	});
	
	//トゥートサムネ
	$("#timeline_" + tlid + " .toot a:not(.parsed)").each(function(i, elem) {
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem("acct_"+ acct_id + "_at");
		var card = localStorage.getItem("card_" + tlid);
		var text = $(this).attr('href');
		if(text){
			if(text.indexOf("twimg.com")=== -1){
				var urls = text.match(
					/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
				);
			}
		}else{
			var urls =[]
		}
		
		//トゥートのURLぽかったら
		toot = text.match(/https:\/\/([a-zA-Z0-9.-]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/);
		if(toot){
			if(toot[1]){
				$(this).attr("data-acct",acct_id);
			}
		}
		if (urls) {
			$(this).remove();
		} else if (!card) {
			var id = $(this).parents('.cvo').attr("toot-id");
			if(localStorage.getItem("mode_" + domain)=="misskey"){
				var start = "https://" + domain + "/url?url="+text;
				fetch(start, {
					method: 'GET',
					headers: {
						'content-type': 'application/json'
					},
					//body: JSON.stringify({})
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					if (json.title) {
						$("[toot-id=" + id + "] .additional").html(
							"<span class=\"gray\">URL"+lang_cards_check[lang]+":<br>Title:" + json.title + "<br>" +
							json.description + "</span>");
						$("[toot-id=" + id + "] a:not(.parsed)").addClass("parsed");
						$("[toot-id=" + id + "]").addClass("parsed");
					}
				});
			}
		
		}else{
			$(this).attr("title",text);
		}
	});
	$("i.unparsed").each(function(i, elem) {
		var dem=$(this).text();
		var dom=$(this);
		var start = "./js/emoji/emoji-map.json";
		var xmlHttpRequest = new XMLHttpRequest();
	 xmlHttpRequest.onreadystatechange = function()
	 {
		 if( this.readyState == 4 && this.status == 200 ) {
			 if( this.response){
				 var json=this.response;
				 var emojis=json.emojis;
				 for (i = 0; i < emojis.length; i++) {
					  var emojie = emojis[i];
					  var regExp = new RegExp(dem, "g");
					   if (emojie.emoji.match(regExp)) {
						 var sc=emojie.name;
						 var sc="twa-"+sc.replace(/_/g,"-");
						 dom.addClass(sc);
						 dom.text("");
						 dom.removeClass("unparsed");
						  break;
					  }
				   }   
		 }
	 }
 } 
 xmlHttpRequest.open( 'GET', start, true );
 xmlHttpRequest.responseType = 'json';
 xmlHttpRequest.send( null );
	});
				
	$("#timeline_" + tlid + " .toot:not(:has(a:not(.add-show,.parsed)))").each(function(i, elem) {
		$(this).parent().find(".add-show").hide();
	});
	//Markdownイメージビューワー
	$("#timeline_" + tlid + " .toot a:not(.img-parsed):has(img)").each(function(i, elem) {
			var ilink=$(this).attr("href");
			var id = $(this).parents('.cvo').attr("toot-id");
			$(this).attr("href","#");
			$(this).attr("onclick","imgv('"+id+"','"+i+"')");
			$(this).attr("data-type","image");
			$(this).attr("id",id+"-image-"+i);
			$(this).attr("data-url",ilink);
			$(this).addClass("img-parsed");
	});
}

function additionalIndv(tlid, acct_id, id) {
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem("acct_"+ acct_id + "_at");
		var text = $("[toot-id="+id+"] .toot a").attr('href');
		var urls = text.match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
		);
		if (urls) {
			$("[toot-id="+id+"] .toot a").remove();
		} else {
			if(localStorage.getItem("mode_" + domain)=="misskey"){
				var start = "https://" + domain + "/url?url="+text;
				fetch(start, {
					method: 'GET',
					headers: {
						'content-type': 'application/json'
					},
					//body: JSON.stringify({})
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					if (json.title) {
						$("[toot-id=" + id + "] .additional").html(
							"<span class=\"gray\">URL"+lang_cards_check[lang]+":<br>Title:" + json.title + "<br>" +
							json.description + "</span>");
						$("[toot-id=" + id + "] a:not(.parsed)").addClass("parsed");
						$("[toot-id=" + id + "]").addClass("parsed");
					}
				});
			}else{
				var id = $("[toot-id="+id+"] .toot a").parents('.cvo').attr("toot-id");
				var start = "https://" + domain + "/api/v1/statuses/" + id + "/card";
				fetch(start, {
					method: 'GET',
					headers: {
						'content-type': 'application/json',
						'Authorization': 'Bearer ' + at
					},
					//body: JSON.stringify({})
				}).then(function(response) {
					return response.json();
				}).catch(function(error) {
					todo(error);
					console.error(error);
				}).then(function(json) {
					console.log(json);
					//このリンク鳥やんけ、ってとき
					console.log(json.provider_name);
					if (json.provider_name=="Twitter"){
						if(json.image){
							var twiImg='<br><img src="'+json.image+'" style="max-width:100%" onclick="imgv(\'twi_'+id+'\', 0, \'twitter\');" id="twi_'+id+'-image-0" data-url="'+json.image+'" data-type="image">';
						}else{
							var twiImg='';
						}
						$("[toot-id=" + id + "] .additional").html(
							'<div class="twitter-tweet"><b>'+escapeHTML(json.author_name)+'</b><br>'+escapeHTML(json.description)+twiImg+'</div>');
					}else if (json.provider_name=="pixiv"){	
						if(json.image){
							var pxvImg='<br><img src="'+json.image+'" style="max-width:100%" onclick="imgv(\'pixiv_'+id+'\', 0, \'pixiv\');" id="pixiv_'+id+'-image-0" data-url="'+json.embed_url+'" data-type="image">';
						}else{
							var pxvImg='';
						}
						$("[toot-id=" + id + "] .additional").html(
							'<div class="pixiv-post"><b><a href="'+json.author_url+'" target="_blank">'+escapeHTML(json.author_name)+'</a></b><br>'+escapeHTML(json.title)+pxvImg+'</div>');
					}else{
						if (json.title) {
							$("[toot-id=" + id + "] .additional").html(
								"<span class=\"gray\">URL"+lang_cards_check[lang]+":<br>Title:" + escapeHTML(json.title) + "<br>" +
								escapeHTML(json.description) + "</span>");
						}
						if (json.html) {
							$("[toot-id=" + id + "] .additional").html(json.html+'<i class="material-icons sml pointer" onclick="pip(\''+id+'\')" title="'+lang_cards_pip[lang]+'">picture_in_picture_alt</i>');
		
						}
					}
					if (json.title) {
						$("[toot-id=" + id + "] a:not(.parsed)").addClass("parsed");
						$("[toot-id=" + id + "]").addClass("parsed");
					}
				});
			}
			
		}
}

//各TL上方のLink[On/Off]
function cardToggle(tlid) {
	var card = localStorage.getItem("card_" + tlid);
	if (!card) {
		localStorage.setItem("card_" + tlid, "true");
		$("#sta-card-" + tlid).text("Off");
		$("#sta-card-" + tlid).css("color",'red');
	} else {
		localStorage.removeItem("card_" + tlid);
		$("#sta-card-" + tlid).text("On");
		$("#sta-card-" + tlid).css("color",'#009688');
	}
}
//各TL上方のLink[On/Off]をチェック
function cardCheck(tlid) {
	var card = localStorage.getItem("card_" + tlid);
	if (!card) {
		$("#sta-card-" + tlid).text("On");
		$("#sta-card-" + tlid).css("color",'#009688');
	} else {
		$("#sta-card-" + tlid).text("Off");
		$("#sta-card-" + tlid).css("color",'red');
	}
}

function mov(id,tlid,type){
	if(tlid=="notf"){
		var tlide="[data-notf="+acct_id+"]";
	}else if(tlid=="user"){
		var tlide="#his-data";
	}else{
		var tlide="[tlid="+tlid+"]";
	}
	console.log(tlid)
	var mouseover=localStorage.getItem("mouseover");
	if(!mouseover){
		mouseover="";
	}
	if(mouseover=="yes"){
		mouseover="hide";
	}else if(mouseover=="click"){
		if(type=="mv"){
			mouseover="";
		}else{
			mouseover="hide";
		}
	}else if(mouseover=="no"){
		mouseover="";
	}
	if(mouseover=="hide"){
		$(tlide+" [toot-id="+id+"] .area-actions").toggleClass("hide")
		$(tlide+" [toot-id="+id+"] .area-side").toggleClass("hide")
	}
}

function resetmv(type){
	var mouseover=localStorage.getItem("mouseover");
	if(!mouseover){
		mouseover="";
	}else if(mouseover=="yes"){
		mouseover="hide";
	}else if(mouseover=="no"){
		mouseover="";
	}else if(mouseover=="click" && type!="mv"){
		mouseover="hide";
	}
	if(mouseover=="hide"){
		$(".area-actions").addClass("hide");
		$(".area-side").addClass("hide");
	}
	
}