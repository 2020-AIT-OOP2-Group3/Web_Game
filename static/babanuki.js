$(document).ready(function(){

  var handcard;
  var fin;
  var turnPlayer;
  var rank0 = document.querySelector("#rank0");
  /* 開始ボタン押し */
  $("#start").on("click", function(){

    displayMessage("手札が配られます");
    $("#title").css("visibility", "hidden");
    $("#com1").css("visibility", "visible");
    $("#com2").css("visibility", "visible");
    $("#com3").css("visibility", "visible");
    /* 初期化 */
    handcard = new Array();
    fin = new Array();
    for(var i=0; i<4; i++) {
      handcard[i] = new Array();
      fin[i] = 0;
      nodisplayRank(i);
    }

    /* 山札 */
    var deck = [];

    /* 山札にカードをセット */
    for(var i=0; i<53; i++) {
      deck[i] = i;
    }

    /* 山札シャッフル */
    shuffle(deck,100);

    /* 最初のプレイヤーをランダムで決める */
    turnPlayer = Math.floor( Math.random() * 4);

    /* 手札にカードを分ける */
    idx = turnPlayer;
    for(var i=0; i<53; i++){
      handcard[idx].push(deck[i]);
      idx++;
      if(idx==4)idx=0;
    }

    /* 同じ数値のカードを捨てる */
    for(var i=0; i<4; i++){
      cardChk(i);
    }

    /* コンピューターのカードを表示する */
    for(var i=1; i<4; i++){
      dispComputerAllCard(i)
    }

    /* プレイヤーのカードを表示する */
    dispPlayerAllCard();

    exeNextPlayer();

    disabledStart();
  });

  /* 次のプレイヤーを決定する */
  function decideNextPlayer(){
    for( var i=0; i<4; i++ ){
      turnPlayer++;
      if( turnPlayer == 4 ){
        turnPlayer=0;
        break;
      }else{
        if( fin[turnPlayer] == 0 ){
          break;
        }
      }
    }
  }

  /* 次のプレイヤーの処理をする */
  function exeNextPlayer(){
    if (turnPlayer == 0){
      for(var i=1; i<4; i++){
        if( fin[i]==0){
          break;
        }
      }
      displayMessage("コンピューター" + (i) + "からカードを取ってください。\nあなたの番です");
    }else{
      displayMessage("コンピューター"+ (turnPlayer) +"の番です");
      setTimeout(function(){getCardComputer();}, 1000);
    }
  }

  /* コンピューターがカードを取る */
　function getCardComputer(){
    /* 誰から取るかを決める */
    var getIdx = turnPlayer;
    for( var i=0; i<3; i++){
      if( getIdx == 3 ){
        getIdx = 0;
        break;
      }
      getIdx++;
      if( fin[getIdx]==0 ){
          break;
      }
    }

    /* どのカードを取るか決める */
    var getCardIdx = Math.floor( Math.random() * handcard[getIdx].length);

    /* 取った人のカードを増やす */
    handcard[turnPlayer].push(handcard[getIdx][getCardIdx]);
    displayBack( handcard[turnPlayer].length-1, turnPlayer);

    /* 取られた人のカードを減らす */
    handcard[getIdx][getCardIdx]=-1;
    cardSride(getIdx);

    if( getIdx == 0 ){
      dispPlayerAllCard();
    }else{
      dispComputerAllCard(getIdx);
    }

    /* 取られた人のカードがなくなった時の処理 */
    var ret = setRank(getIdx);

    if( ret == 0 ){
      setTimeout(function(){throwCardComputer();}, 1000);
    }else{
      enabledStart();
    }
  }

  /* コンピューターがカードを捨てる */
　function throwCardComputer(){

    cardChk(turnPlayer);

    if ( handcard[turnPlayer].length != 0 ){
      shuffle(handcard[turnPlayer], 10);
    }

    dispComputerAllCard(turnPlayer);

    /* コンピューターのカードがなくなった時の処理 */
    var ret = setRank(turnPlayer);

    if( ret == 0 ){
      /* 次のプレイヤーを検索 */
      decideNextPlayer();
      exeNextPlayer();
    }else{
      enabledStart();
    }
  }

  /* プレイヤーがカードを捨てる */
  function throwCardPlayer(){
    cardChk(0);

    dispPlayerAllCard();

    /* カードがなくなった時の処理 */
    var ret = setRank(turnPlayer);
    if( ret == 0 ){
      decideNextPlayer();
      exeNextPlayer();
    }else{
      enabledStart();
    }
  }

  /* カードをクリックしたときの処理 */
  function clickCard( x, y ){
    if( turnPlayer != 0 ){return;}
    for( var i=1; i<4; i++){
      if(fin[i]==0){
        if( y == i ){
          break;
        }else{
          return;
        }
      }
    }

    /* プレイヤーのカードを追加 */
    handcard[0].push(handcard[y][x]);
    if(handcard[y][x]!=52){
      display( handcard[0].length-1, 0, handcard[y][x]);
    }else{
      displayJoker(handcard[0].length-1,0);
    }

    /* コンピューターのカードを削除 */
    handcard[y][x]=-1;
    nodisplay( handcard[y].length-1, y);
    cardSride(y);

    /* コンピューターのカードがなくなった時の処理 */
    setRank(y);
    throwCardPlayer();
  }

  /* カードをシャッフルする */
  function shuffle( cards, num ){
    var n = cards.length;
    for(var i=0; i<num; i++) {
      var tmp;
      var rand1 = Math.floor( Math.random() * n);
      var rand2 = Math.floor( Math.random() * n);

      tmp = cards[rand1];
      cards[rand1] = cards[rand2];
      cards[rand2] = tmp
    }
  }

  /* 同じ数値のカードを確認する。 */
  /* 同じ数値のカードは、-1にする。 */
  function cardChk(idx){
    var arr = handcard[idx];
    var num = arr.length;
    for( var i=0; i<num-1; i++ ){
      if( arr[i]!=-1 && arr[i] != 52){
        for( var j=i+1; j<num; j++){
          if( arr[j]!=-1 && arr[j] != 52){
            if( arr[i]%13 == arr[j]%13 ){
              if(idx==0){
                displayMessage(((arr[i]%13)+1)+"が揃いました");
              }
              arr[i] = -1;
              arr[j] = -1;
              break;
            }
          }
        }
      }
    }
    cardSride(idx);
  }

  /* 手札を配列の左に詰める */
  function cardSride(idx){
    var tmpArr = new Array();
    var arr = handcard[idx];
    var num = arr.length;
    var tmpIdx = 0;
    for( var i=0; i<num; i++){
      if( arr[i] != -1){
        tmpArr[tmpIdx] = arr[i];
        tmpIdx++;
      }
    }
    handcard[idx] = tmpArr;
  }

  /* プレイヤーの全カードを表示する */
  function dispPlayerAllCard(){

    /* 手札を表示する */
    for( var i=0; i < handcard[0].length; i++){
      if (handcard[0][i]!=52){
        display(i,0,handcard[0][i]);
      } else{
        displayJoker(i,0);
      }
    }

    /* 手札でないものは非表示する */
    for( var j=i; j<13; j++){
      nodisplay(j,0);
    }
  }

  /* コンピューターの全カードを表示する */
  function dispComputerAllCard(idx){

    /* 手札を裏で表示する */
    for( var i=0; i < handcard[idx].length; i++){
      displayBack(i,idx);
    }

    /* 手札でないものは非表示する */
    for( var j=i; j<13; j++){
      nodisplay(j,idx);
    }
  }

  /* ランキングを設定 */
  /* 戻り値 0:ゲームを続ける 1:ゲームを終了する */
  function setRank(idx){
    if( handcard[idx].length == 0 ){
      var rank = 1;
      for( var i=0; i<4; i++ ){
        if( fin[i] == 1 ){
          rank++;
        }
      }
      fin[idx] = 1;

      /* プレイヤーの勝利 */
      if( idx == 0 ){
        displayRank( idx);
        rank0.value = rank;
        displayMessage("上がりました");
        setTimeout(function(){document.result.submit();}, 2000);
        return 1;
      }else{
        if( rank == 3 ){
          /* コンピューター全員終了、プレイヤー負け */
          displayRank( idx);
          rank0.value = 4;
          displayMessage("上がれませんでした");
          setTimeout(function(){document.result.submit();}, 2000);
          return 1;
        }else{
          /* コンピューターまだ残っている */
          displayRank( idx);
          return 0;
        }
      }
    }
    return 0;
  }

  /* 指定位置のカードを非表示にする */
  function nodisplay(x, y){
    var posStr = '#card' + y + x;
    $(posStr).css("visibility","hidden");
  }

  /* 指定位置のカードを指定番号で表示する */
  function display(x, y, num){
    var posStr = '#card' + y + x;
    var left = x*80+50;
    var top = y*400+600;
   
    $(posStr).attr('src','/static/CardImage/'+num+'.png');
    $(posStr).css("height", 170);
    $(posStr).css("left", left);
    $(posStr).css("top", top);
    $(posStr).css("visibility","visible");
  }

  /* 指定位置にジョーカーを表示する */
  function displayJoker( x, y ){
    var posStr = '#card' + y + x;
    var left = x*80+50;
    var top = y*400+600;

    $(posStr).attr('src','/static/CardImage/52.png');
    $(posStr).css("height", 170);
    $(posStr).css("left", left);
    $(posStr).css("top", top);
    $(posStr).css("visibility","visible");
  }

  /* 指定位置に裏を表示する */
  function displayBack( x, y ){
    var posStr = '#card' + y + x;
    var left;
    var top;
    if(y==1){
      left = x*60+50;
      top = y*300;
    }else if(y==2){
      left = x*60+500;
      top = y*30;
    }else if(y==3){
      left = x*60+900;
      top = y*100;
    }
    $(posStr).css("height", 120);
    $(posStr).css("left", left);
    $(posStr).css("top", top);
    $(posStr).css("visibility","visible");
  }

  /* メッセージを表示する */
  function displayMessage(str){
    var returnmessage;
    text = document.getElementById("message");
    returnmessage = str+'\n'+text.textContent;
    $("#message").text(returnmessage);
  }

  /* 順位を表示する */
  function displayRank(y){
    if(y!=0){
    displayMessage("コンピューター"+y+"が上がりました");
  }
  }

  /* 順位を非表示にする */
  function nodisplayRank( y ){
    $("#rank"+y).text("");
  }

  /* 開始ボタン無効化 */
  function disabledStart(){
    $("#start").prop("disabled", true);
    $("#start").css("visibility", "hidden");
  }

  /* 開始ボタン有効化 */
  function enabledStart(){
    $("#start").prop("disabled", false);
  }

  /* クリック */
  $("#card10").click(function(){clickCard(0,1)});
  $("#card11").click(function(){clickCard(1,1)});
  $("#card12").click(function(){clickCard(2,1)});
  $("#card13").click(function(){clickCard(3,1)});
  $("#card14").click(function(){clickCard(4,1)});
  $("#card15").click(function(){clickCard(5,1)});
  $("#card16").click(function(){clickCard(6,1)});
  $("#card17").click(function(){clickCard(7,1)});
  $("#card18").click(function(){clickCard(8,1)});
  $("#card19").click(function(){clickCard(9,1)});
  $("#card110").click(function(){clickCard(10,1)});
  $("#card111").click(function(){clickCard(11,1)});
  $("#card112").click(function(){clickCard(12,1)});
  $("#card113").click(function(){clickCard(13,1)});
  $("#card20").click(function(){clickCard(0,2)});
  $("#card21").click(function(){clickCard(1,2)});
  $("#card22").click(function(){clickCard(2,2)});
  $("#card23").click(function(){clickCard(3,2)});
  $("#card24").click(function(){clickCard(4,2)});
  $("#card25").click(function(){clickCard(5,2)});
  $("#card26").click(function(){clickCard(6,2)});
  $("#card27").click(function(){clickCard(7,2)});
  $("#card28").click(function(){clickCard(8,2)});
  $("#card29").click(function(){clickCard(9,2)});
  $("#card210").click(function(){clickCard(10,2)});
  $("#card211").click(function(){clickCard(11,2)});
  $("#card212").click(function(){clickCard(12,2)});
  $("#card213").click(function(){clickCard(13,2)});
  $("#card30").click(function(){clickCard(0,3)});
  $("#card31").click(function(){clickCard(1,3)});
  $("#card32").click(function(){clickCard(2,3)});
  $("#card33").click(function(){clickCard(3,3)});
  $("#card34").click(function(){clickCard(4,3)});
  $("#card35").click(function(){clickCard(5,3)});
  $("#card36").click(function(){clickCard(6,3)});
  $("#card37").click(function(){clickCard(7,3)});
  $("#card38").click(function(){clickCard(8,3)});
  $("#card39").click(function(){clickCard(9,3)});
  $("#card310").click(function(){clickCard(10,3)});
  $("#card311").click(function(){clickCard(11,3)});
  $("#card312").click(function(){clickCard(12,3)});
  $("#card313").click(function(){clickCard(13,3)});
});