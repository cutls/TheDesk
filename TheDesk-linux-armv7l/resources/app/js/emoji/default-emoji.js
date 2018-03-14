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
    var html=defaultemoji[target];
    $("#emoji-list").html(html);
    $("#now-emoji").text(defaultemojiname[target]+"の絵文字");
    $(".emoji-control").addClass("hide");
}
function customEmoji(){
    $(".emoji-control").removeClass("hide");
    emojiList('home')
}
function defEmoji(target){
    var start = "./js/emoji/emoji-map.json";
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function()
    {
        if( this.readyState == 4 && this.status == 200 ) {
            if( this.response){
                var json=this.response;
                var emojis=json.emojis;
                for (i = 0; i < emojis.length; i++) {
                     var emoji = emojis[i];
                      if (emoji.shortname==target) {
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
        }
}

xmlHttpRequest.open( 'GET', start, true );
xmlHttpRequest.responseType = 'json';
xmlHttpRequest.send( null );
}