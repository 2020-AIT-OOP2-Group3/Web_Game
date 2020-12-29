var random_piece_array = [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]//ピースの番号を格納
var img_array = ["fox", "cat", "tower", "fish", "monariza", "road"]//(キツネの写真,魚の写真,エッフェル塔の写真....)
var remaining_time = document.querySelector("#remaining_time"); //残り時間
const startTime = Date.now();//ゲームスタート時刻
var result = "";//結果「complete」or「incomplete」
var completeORincomplete = document.querySelector("#completeORincomplete");//「complete」or「incomplete」
var complete_image = document.querySelector("#complete_image"); //完成版の画像
var ketteion = document.querySelector("#ketteion"); //パズルをマスにはめる時の音
var hakushu_sho = document.querySelector("#hakushu_sho"); //小さい拍手音
var hakushu_dai = document.querySelector("#hakushu_dai"); //大きい拍手音
var hakushu_time = 0; //拍手音を鳴らした時間(単位はミリ秒)

/*
ゲームスタート時のパズルピースの並びを決める(ランダムで決定)
*/
function make_question() {
  for (var i = 0; i < 25; i++) {
    //0から15の範囲でランダムな数字を生成
    var r = Math.floor(Math.random() * 25);
    //画像番号を格納する配列の中身をランダムに並び替える
    var temp = random_piece_array[i];
    random_piece_array[i] = random_piece_array[r];
    random_piece_array[r] = temp;
  }

  //配列の添字をランダムに選ぶ(これはキツネの写真?,魚の写真?,エッフェル塔の写真?....を決定するため)
  var r = Math.floor(Math.random() * 6);
  //要素のsrc属性にパズルの完成図を設定
  complete_image.src = "../../static/puzzle_notore/" + img_array[r] + "5_5" + "/" + img_array[r] + ".png"
  for (var i = 0; i < 25; i++) {
    //img要素を作成
    var piece = document.createElement("img");
    //要素にidを設定
    piece.id = "a_" + random_piece_array[i];
    //要素のsrc属性にピース画像を設定
    piece.src = "../../static/puzzle_notore/" + img_array[r] + "5_5" + "/" + img_array[r] + random_piece_array[i] + ".JPG";
    //要素にクラス名を設定
    piece.className = "piece";
    //ドラッグできるようにしたい要素の draggable 属性の値を true に設定
    piece.draggable = true;
    //ondragstartイベントを設定
    piece.ondragstart = dragstart;
    //appendChildは、特定の親要素の中に要素を追加するためのメソッド
    document.querySelector("#question_piece").appendChild(piece);
  }
}

/*
ドラッグが開始した時の処理
*/
function dragstart(event) {
  //ドラッグするデータのidをDataTransferオブジェクトにセット
  event.dataTransfer.setData("t", event.target.id);
  //イベントが親要素に予期せぬ伝播をしてしまわないようにする
  event.stopPropagation();
}

/*
マス目にドロップされた時の処理
*/
function drop(event) {
  //再生位置を始めに戻すことで連打に対応
  ketteion.currentTime = 0;
  ketteion.play();
  //ドラッグされたデータのidをDataTransferオブジェクトから取得
  var id = event.dataTransfer.getData("t");
  //idからドラッグされた要素を取得
  var drag_elm = document.getElementById(id);
  //子要素がない場合
  if (!(event.currentTarget.hasChildNodes())) {
    //ドロップ先にドラッグされた要素を追加
    event.currentTarget.appendChild(drag_elm);
  }
  //ブラウザのデフォルト動作の抑制
  event.preventDefault();
}

/*
ピースの一時置き場(長方形の部分)にドロップされた時の処理
*/
function freedrop(event) {
  //ドラッグされたデータのidをDataTransferオブジェクトから取得
  var id = event.dataTransfer.getData("t");
  //idからドラッグされた要素を取得
  var drag_elm = document.getElementById(id);
  //ドロップ先にドラッグされた要素を追加
  event.currentTarget.appendChild(drag_elm);
  //ブラウザのデフォルト動作の抑制　
  event.preventDefault();
}

/*
ドラッグ要素が入ってきた時に発生するイベント
*/
function dragenter(event) {
  //ブラウザのデフォルト動作の抑制　
  event.preventDefault();
}

/*
ドラッグ要素がドロップ要素に重なっている間の処理 
*/
function dragover(event) {
  //ブラウザのデフォルト動作の抑制
  event.preventDefault();
}

/*
答え合わせ
*/
function check() {
  for (var i = 1; i <= 25; i++) {
    //マスの要素を取得
    var masu = document.querySelector("#drop" + i);
    //マスの要素上にピースがあるか？
    if (masu.children[0] != null) {
      //マスの要素上にあるピースのidは答えと等しいか？
      if (masu.children[0].id == "a_" + i) {
        //全てのマスの要素上にあるピースのidが答えと等しければ正解
        if (i == 25) result = "complete";
        //スキップ
        continue;
      } else {
        result = "incomplete";
        break;
      }
    } else {
      result = "incomplete";
      break;
    }
  }
}

/*
一定の間隔ごとに処理を呼び出すメソッド
*/
var timer = setInterval(() => {

  // 現在時刻 - ゲームスタート時点の時刻
  var diff = Date.now() - startTime;

  //30秒経過まで、あと何ミリ秒か？
  var diffSec = 150000 - diff;

  //ミリ秒を整数に変換
  remaining_time = Math.ceil(diffSec / 1000);
  var text = "あと" + remaining_time + "秒";

  //答え合わせをして、resultに結果を代入する関数
  check();

  // 0秒以下　かつ　パズルが未完成なら
  if (remaining_time <= 0 && result != "complete") {
    //タイマーを停止
    clearInterval(timer);
    //送信するデータの値を設定
    completeORincomplete.value = "incomplete";
    //送信
    document.result.submit();
    // タイマー終了を伝える
    text = "終了";
  }

  //正解している　かつ　拍手音を鳴らした時間が800ミリ秒より短いなら
  if(result == "complete" && hakushu_time < 800){
    //拍手音を鳴らす(上級レベルなので、大きい拍手音にしました)
    hakushu_dai.play();
    // タイマー終了を伝える
    text = "終了";
    //拍手音を鳴らした時間を更新
    hakushu_time += 1;
  }
  //正解している　かつ　拍手音を鳴らした時間が800ミリ秒以上なら
  else if(result == "complete" && hakushu_time >= 800){
    //タイマーを停止
    clearInterval(timer);
    //送信するデータの値を設定
    completeORincomplete.value = "complete";
    //送信
    document.result.submit();
    // タイマー終了を伝える
    text = "終了";
  }
  document.querySelector('#remaining_time').innerHTML = text;
})





