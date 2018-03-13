//よく使うタグ
function tagShow(tag){
	$("[data-tag="+tag+"]").toggleClass("hide");
}
//タグ追加
function tagPin(tag){
    var tags = localStorage.getItem("tag");
    if(!tags){
        var obj=[];
    }else{
        var obj = JSON.parse(tags);
    }
    var can;
    Object.keys(obj).forEach(function(key) {
        var tagT = obj[key];
        if(tagT==tag){
            can=true;
        }else{
            can=false;
        }
    });
    if(!can){
        obj.push(tag);
    }
    var json = JSON.stringify(obj);
    localStorage.setItem("tag", json);
    favTag();
}
//タグ削除
function tagRemove(key) {
    var tags = localStorage.getItem("tag");
    var obj = JSON.parse(tags);
    obj.splice(key, 1);
    var json = JSON.stringify(obj);
    localStorage.setItem("tag", json);
    favTag();
}
function favTag(){
    var tagarr = localStorage.getItem("tag");
    if(!tagarr){
        var obj=[];
    }else{
        var obj = JSON.parse(tagarr);
    }
    var tags="";
    Object.keys(obj).forEach(function(key) {
        var tag = obj[key];
        tags = tags + '<a onclick="tagShow(\'' + tag + '\')" class="pointer">#' + tag + '</a><span class="hide" data-tag="' + tag + '">　<a onclick="tagTL(\'tag\',\'' + tag + '\',false,\'add\')" class="pointer" title="#' + tag + 'のタイムライン">TL</a>　<a onclick="brInsert(\'#' + tag + '\')" class="pointer" title="#' + tag + 'でトゥート">Toot</a>　'+
            '<a onclick="tagRemove(\'' + key + '\')" class="pointer" title="#' + tag + 'をよく使うタグから削除">Unpin</a></span> ';
    });
    if(obj.length>0){
        $("#suggest").append("My Tags:" + tags);
    }else{
        $("#suggest").append("");
    }
}
function tagTL(a,b,c,d){
    var acct_id = $("#post-acct-sel").val();
    tl(a,b,acct_id,d);
}