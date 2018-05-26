var defaultemojiList=["activity","flag","food","nature","object","people","place","symbol"];
var defaultemoji={
    activity:activity,
    flag:flag,
    food:food,
    nature:nature,
    object:object,
    people:people,
    place:place,
    symbol:symbol
};
var defaultemojiname={
    activity:"活動",
    flag:"国旗",
    food:"食べ物",
    nature:"自然",
    object:"もの",
    people:"ひと",
    place:"場所",
    symbol:"記号"
};
function defaultEmoji(target){
    var json=defaultemoji[target];
    var emojis="";
    Object.keys(json).forEach(function(key) {
        var emoji = json[key];
        emojis = emojis + '<a onclick="defEmoji(\''+emoji["shortcode"]+'\')" class="pointer"><span style="width: 20px; height: 20px; display: inline-block; background-image: url(\'./img/sheet.png\'); background-size: 4900%; background-position: '+emoji["css"]+';"></span></a>';
    });
    $("#emoji-list").html(emojis);
    $("#now-emoji").text(defaultemojiname[target]+"の絵文字");
    $(".emoji-control").addClass("hide");
}
function customEmoji(){
    $("#emoji-suggest").val("");
    $(".emoji-control").removeClass("hide");
    emojiList('home')
}
function defEmoji(target){
    if(target=="thinking_face"){
        target="thinking";
    }
    //var emoji=emojione.shortnameToUnicode(":"+target+":");
    var emojiraw = emojisc.emojis.filter(function(item, index){
        if (item.shortname == ':'+target+":") return true;
      });
    var emoji=emojiraw[0].emoji;
    var now = $("#textarea").val();
    var selin = localStorage.getItem("cursor");
    var now = $("#textarea").val();
     if(selin>0){
        var before = now.substr(0, selin);
        var after = now.substr(selin, now.length);
        newt = before+ emoji + after;
            }else{
        newt = emoji+now;
        }
        console.log(emoji);
        $("#textarea").val(newt);
        $("#textarea").focus();
        var selin = $("#textarea").prop('selectionStart');
	    if(!selin){
	    	selin=0;
	    }
	        localStorage.setItem("cursor", selin);
}
function faicon(){
    var json=faicons;
    console.log(json);
    var emojis="";
    Object.keys(json).forEach(function(key) {
        var emoji = json[key];
        var eje = emoji.replace( /fa-/g , "" ) ;
        emojis = emojis + '<a onclick="emojiInsert(\'[faicon]'+eje+'[/faicon]\')" class="pointer white-text" style="font-size:24px"><i class="fa '+emoji+'"></i></a>';
    });
    $("#emoji-list").html(emojis);
    $("#now-emoji").text("faicon");
    $(".emoji-control").addClass("hide");
}