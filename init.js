const API_BITCOIN_DATA = "https://indodax.com/api/btc_idr/ticker";
const API_ALL_DATA = "https://indodax.com/api/tickers";


var _ALARM_MORE_THAN_ = null;
var _ALARM_LESS_THAN_ = null;
var _ALARM_START_     =false;
var _INTERVAL_RELOAD_ = 10000;

var wavesurfer = WaveSurfer.create({
    container: '#alarm_sound'
});

wavesurfer.load('./assets/audio/alarm.mp3');

function playAudioAlarm() {
   wavesurfer.play();
}

function stopAudioAlarm(){
    wavesurfer.stop();
}


function _showToast(msg,type='success'){
    new Toast({
        message: msg,
        type: type
    });
}