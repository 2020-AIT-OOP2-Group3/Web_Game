from flask import Flask, request, render_template, url_for, jsonify,session
import os
import json

app = Flask(__name__)
app.secret_key = 'd!kaHIQo8RE1Eb4a2ari'

global jsonnum  # jsonファイル上でのアカウントの位置情報保存用のグローバル変数

@app.route('/')
def index():
    return render_template('index.html')

#ーーーーーーーーーーーーーーーーーーーーーーーー新規登録ーーーーーーーーーーーーーーーーーーーーーー#


@app.route('/add_account', methods=["POST"])
def add_account():

    # 新規ユーザ情報の取得
    y_name = request.form.get('nickname', None)
    y_email = request.form.get('email', None)
    y_pass = request.form.get('password', None)

    # player.jsonを開き、json_dataに格納
    with open('player.json') as f:
        json_data = json.load(f)

    # 新規ユーザの情報をそれぞれ変数に格納
    item = {}
    item["id"] = y_email
    item["pas"] = y_pass
    item["point"] = 0
    item["name"] = y_name

    # idが重複したかの確認
    for i in json_data:
        if  i["id"] == y_email:  #一致するIDがあった場合
            err = "すでに登録されたIDです"  
            return render_template('create_account.html',
                                    err = err
                                    )

    #一致するIDが無かった場合
    #player.jsonに書き込み
    with open('player.json', 'w') as f:
        json_data.append(item)
        json.dump(json_data, f, ensure_ascii=False, indent=4, sort_keys=True, separators=(',', ': '))


    return render_template('menu.html', # ゲーム画面のHTML
                            point=item["point"],
                            name=item["name"])

#ーーーーーーーーーーーーーーーーーーーーーーーーメールアドレスとパスワードの取得ーーーーーーーーーーーーーーーーーーーーーー#


@app.route('/login', methods=["GET"])
def login():

    # メールアドレスとパスワードの取得
    l_id = request.args.get("email")
    l_pas = request.args.get("password")

    print(f"login id = {l_id} , password = {l_pas}")

    with open('player.json') as f:  # jsonファイルの読み込み
        json_data = json.load(f)

    global jsonnum
    jsonnum = 0

    for i in json_data:
        print(jsonnum)
        print(i)
        if i["id"] == l_id:
            print("id O")
            if i["pas"] == l_pas:  # メールアドレスとパスワードが一致していたらログインしてゲーム画面へ

                #ログイン時にユーザーのID、名前、パスワード、ポイント数をクライアント側(ブラウザ上)に保存
                
                session["id"] = i["id"]
                session["pas"] = i["pas"]
                session["name"] = i["name"]
                session["point"] = i["point"]

                print(f"pas O ,account:{session}")
                return render_template('menu.html',  # ゲーム画面のHTML
                                       point=i["point"],
                                       name=i["name"])
            else:
                print("pas X")
                err = "IDとパスワードが一致しません"  # IDは存在するがパスワードが合っていない場合
                return render_template('index.html',
                                       err=err)
        jsonnum += 1

    print("ID X")
    err = "登録されていないIDです"  # IDが見つからなかった場合
    return render_template('create_account.html',
                           err=err)


@app.route('/menu/', methods=['POST'])
def menu_POST():
    return render_template('menu.html')


@app.route('/menu/', methods=['GET'])
def menu_GET():
    return render_template('menu.html',  # ゲーム画面のHTML
                                       point=session["point"],
                                       name=session["name"])

@app.route('/babanuki')
def babanuki():
    return render_template('babanuki.html')


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route('/create_account')
def create_account():
    return render_template('create_account.html')

#ーーーーーーーーーーーーーーーーーーーーーーーーじゃんけん脳トレーーーーーーーーーーーーーーーーーーーーーー#
# じゃんけん脳トレ -スタートページ-
@app.route('/janken/start/', methods=["GET"])
def janken_start():
    return render_template('janken_notore/janken_start.html')

# じゃんけん脳トレ -プレイページ-
@app.route('/janken/play/')
def janken_play():
    return render_template('janken_notore/janken_play.html')

# じゃんけん脳トレ -結果ページ-
@app.route('/janken/result/', methods=["POST"])
def janken_result():

    global jsonnum  # グローバル変数の読み込み

    #合ってた回数を取得
    OK_times = request.form.get('OK_times')
    OK_times = int(OK_times)
    #間違ってた回数を取得
    NG_times = request.form.get("NG_times")
    NG_times = int(NG_times)

    #現在のポイント数を取得
    
    point = session["point"]
    point=int(point)

    get_point = 0  # 変数の宣言

    #-獲得ポイント算出-
    #間違ってた回数が10回以上　or (正解した回数 - 間違ってた回数)が0回以下
    if NG_times >= 10 or (OK_times - NG_times) <= 0:
        get_point = 0
    #(正解した回数 - 間違ってた回数)が20回を下回る
    elif (OK_times - NG_times) < 20:
        get_point = (OK_times - NG_times) * 0.3
    #(正解した回数 - 間違ってた回数)が20回以上
    elif (OK_times - NG_times) >= 20:
        get_point = 6 + 1*(OK_times - NG_times -20)
    #獲得ポイントを四捨五入
    print(get_point)
    get_point = int(round(get_point))
    print(get_point)
    #反映後の現在のポイント数
    point = point + get_point

    session["point"] = point

    #ここで、JSONデータに現在のポイントを保存する処理(JSON担当の方お願いします)
    with open('player.json') as f:  # jsonファイルの読み込み
        json_data = json.load(f)

    print(f"before : {json_data[jsonnum]}")

    i = {}
    i["id"] = session["id"]
    i["pas"] = session["pas"]
    i["name"] = session["name"]
    i["point"] = session["point"]

    json_data[jsonnum] = i  # jsonファイルのアカウント情報を書き換え

    print(f"after : {json_data[jsonnum]}")

    with open('player.json', 'w') as f:  # jsonファイルに書き込んで上書き保存
        json.dump(json_data, f, ensure_ascii=False, indent=4, sort_keys=True, separators=(',', ': '))

    return render_template('janken_notore/janken_result.html',OK_times=OK_times,NG_times=NG_times,point=point,get_point=get_point)

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
