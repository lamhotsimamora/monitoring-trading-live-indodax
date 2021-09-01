var Realtime = {
  data() {
    return {
      API_DATE_TIME: 'http://worldtimeapi.org/api/timezone/asia/jakarta',
      today: null,
      loading: false,
      status_alarm: null,
    }
  },
  methods: {
    showPriceFromStorage: function () {
      var m_p = _get('_ALARM_MORE_THAN_');
      var l_p = _get('_ALARM_LESS_THAN_');

      $alarm.price_more_than = m_p;
      $alarm.price_less_than = l_p;
      $alarm .displayLastBitcoin();
    },
    loadDateTime: function () {
      jnet({
        url: this.API_DATE_TIME,
        method: 'GET'
      }).request($response => {
        if ($response) {
          const obj = JSON.parse($response);
          if (obj) {
            this.today = obj.datetime;
          }
        }
      });
    }
  },
  mounted() {
    if (_get('_ALARM_START_') == false || _get('_ALARM_START_') === 'false') {
      this.status_alarm = 'OFF'
    } else {
      this.status_alarm = 'ON'
    }
    this.loadDateTime();
  },
}

var $realtime = Vue.createApp(Realtime).mount('#realtime');

var App = {
  data() {
    return {
      data_all_coin: null,
      btc_price_last: 0,
      btc_price_low: 0,
      btc_price_high: 0,
      chartId: 'candle_chart_history',
      label: 'Live Trading Bitcoin',
      data: [0, 10, 5, 2, 20, 30, 45],
      labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
      ],
      type: 'bar',
      background_color: 'rgb(11, 11, 25)',
      border_color: 'rgb(252, 12, 25)'
    }
  },
  methods: {
    loadDataCoin: function (coin, callback) {
      var _URL = null;
      switch (coin) {
        case 'BTC':
          _URL_ = API_BITCOIN_DATA;
          break;
        case 'ETH':
          _URL_ = API_BITCOIN_DATA;
          break;
        case 'ADA':
          _URL_ = API_BITCOIN_DATA;
          break;
        case 'ALL':
          _URL_ = API_ALL_DATA;
          break;
        default:
          break;
      }
      $realtime.loading = true;
      jnet({
        url: _URL_
      }).request($response => {
        $realtime.loading = false;
        if ($response) {
          var obj = JSON.parse($response);
          if (obj) {
            return callback(obj);
          }
        }
      });
    },
    upperCase: function (v) {
      return `<a href="#" style="color: brown">${v.toUpperCase()}</a>`;
    },
    moneyFormat: function (v) {
      r = 'Rp ';
      var value = v + '';
      var result = r + value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      return `${result}`;
    },
    loadChart: function () {
      const data = {
        labels: this.labels,
        datasets: [{
          label: this.label,
          backgroundColor: this.background_color,
          borderColor: this.borderColor,
          data: this.data,
        }]
      };

      new Chart(
        _(this.chartId), {
          type: this.type,
          data: data,
          options: {}
        }
      )
    },
    loadBitcoin: function () {
      var $this = this;

      $realtime.loading = true;
      this.loadDataCoin('BTC', function (obj) {
        const ticker = obj.ticker;
        $this.btc_price_last = ticker.last;
        $this.btc_price_low = ticker.low;
        $this.btc_price_high = ticker.high;

        $this.btc_price_last = _moneyFormat($this.btc_price_last);
        $this.btc_price_low = _moneyFormat($this.btc_price_low);
        $this.btc_price_high = _moneyFormat($this.btc_price_high);

        console.log('Load Bitcoin');

        $realtime.loading = false;
        if (_get('_ALARM_START_') == true || _get('_ALARM_START_') === 'true') {
          _runAlarm(ticker.last);
          $realtime.status_alarm = 'ON'
        } else {
          $realtime.status_alarm = 'OFF'
        }
      });
    },
    loadAll: function () {
      var $this = this;
      this.loadDataCoin('ALL', function (obj) {
        $this.data_all_coin = obj.tickers;
        console.log('Load All');
      });
    }
  },
  mounted() {
    this.loadBitcoin();
    setInterval(() => {
      this.loadBitcoin();
    }, _INTERVAL_RELOAD_);
    this.loadAll();
    setInterval(() => {
      this.loadAll();
    }, _INTERVAL_RELOAD_);
  },
}


var ModalAlarm = {
  data() {
    return {
      price_more_than: 0,
      price_less_than: 0,
      display_price: 0,
      price_last_bitcoin: 0
    }
  },
  methods: {
    displayLastBitcoin: function(){
      this.price_last_bitcoin = ($app.btc_price_last);
    },
    enterSetAlarm: function(e){
      if (e.keyCode==13){
        this.setAlarm();
      }
    },
    displayPrice: function (e) {
      return _moneyFormat(e);
    },
    stopAlarm: function () {
      _ALARM_START_ = false;
      _save('_ALARM_START_', false);
      stopAudioAlarm();
      $realtime.status_alarm = 'OFF'
      //_refresh();
    },
    setAlarm: function () {
      if (this.price_more_than == null || this.price_more_than == 0) {
        this.$refs.price_more_than.focus()
        return;
      }

      if (this.price_less_than == null || this.price_less_than == 0) {
        this.$refs.price_less_than.focus()
        return;
      }

      _ALARM_MORE_THAN_ = this.price_more_than;
      _ALARM_LESS_THAN_ = this.price_less_than;

      _save('_ALARM_MORE_THAN_', _ALARM_MORE_THAN_);
      _save('_ALARM_LESS_THAN_', _ALARM_LESS_THAN_);
      _save('_ALARM_START_', true);

      Swal.fire(
        'Alarm ON',
        'Alarm Diaktifkan !!!',
        'success'
      );

      $realtime.status_alarm = 'ON';
    },
  },
}


var $app = Vue.createApp(App).mount('#app');
var $alarm = Vue.createApp(ModalAlarm).mount('#modal_set_alarm');

{
  _showToast('Aplikasi Monitoring Bitcoin. Auto refresh data setiap 10 detik');
}