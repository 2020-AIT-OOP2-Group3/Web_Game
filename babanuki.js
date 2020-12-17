$(document).ready(function(){

    var handcard;
    var fin;
    var turnPlayer;
  
    $("#start").on("click", function(){
  
      handcard = new Array();
      fin = new Array();
      for(var i=0; i<4; i++) {
        handcard[i] = new Array();
        fin[i] = 0;
        nodisplayRank(i);
      }
   
      var deck = [];
  
      for(var i=0; i<53; i++) {
        deck[i] = i;
      }
  
      shuffle(deck,150);
  
      turnPlayer = Math.floor( Math.random() * 4);
  
      idx = turnPlayer;
      for(var i=0; i<53; i++){
        handcard[idx].push(deck[i]);
        idx++;
        if(idx==4)idx=0;
      }
  
      for(var i=0; i<4; i++){
        cardChk(i);
      }
  
      dispPlayerAllCard();
  
      for(var i=1; i<4; i++){
        dispComputerAllCard(i)
      }
      exeNextPlayer();
  
      disabledStart();
    });
  
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
  
    function exeNextPlayer(){
      if (turnPlayer == 0){
        for(var i=1; i<4; i++){
          if( fin[i]==0){
            break;
          }
        }
        displayMessage("コンピューター" + (i) + "からカードを取ってください。");
      }else{
        displayMessage("コンピューター"+ (turnPlayer) +"がカードを取ります。");
        setTimeout(function(){getCardComputer();}, 1000);
      }
    }
  
  　function getCardComputer(){
      
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
  
      var getCardIdx = Math.floor( Math.random() * handcard[getIdx].length);
      
      handcard[turnPlayer].push(handcard[getIdx][getCardIdx]);
      displayBack( handcard[turnPlayer].length-1, turnPlayer);
      
      handcard[getIdx][getCardIdx]=-1;
      cardSride(getIdx);
  
      if( getIdx == 0 ){
        dispPlayerAllCard();
      }else{
        dispComputerAllCard(getIdx);
      }
      
      var ret = setRank(getIdx);
  
      if( ret == 0 ){
        displayMessage("コンピューター"+ (turnPlayer) +"がカードを捨てます。");
        setTimeout(function(){throwCardComputer();}, 1000);
      }else{
        enabledStart();
      }
    }
  
    
  　function throwCardComputer(){
  
      cardChk(turnPlayer);
  
      if ( handcard[turnPlayer].length != 0 ){
        shuffle(handcard[turnPlayer], 10);
      }
  
      dispComputerAllCard(turnPlayer);
  
      
      var ret = setRank(turnPlayer);
  
      if( ret == 0 ){
       
        decideNextPlayer();
        exeNextPlayer();
      }else{
        enabledStart();
      }
    }
  
    
    function throwCardPlayer(){
      cardChk(0);
  
      dispPlayerAllCard();
  
      
      var ret = setRank(turnPlayer);
      if( ret == 0 ){
        decideNextPlayer();
        exeNextPlayer();
      }else{
        enabledStart();
      }
    }
  
    
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
  
      
      handcard[0].push(handcard[y][x]);
      if(handcard[y][x]!=52){
        display( handcard[0].length-1, 0, handcard[y][x]);
      }else{
        displayJoker(handcard[0].length-1,0);
      }
  
      
      handcard[y][x]=-1;
      nodisplay( handcard[y].length-1, y);
      cardSride(y);
  
      
      setRank(y);
  
      throwCardPlayer();
    }
  
    
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
  
    
    function cardChk(idx){
      var arr = handcard[idx];
      var num = arr.length;
      for( var i=0; i<num-1; i++ ){
        if( arr[i]!=-1 && arr[i] != 52){
          for( var j=i+1; j<num; j++){
            if( arr[j]!=-1 && arr[j] != 52){
              if( arr[i]%13 == arr[j]%13 ){
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
  
    
    function dispPlayerAllCard(){
  
      
      for( var i=0; i < handcard[0].length; i++){
        if (handcard[0][i]!=52){
          display(i,0,handcard[0][i]);
        } else{
          displayJoker(i,0);
        }
      }
  
      
      for( var j=i; j<13; j++){
        nodisplay(j,0);
      }
    }
  
    
    function dispComputerAllCard(idx){
  
      
      for( var i=0; i < handcard[idx].length; i++){
        displayBack(i,idx);
      }
  
      
      for( var j=i; j<13; j++){
        nodisplay(j,idx);
      }
    }
  
    
    function setRank(idx){
      if( handcard[idx].length == 0 ){
        var rank = 1;
        for( var i=0; i<4; i++ ){
          if( fin[i] == 1 ){
            rank++;
          }
        }
        fin[idx] = 1;
  
        
        if( idx == 0 ){
          alert(rank + "位です！");
          displayRank( idx, rank );
          return 1;
        }else{
          if( rank == 3 ){
           
            alert("4位です！");
            displayRank( idx, rank );
            displayRank( 0, 4 );
            return 1;
          }else{
            
            displayRank( idx, rank );
            return 0;
          }
        }
      }
      return 0;
    }
  
    
    function nodisplay(x, y){
      var posStr = '#card' + y + x;
      $(posStr).css("visibility","hidden");
    }
  
    
    function display(x, y, num){
      var posStr = '#card' + y + x;
      var left;
      var top;
      var rect;
  
      if (num%13 <= 6){
        left = 200 + x*50 - Math.floor(num/13)*50;
        top = 150 + y*100 - num%13*75;
        rect = 'rect(' + ((num%13)*75) + 'px ' + (((Math.floor(num/13)+1)*50)+1) + 'px ' + ((num%13+1)*75+1) + 'px ' + (Math.floor(num/13)*50) + 'px)';
      }else{
        left = 200 + x*50 - Math.floor(num/13)*50 - 200;
        top = 150 + y*100 - (num%13-7)*75;
        rect = 'rect(' + ((num%13-7)*75) + 'px ' + ((Math.floor(num/13)+1)*50+200) + 'px ' + ((num%13-6)*75+1) + 'px ' + (Math.floor(num/13)*50+200) + 'px)';
      }
      $(posStr).css("left", left);
      $(posStr).css("top", top);
      $(posStr).css("clip", rect);
      $(posStr).css("visibility","visible");
    }
  
    
    function displayJoker( x, y ){
      var posStr = '#card' + y + x;
      var left = x*50;
      var top = y*100 - 300;
      var rect = 'rect( 450px 251px 526px 200px)';
      $(posStr).css("left", left);
      $(posStr).css("top", top);
      $(posStr).css("clip", rect);
      $(posStr).css("visibility","visible");
    }
  
   
    function displayBack( x, y ){
      var posStr = '#card' + y + x;
      var left = x*50 - 100;
      var top = y*100 - 300;
      var rect = 'rect( 450px 351px 526px 300px)';
      $(posStr).css("left", left);
      $(posStr).css("top", top);
      $(posStr).css("clip", rect);
      $(posStr).css("visibility","visible");
    }
  
    
    function displayMessage(str){
      $("#message").text(str);
    }
  
    
    function displayRank( y, rank){
      $("#rank"+y).text(rank+"位");
    }
  
    
    function nodisplayRank( y ){
      $("#rank"+y).text("");
    }
  
    
    function disabledStart(){
      $("#start").prop("disabled", true);
    }
  
    
    function enabledStart(){
      $("#start").prop("disabled", false);
    }
  
  
    
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
  