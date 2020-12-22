//1〜3は左が勝ったとき 4〜6は右が勝ったとき
let hands = [[1, "グー", "チョキ", "../../static/janken_notore/gu.png", "../../static/janken_notore/choki.png"],
[2, "チョキ", "パー", "../../static/janken_notore/choki.png", "../../static/janken_notore/pa.png"],
[3, "パー", "グー", "../../static/janken_notore/pa.png", "../../static/janken_notore/gu.png"],
[4, "グー", "パー", "../../static/janken_notore/gu.png", "../../static/janken_notore/pa.png"],
[5, "チョキ", "グー", "../../static/janken_notore/choki.png", "../../static/janken_notore/gu.png"],
[6, "パー", "チョキ", "../../static/janken_notore/pa.png", "../../static/janken_notore/choki.png"]];
var OKs = []; //正解するごとに"OK"を格納
var NGs = [];　//ミスするごとに"NG"を格納
var question_hands = []; //hands[0]〜hands[5]のいずれかを格納
var question_text = document.querySelector("#question_text"); //問題文
var remaining_time = document.querySelector("#remaining_time"); //残り時間
var hand1 = document.querySelector("#hand1");//じゃんけんの手(左側)
var hand2 = document.querySelector("#hand2");//じゃんけんの手(右側)
const startTime = Date.now();//ゲームスタート時刻
var OK_times = document.querySelector("#OK_times");//"正解数"
var NG_times = document.querySelector("#NG_times");//"不正解数"
var kaisu = document.querySelector("#kaisu"); //解いた問題の数
var int_kaisu = 0; //解いた問題の数
var OK_sound = document.querySelector("#OK_sound"); //正解音
var NG_sound = document.querySelector("#NG_sound"); //不正解音

OK_sound.volume = 0.10;
NG_sound.volume = 0.08;

var question = ""

/*
問題を表示する関数
*/
function make_question() {
  var question_text_num = Math.floor(Math.random() * 2);
  if (question_text_num == 0) {
    document.querySelector("#question_text").innerText = "どっちが勝ち？"
    question = "win"
  } else {
    question_text.innerText = "どっちが負け？"
    question = "lose"
  }
  question_hands = hands[Math.floor(Math.random() * hands.length)];
  hand1.innerHTML = "<img src='" + question_hands[3] + "'width=290 height=270>"
  hand1.value = question_hands[0];
  hand2.innerHTML = "<img src='" + question_hands[4] + "'width=290 height=270>"
  hand2.value = question_hands[0];
}

//左側の手がクリックされた時
hand1.addEventListener('click', function () {
  //解いた問題の数
  int_kaisu += 1;
  kaisu.innerText = int_kaisu + "回目";
  if (question == "win") {
    if (hand1.value <= 3) {
      //再生位置を始めに戻すことで連打に対応
      OK_sound.currentTime = 0;
      OK_sound.play();
      OKs.push("OK");
    } else {
      //再生位置を始めに戻すことで連打に対応
      NG_sound.currentTime = 0;
      NG_sound.play();
      NGs.push("NG");
    }
  } else {
    if (hand1.value >= 4) {
      //再生位置を始めに戻すことで連打に対応
      OK_sound.currentTime = 0;
      OK_sound.play();
      OKs.push("OK");
    } else {
      //再生位置を始めに戻すことで連打に対応
      NG_sound.currentTime = 0;
      NG_sound.play();
      NGs.push("NG");
    }
  }
  /*
  if(hand1.value <= 3){
    OKs.push("OK");
  }else{
    NGs.push("NG");
  }
  */
  make_question();
}, false);

//右側の手がクリックされた時
hand2.addEventListener('click', function () {
  //解いた問題の数
  int_kaisu += 1;
  kaisu.innerText = int_kaisu + "回目";
  if (question == "win") {
    if (hand2.value >= 4) {
      //再生位置を始めに戻すことで連打に対応
      OK_sound.currentTime = 0;
      //再生
      OK_sound.play();
      OKs.push("OK");
    } else {
      //再生位置を始めに戻すことで連打に対応
      NG_sound.currentTime = 0;
      //再生
      NG_sound.play();
      NGs.push("NG");
    }
  } else {
    if (hand2.value <= 3) {
      //再生位置を始めに戻すことで連打に対応
      OK_sound.currentTime = 0;
      //再生
      OK_sound.play();
      OKs.push("OK");
    } else {
      //再生位置を始めに戻すことで連打に対応
      NG_sound.currentTime = 0;
      //再生
      NG_sound.play();
      NGs.push("NG");
    }
  }
  /*
  if(hand2.value >= 3){
    OKs.push("OK");
  }else{
    NGs.push("NG");
  }
  */
  make_question();
}, false);

/*
一定の間隔ごとに処理を呼び出すメソッド
*/
const timer = setInterval(() => {

  // 現在時刻 - ゲームスタート時点の時刻
  const diff = Date.now() - startTime;

  //30秒経過まで、あと何ミリ秒か？
  const diffSec = 30000 - diff;

  //ミリ秒を整数に変換
  remaining_time = Math.ceil(diffSec / 1000);
  let text = "あと" + remaining_time + "秒";

  // 0秒以下になったら
  if (diffSec <= 0) {
    //タイマーを停止
    clearInterval(timer);
    OK_times.value = OKs.length;
    NG_times.value = NGs.length;
    document.result.submit();
    // タイマー終了を伝える
    text = "終了";
  }

  // 残り時間を画面に表示
  document.querySelector('#remaining_time').innerHTML = text;
})



