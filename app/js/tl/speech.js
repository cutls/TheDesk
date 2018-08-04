$voise        = null;
    $voiseName    = lang_speech[lang];
    $voices       = speechSynthesis.getVoices();
    $synthes      = new SpeechSynthesisUtterance();
    $voise = $.grep($voices, function(n, i){return n.name == $voiseName})[0];
    $synthes.voice = $voise;                  // 音声の設定
    localStorage.removeItem("voicebank");
    speechSynthesis.cancel()
    if(!localStorage.getItem("voice_vol")){
        localStorage.setItem("voice_vol",1)
    }
    $synthes.rate=localStorage.getItem("voice_speed");
    $synthes.pitch=localStorage.getItem("voice_pitch");
    $synthes.volume=localStorage.getItem("voice_vol");
function say(msg){
    msg=voiceParse(msg);
    var voice=localStorage.getItem("voicebank");
    var obj = JSON.parse(voice);
    if(!obj){
		var json = JSON.stringify([msg]);
		localStorage.setItem("voicebank", json);
	}else{
		obj.push([msg]);
		var json = JSON.stringify(obj);
		localStorage.setItem("voicebank", json);
	}
    
}
$repeat  = setInterval(function() {
    if(!speechSynthesis.speaking){
        var voice=localStorage.getItem("voicebank");
        if(voice){
            var obj = JSON.parse(voice);
            if(obj[0]){
                $synthes.text  = obj[0];
                console.log($synthes);
                speechSynthesis.speak($synthes);
                obj.splice(0, 1);
                var json = JSON.stringify(obj);
                localStorage.setItem("voicebank", json);
            }
        }
    }
}, 300);
function voiceParse(msg){
    msg = msg.replace(/#/g, "");
    msg = msg.replace(/'/g, "");
    msg = msg.replace(/"/g, "");
    msg = msg.replace(/https?:\/\/[a-zA-Z0-9./-@_=?&]+/g, "");
   return msg;
}
function voiceToggle(tlid) {
	var voiceck = localStorage.getItem("voice_" + tlid);
	if (voiceck) {
        localStorage.removeItem("voice_" + tlid);
        speechSynthesis.cancel()
		$("#sta-voice-" + tlid).text("Off");
        $("#sta-voice-" + tlid).css("color",'red');
        parseColumn();
	} else {
		localStorage.setItem("voice_" + tlid, "true");
		$("#sta-voice-" + tlid).text("On");
        $("#sta-voice-" + tlid).css("color",'#009688');
		parseColumn();
	}
}
function voiceCheck(tlid) {
    var voiceck = localStorage.getItem("voice_" + tlid);
	if (voiceck) {
		$("#sta-voice-" + tlid).text("On");
        $("#sta-voice-" + tlid).css("color",'#009688');
	} else {
		$("#sta-voice-" + tlid).text("Off");
        $("#sta-voice-" + tlid).css("color",'red');
	}
}
function voicePlay(){
    if(speechSynthesis.speaking){
        speechSynthesis.cancel()
    }else{
        $synthes.text  = $("#voicetxt").val();
        $synthes.rate = $("#voicespeed").val()/10;
        $synthes.pitch = $("#voicepitch").val()/50; 
        $synthes.volume = $("#voicevol").val()/100; 
        speechSynthesis.speak($synthes);
    }
}

function voiceSettings(){
    localStorage.setItem("voice_speed", $("#voicespeed").val()/10);
    localStorage.setItem("voice_pitch", $("#voicepitch").val()/50);
    localStorage.setItem("voice_vol", $("#voicevol").val()/100);
    Materialize.toast(lang_speech_refresh[lang], 3000);
}
function voiceSettingLoad(){
    var speed=localStorage.getItem("voice_speed");
    var pitch=localStorage.getItem("voice_pitch");
    var vol=localStorage.getItem("voice_vol");
    if(speed){
        $("#voicespeed").val(speed*10);
    }
    if(pitch){
        $("#voicepitch").val(pitch*50);
    }
    if(vol){
        $("#voicevol").val(vol*100);
    }
}