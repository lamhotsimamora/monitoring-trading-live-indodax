function _(e){
    return document.getElementById(e);
}

function _moneyFormat(v, r) {
    r = r === undefined ? 'Rp ' : r; 
    return r + v.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); 
} 

function _moreThanPrice(value_price_now){
    var vpn = parseFloat(value_price_now);
    var amt = parseFloat(_get('_ALARM_MORE_THAN_'));
    return  (vpn >= amt) ? true : false;
}

function _lessThanPrice(value_price_now){
    var vpn = parseFloat(value_price_now);
    var alt = parseFloat(_get('_ALARM_LESS_THAN_'));
    return  (vpn <= alt) ? true : false;
}

function _save(k,v){
    localStorage.setItem(k,v);
}

function _get(k){
    return localStorage.getItem(k) ? localStorage.getItem(k) : undefined;
}

function _refresh(){
    window.location.href = '.';
}


// check alarm in local storage
if (_get('_ALARM_START_')===undefined){
    _save('_ALARM_START_',false);
    _save('_ALARM_MORE_THAN_',false);
    _save('_ALARM_LESS_THAN_',false);
}else{
    _ALARM_START_     = _get('_ALARM_START_');
    _ALARM_MORE_THAN_ = _get('_ALARM_MORE_THAN_');
    _ALARM_LESS_THAN_ = _get('_ALARM_LESS_THAN_');
}


function _runAlarm(value_price_now){
    console.log("Alarm RUN @");
    if (_moreThanPrice(value_price_now)){
        console.log("Alarm Play : More Than Price")
        playAudioAlarm();
    }else{
        console.log("Price Now "+_moneyFormat(value_price_now)+' -> '+_moneyFormat(_ALARM_MORE_THAN_));
    }

    if (_lessThanPrice(value_price_now)){
        console.log('Alarm Play : Less Than Price')
        playAudioAlarm();
    }
    else{
        console.log("Price Now "+_moneyFormat(value_price_now)+' -> '+_moneyFormat(_ALARM_LESS_THAN_));
    }
}