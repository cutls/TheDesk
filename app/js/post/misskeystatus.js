//Renpost
function renote(id, acct_id, remote) {
	if ($("#pub_" + id).hasClass("rted")) {
		return
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/create";
    if(domain!="misskey.xyz"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({i:at,renoteId:id}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
            var json = httpreq.response;
            console.log(json);
            $("[toot-id=" + id + "]").addClass("rted");
            $(".rt_"+id).toggleClass("teal-text");
		}
	}
}
//Renote
function renoteqt(id, acct_id) {
    localStorage.setItem("nohide",true);
	show();
	$("#reply").val("renote_"+id);
	$("#rec").text("Renote");
	$("#post-acct-sel").val(acct_id);
	$("#post-acct-sel").prop("disabled", true);
	$('select').material_select();
	$("#textarea").attr("placeholder",lang_misskeyparse_qt[lang]);
	$("#textarea").focus();
}
//Reply
function misskeyreply(id, acct_id) {
    localStorage.setItem("nohide",true);
	show();
	$("#reply").val(id);
	$("#rec").text("Renote");
	$("#post-acct-sel").val(acct_id);
	$("#post-acct-sel").prop("disabled", true);
	$('select').material_select();
	$("#textarea").attr("placeholder",lang_misskeyparse_qt[lang]);
	$("#textarea").focus();
}
//Reaction
function reactiontoggle(id,acct_id,tlid){
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/show";
    if(domain!="misskey.xyz"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({i:at,noteId:id}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
            var json = httpreq.response;
            console.log(json);
            if(json.reactionCounts){
                var reactions=["like","love","laugh","hmm","surprise","congrats","angry","confused","pudding"];
                for(var i=0;i<reactions.length;i++){
                    if(json.reactionCounts[reactions[i]]){
                        $("#pub_" + id +" .re-"+reactions[i]+"ct").text(json.reactionCounts[reactions[i]])
                        $("#pub_" + id +" .re-"+reactions[i]).removeClass("hide")
                    }else{
                        $("#pub_" + id +" .re-"+reactions[i]+"ct").text(0)
                        if($("#pub_" + id +" .reactions").hasClass("fullreact")){
                            $("#pub_" + id +" .re-"+reactions[i]).addClass("hide")
                        }else{
                            $("#pub_" + id +" .re-"+reactions[i]).removeClass("hide")
                        }
                        $("#pub_" + id +" .re-"+reactions[i]+"ct").text(json.reactionCounts[reactions[i]])
                    }
                }
                $("#pub_" + id +" .reactions").removeClass("hide");
                $("#pub_" + id +" .reactions").toggleClass("fullreact")
            }else{
                if($("#pub_" + id +" .reactions").hasClass("fullreact")){
                    $("#pub_" + id +" .reactions").addClass("hide")
                    $("#pub_" + id +" .reactions").removeClass("fullreact")
                }else{
                    $("#pub_" + id +" .reactions").removeClass("hide");
                    $("#pub_" + id +" .reaction").removeClass("hide");
                    $("#pub_" + id +" .reactions").addClass("fullreact");
                }
            }
		}
	}
}
function reaction(mode,id,acct_id,tlid){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    if($(".fav_"+id).hasClass("yellow-text")){
        var flag="delete";
    }else{
        var flag="create";
    }
    var start = "https://" + domain + "/api/notes/reactions/"+flag;
    if(domain!="misskey.xyz"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({i:at,noteId:id,reaction:mode}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
            $(".fav_"+id).toggleClass("yellow-text");
		}
	}
}
//Vote
function vote(acct_id,id,to){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/polls/vote";
    if(domain!="misskey.xyz"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = 'json';
	httpreq.send(JSON.stringify({i:at,noteId:id,choice:to}));
    httpreq.onreadystatechange = function() {
		voterefresh(acct_id,id)
	}
}
function voterefresh(acct_id,id){
    var httpreqd = new XMLHttpRequest();
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/show";
	httpreqd.open('POST', start, true);
	httpreqd.setRequestHeader('Content-Type', 'application/json');
    httpreqd.responseType = 'json';
	httpreqd.send(JSON.stringify({i:at,noteId:id}));
    httpreqd.onreadystatechange = function() {
		if (httpreqd.readyState == 4) {
            var json = httpreqd.response;
            if(!json){
                return false;
            }
            var poll="";
		    if(json.poll){
			    var choices=json.poll.choices;
			    Object.keys(choices).forEach(function(keyc) {
                    var choice = choices[keyc];
                    if(choice.isVoted){
                        var myvote=twemoji.parse("✅");
                    }else{
                           var myvote="";
                    }
                    poll=poll+'<div class="pointer vote" onclick="vote(\''+acct_id+'\',\''+json.id+'\','+choice.id+')">'+choice.text+'('+choice.votes+''+myvote+')</div>';
                });
                $(".vote_"+json.id).html(poll)
		    }
		}
	}
}