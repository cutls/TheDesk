//Renpost
function renote(id, acct_id, remote) {
	if ($("#pub_" + id).hasClass("rted")) {
		return false;
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/create";
    if(localStorage.getItem("mode_" + domain)!="misskey"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = "json";
	httpreq.send(JSON.stringify({i:at,renoteId:id}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
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
	$("#textarea").attr("placeholder",lang.lang_misskeyparse_qt);
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
	$("#textarea").attr("placeholder",lang.lang_misskeyparse_qt);
	$("#textarea").focus();
}
//Reaction
function reactiontoggle(id,acct_id,tlid){
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/show";
    if(localStorage.getItem("mode_" + domain)!="misskey"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = "json";
	httpreq.send(JSON.stringify({i:at,noteId:id}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
            var json = httpreq.response;
            console.log(json);
            if(json.reactionCounts){
                var reactions=["like","love","laugh","hmm","surprise","congrats","angry","confused","pudding","star"];
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
    $("#pub_" + id +" .freeReact").toggleClass("hide");
}
//reactioncustom
function reactioncustom(acct_id,id){
    $("#reply").val(id);
    $("#unreact").hide();
    $("#addreact").removeClass("hide");
	$("#post-acct-sel").val(acct_id);
	$('select').material_select();
    localStorage.setItem("nohide",true);
    show()
    emojiToggle(true)
    $("#left-side").hide();
    $("#default-emoji").hide();
}
function reactRefresh(acct_id,id){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/show";
   
    var req={};
    req.i=at;
    req.noteId=id;
    var i={
        method: "POST",
        body: JSON.stringify(req),
    }
    console.log(req)
    fetch(start, i,
    ).then(function(response) {
        return response.json();
    }).catch(function(error) {
        todo(error);
        console.error(error);
    }).then(function(json) {
        if(!json){
            return false;
        }
        var poll="";
        if(json.error){
            $("[toot-id=" + id + "]").hide();
			$("[toot-id=" + id + "]").remove();
        }else{
            reactRefreshCore(json)
        }
    });
}
function reactRefreshCore(json){
    var id=json.id;
    if(json.reactionCounts){
        $("#pub_" + id +" .reactions").removeClass("hide")
        var regExp = new RegExp( ":", "g" ) ;
        Object.keys(json.reactionCounts).forEach(function(keye) {
            keyeClass=keye.replace(regExp,'');
            if(json.reactionCounts[keye]){
                console.log(json.reactionCounts[keye])
                $("#pub_" + id +" .re-"+keyeClass+"ct").text(json.reactionCounts[keye])
                $("#pub_" + id +" .re-"+keyeClass).removeClass("hide")
            }else{
                $("#pub_" + id +" .re-"+keyeClass+"ct").text(0)
                if($("#pub_" + id +" .reactions").hasClass("fullreact")){
                    $("#pub_" + id +" .re-"+keyeClass).addClass("hide")
                }
                $("#pub_" + id +" .re-"+keyeClass+"ct").text(json.reactionCounts[keye])
            }
        });
    }
}
function emojiReaction(emoji){
    var acct_id = $("#post-acct-sel").val();
    var id = $("#reply").val();
    reaction(emoji,id,acct_id,null)
    clear();
    hide();
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
    if(localStorage.getItem("mode_" + domain)!="misskey"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = "json";
	httpreq.send(JSON.stringify({i:at,noteId:id,reaction:mode}));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
            $(".fav_"+id).toggleClass("yellow-text");
		}
	}
}
//Vote
function vote(acct_id,id,to){
    var domain = localStorage.getItem("domain_" + acct_id);
    var at = localStorage.getItem("acct_"+ acct_id + "_at");
    var start = "https://" + domain + "/api/notes/polls/vote";
    if(localStorage.getItem("mode_" + domain)!="misskey"){
        return false;
    }
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
    httpreq.responseType = "json";
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
                    poll=poll+'<div class="pointer vote" onclick="vote(\''+acct_id+'\',\''+json.id+'\','+choice.id+')">'+escapeHTML(choice.text)+'('+choice.votes+''+myvote+')</div>';
                });
                $(".vote_"+json.id).html(poll)
		    }
		}
	}
}