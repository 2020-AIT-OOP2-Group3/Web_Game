var random_array = [1,2,3,4,5,6,7,8,9]
var remaining_time = document.querySelector("#remaining_time"); //残り時間
const startTime = Date.now();//ゲームスタート時刻
var result = "";

//パズルピースの並びを決める(ランダムで決定)
function make_question(){
  for(var i = 0; i < 9 ; i++){
    var r = Math.floor(Math.random() * 4);
    var temp = random_array[i];
    random_array[i] = random_array[r];
    random_array[r] = temp;
  }
  for (var i = 0; i < 9; i++) {
    var piece = document.createElement("img");
    piece.id = "a_" + random_array[i];
    piece.src = "../../static/puzzle_notore/3_1/shiba-" + random_array[i] + ".jpg";
    piece.className = "piece";
    //ドラッグできるようにしたい要素の draggable 属性の値を true に設定
    piece.draggable = true;
    //ondragstartイベントとは、ドラッグ操作を始めた時のイベント
    piece.ondragstart = dragstart;
    //appendChildは、特定の親要素の中に要素を追加するためのメソッド
    document.querySelector("#question_piece").appendChild(piece);
  }
}

function dragstart(event){
	//ドラッグするデータのid名をDataTransferオブジェクトにセット
  event.dataTransfer.setData("t", event.target.id);
  event.stopPropagation();
}

/*
ドラッグ要素がドロップ要素に重なっている間の処理 
*/
function dragover(event){
	//dragoverイベントをキャンセルして、ドロップ先の要素がドロップを受け付けるようにする
	event.preventDefault();
}

/*
マス目にドロップされた時の処理
*/
function drop(event){
	//ドラッグされたデータのid名をDataTransferオブジェクトから取得
	var id_name = event.dataTransfer.getData("t");
	//id名からドラッグされた要素を取得
  var drag_elm =document.getElementById(id_name);
  //子要素がない場合のみ要素を追加できる
  if(!(event.currentTarget.hasChildNodes())){
    //ドロップ先にドラッグされた要素を追加
    event.currentTarget.appendChild(drag_elm);
  }
  //ブラウザのデフォルト動作の抑制 ← 調べたところdropイベントはこれをする必要があるということだった
  event.preventDefault();
}

/*
ピースの置き場(上の長方形の内部)にドロップされた時の処理
*/
function freedrop(event){
	//ドラッグされたデータのid名をDataTransferオブジェクトから取得
	var id_name = event.dataTransfer.getData("t");
	//id名からドラッグされた要素を取得
  var drag_elm =document.getElementById(id_name);
  //ドロップ先にドラッグされた要素を追加
  event.currentTarget.appendChild(drag_elm);
  //ブラウザのデフォルト動作の抑制　←　調べたところdropイベントはこれをする必要があるということだった
  event.preventDefault();
}

/*
ドラッグ要素が入ってきた時に発生するイベント
*/
function dragenter(event){
  event.preventDefault();
}

//答え合わせ
function check(){
  for(var i = 1; i <= 9; i++){
    var Parent = document.querySelector("#drop" + i);
    console.log(Parent);
    if(Parent.children[0] != null){
      if(Parent.children[0].id == "a_" + i){
        if(i == 9)  result = "OK";
        continue;
      }else{
        result = "NG";
      }
    }else{
      result = "NG";
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
    // タイマー終了を伝える
    text = "終了";
    check()
    console.log(result);
  }

  // 残り時間を画面に表示
  document.querySelector('#remaining_time').innerHTML = text;
})

