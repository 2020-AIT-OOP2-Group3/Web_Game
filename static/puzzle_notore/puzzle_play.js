var random_piece_array = [1, 2, 3, 4, 5, 6, 7, 8, 9]//ピースの番号を格納
var img_array = ["choujyou", "jyuudou", "shiba", "sugina", "sunahama", "yama"]//(頂上の写真,柔道の写真,柴犬の写真....)
var remaining_time = document.querySelector("#remaining_time"); //残り時間
const startTime = Date.now();//ゲームスタート時刻
var result = "";//結果「complete」or「incomplete」
var completeORincomplete = document.querySelector("#completeORincomplete");//「complete」or「incomplete」
var complete_image = document.querySelector("#complete_image"); //完成版の画像

/*
ゲームスタート時のパズルピースの並びを決める(ランダムで決定)
*/
function make_question() {
  for (var i = 0; i < 9; i++) {
    //0から8の範囲でランダムな数字を生成
    var r = Math.floor(Math.random() * 9);
    //画像番号を格納する配列の中身をランダムに並び替える
    var temp = random_piece_array[i];
    random_piece_array[i] = random_piece_array[r];
    random_piece_array[r] = temp;
  }

  //配列の添字をランダムに選ぶ(これは頂上の写真?,柔道の写真?,柴犬の写真?....を決定するため)
  var r = Math.floor(Math.random() * 6);
  //要素のsrc属性にパズルの完成図を設定
  complete_image.src = "../../static/puzzle_notore/" + img_array[r] + "33" + "/" + img_array[r] + ".png"
  for (var i = 0; i < 9; i++) {
    //img要素を作成
    var piece = document.createElement("img");
    //要素にidを設定
    piece.id = "a_" + random_piece_array[i];
    //要素のsrc属性にピース画像を設定
    piece.src = "../../static/puzzle_notore/" + img_array[r] + "33" + "/" + img_array[r] + random_piece_array[i] + ".JPG";
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
  for (var i = 1; i <= 9; i++) {
    //マスの要素を取得
    var masu = document.querySelector("#drop" + i);
    //マスの要素上にピースがあるか？
    if (masu.children[0] != null) {
      //マスの要素上にあるピースのidは答えと等しいか？
      if (masu.children[0].id == "a_" + i) {
        //全てのマスの要素上にあるピースのidが答えと等しければ正解
        if (i == 9) result = "complete";
        //スキップ
        continue;
      } else {
        result = "incomplete";
      }
    } else {
      result = "incomplete";
    }
  }
}

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
    //答え合わせをして、resultに結果を代入する関数
    check()
    //送信するデータの値を設定
    completeORincomplete.value = result;
    //送信
    document.result.submit();
    // タイマー終了を伝える
    text = "終了";
  }

  // 残り時間を画面に表示
  document.querySelector('#remaining_time').innerHTML = text;
})

