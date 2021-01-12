// データの初期表示
fetch("/ranking/get/").then(response => {
    console.log(response);
    response.json().then((data) => {
        console.log(data);  // 取得されたレスポンスデータをデバッグ表示
        // データを表示させる
        const tableBody = document.querySelector("#player-list > tbody");
        data.forEach(elm => {
            // 1行づつ処理を行う

            console.log(elm);

            let tr = document.createElement('tr');
            // rank
            let td = document.createElement('td');
            td.innerText = elm.rank;
            tr.appendChild(td);
            // name
            td = document.createElement('td');
            td.innerText = elm.name;
            tr.appendChild(td);
            // point
            td = document.createElement('td');
            td.innerText = elm.point;
            tr.appendChild(td);

            var tmpname = elm.name
            var username = document.getElementById('name').textContent
            if(tmpname ==username){
                console.log("tmp=user")
                tr.style.background = "lavender"
            }

            console.log(tr);

            // 1行分をtableタグ内のtbodyへ追加する
            tableBody.appendChild(tr);
        });
    });
});
