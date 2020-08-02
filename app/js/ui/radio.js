var r = document.getElementById("radio")
function Rtoggle() {
    if ($("#radio").hasClass("play")) {
        Rstop()
    } else {
        $("#radio-view").toggleClass("hide")
        $("#radio-view").toggleClass("show")
        $("#radio-input").addClass("hide")
    }
}
function Rplay(url, name) {
    $("#radio").attr('src', url)
    r.load()
    r.play()
    $("#radio").addClass("play")
    $("#radio-btn").addClass("teal-text")
    $("#radio-sta").html("<br>Now Playing:" + name)
}
function Rstop() {
    $("#radio").attr("src", "")
    r.pause()
    $("#radio").removeClass("play")
    $("#radio-btn").removeClass("teal-text")
    $("#radio-sta").html("")
}
function Ryourself() {
    $("#radio-input").removeClass("hide")
    $("#radio-view").addClass("hide")
}
function Rselect() {
    $("#radio-input").addClass("hide")
    $("#radio-view").removeClass("hide")
}
function Rinput() {
    var url = $("#radio-url").val()
    Rplay(url, url)
}
/*
<span id="radio-sta" class="radio"></span>
<div id="radio-view" class="hide radio mize">
<a onclick="nowplaying('spotify')" class="pointer" title="Ctrl+Shift+N"><i class="fa fa-spotify"></i>NowPlaying</a>
<span class="cbadge pointer waves-effect" onclick="Rplay('https://listen.moe/stream','Listen.moe')" data-name="Listen.moe">Listen.moe</span>
<span class="cbadge pointer waves-effect" onclick="Rplay('http://itori.animenfo.com:443/;','AnimeNfo Radio')" data-name="AnimeNfo Radio">AnimeNfo Radio</span>
<span class="cbadge pointer waves-effect" onclick="Rplay('http://hyades.shoutca.st:8043/stream','LoFi hip hop Radio')" data-name="LoFi hip hop Radio">LoFi hip hop Radio</span>
<span class="cbadge pointer waves-effect" onclick="Rplay('http://89.16.185.174:8004/stream','Linn Classical')" data-name="Linn Classical">Linn Classical</span>
<span class="cbadge pointer waves-effect" onclick="Rplay('http://89.16.185.174:8000/stream','Linn Jazz')" data-name="Linn Jazz">Linn Jazz</span>
<span class="cbadge pointer waves-effect" onclick="Rplay('http://edge-ads-01-cr.sharp-stream.com/jazzfmmobile.aac','Jazz FM')" data-name="Jazz FM">Jazz FM</span>
<span class="cbadge pointer waves-effect" onclick="Rplay('http://91.121.59.45:10024/stream','canal-jazz.eu')" data-name="canal-jazz.eu">canal-jazz.eu</span>
<span class="cbadge pointer waves-effect" onclick="Ryourself()">Others</span>
</div>
<div id="radio-input" class="hide radio mize">
<input type="url" id="radio-url" placeholder="URL" style="width:100px">
<button class="btn waves-effect" onclick="Rinput()">Play</button>
<button class="btn waves-effect" onclick="Rselect()">Presets</button>
</div>
*/