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
    $(".emoji-control").removeClass("hide");
    emojiList('home')
}
function defEmoji(target){
    var emojis=map;
    for (i = 0; i < emojis.length; i++) {
        var emoji = emojis[i];
        if (emoji.name==target) {
            var now = $("#textarea").val();
            var selin = localStorage.getItem("cursor");
            var now = $("#textarea").val();
             if(selin>0){
                 var before   = now.substr(0, selin);
                    var after    = now.substr(selin, now.length);
                            newt = before+ emoji.emoji + after;
                        }else{
                            newt = emoji.emoji+now;
                        }
                        console.log(emoji.emoji);
                        $("#textarea").val(newt);
                        //emoji();
                        $("#textarea").focus();
                         break;
                     }
                  }   
            
}