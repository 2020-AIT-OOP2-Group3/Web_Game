from flask import Flask, request, render_template, url_for, jsonify
import os
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

#ーーーーーーーーーーーーーーーーーーーーーーーー新規登録ーーーーーーーーーーーーーーーーーーーーーー#
@app.route('/add_account', methods=["POST"])
def add_account():

    #新規ユーザ情報の取得
    y_name = request.form.get('nickname', None)
    y_email = request.form.get('email', None)
    y_pass = request.form.get('password', None)

    #player.jsonを開き、json_dataに格納
    with open('player.json') as f:
        json_data = json.load(f)

    #新規ユーザの情報をそれぞれ変数に格納
    item = {}
    item["id"] = y_email
    item["pas"] = y_pass
    item["point"] = 0
    item["name"] = y_name
    json_data.append(item)

    #idが重複したかの確認

    #player.jsonに書き込み
    with open('player.json', 'w') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4, sort_keys=True, separators=(',', ': '))

    return jsonify({
        "status": "append completed"
    })


#ーーーーーーーーーーーーーーーーーーーーーーーーメールアドレスとパスワードの取得ーーーーーーーーーーーーーーーーーーーーーー#
@app.route('/login', methods=["GET"])
def login():

    # メールアドレスとパスワードの取得
    l_id = request.args.get("email")
    l_pas = request.args.get("password")

    print(f"login id = {l_id} , password = {l_pas}")

    with open('player.json') as f:  # jsonファイルの読み込み
        json_data = json.load(f)

    for i in json_data:
        print(i)
        if i["id"] == l_id:
            print("id O")
            if i["pas"] == l_pas:  # メールアドレスとパスワードが一致していたらログインしてゲーム画面へ
                print(f"pas O ,i:{i}")
                return render_template('menu.html',  # ゲーム画面のHTML
                                       point=i["point"],
                                       name=i["name"])
            else:
                print("pas X")
                err = "IDとパスワードが一致しません"  # IDは存在するがパスワードが合っていない場合
                return render_template('index.html',
                                       err=err)

    print("ID X")
    err = "登録されていないIDです"  # IDが見つからなかった場合
    return render_template('create_account.html',
                           err=err)


@app.route('/menu/', methods=['POST'])
def menu_POST():
    return render_template('menu.html')
  
  
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

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
