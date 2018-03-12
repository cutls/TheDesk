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