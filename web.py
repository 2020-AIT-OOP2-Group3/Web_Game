from flask import Flask, request, render_template, url_for
import os
import json

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login', methods=["GET"])
def login():

    # メールアドレスとパスワードの取得
    l_id = request.form.get("email")
    l_pas = request.form.get("password")

    print(f"login id = {l_id} , password = {l_pas}")

    with open('player.json') as f:  # jsonファイルの読み込み
        json_data = json.load(f)

    for i in json_data:
        print(i)
        if i["id"] == l_id:
            print("id O")
            if i["pas"] == l_pas:  # メールアドレスとパスワードが一致していたらログインしてゲーム画面へ
                print(f"pas O ,{i}")
                return render_template('.html',  # ゲーム画面のHTML
                                        login_id=i["id"],
                                        password=i["pas"],
                                        point=i["point"])

    return render_template('index.html')



@app.route('/create_account/')
def create_account():
    return render_template('create_account.html')


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


if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
