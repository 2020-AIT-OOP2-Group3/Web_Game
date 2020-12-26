from flask import Flask, request, render_template, url_for, jsonify, session, Markup
import os
import json

app = Flask(__name__)
app.secret_key = 'd!kaHIQo8RE1Eb4a2ari'

global jsonnum  # jsonファイル上でのアカウントの位置情報保存用のグローバル変数


@app.route('/')
def index():
    return render_template('index.html')

#ーーーーーーーーーーーーーーーーーーーーーーーー登録確認ーーーーーーーーーーーーーーーーーーーーーー#


@app.route('/confirm_account', methods=["POST"])
def confirm_account():

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
        if i["id"] == y_email:  # 一致するIDがあった場合
            err = "すでに登録されたIDです"
            return render_template('create_account.html',
                                   err=err
                                   )

    # 一致するIDが無かった場合
    # 確認画面へ移動

    id_input = '<input type="hidden" name="nickname" value="' + \
        item["id"] + '"></input>'
    pas_input = '<input type="hidden" name="email" value="' + \
        item["pas"] + '"></input>'
    name_input = '<input type="hidden" name="password" value="' + \
        item["name"] + '"></input>'

    return render_template('confirm_account.html',
                           id=item["id"], pas=item["pas"], name=item["name"],
                           id_input=Markup(id_input), pas_input=Markup(pas_input), name_input=Markup(name_input))

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
        if i["id"] == y_email:  # 一致するIDがあった場合
            err = "すでに登録されたIDです"
            return render_template('create_account.html',
                                   err=err
                                   )

    #一致するIDが無かった場合
    #player.jsonに書き込み
    global jsonnum
    jsonnum = len(json_data)  # 新規登録したアカウントのjsonファイルでの位置を変数に保存
    with open('player.json', 'w') as f:
        json_data.append(item)
        json.dump(json_data, f, ensure_ascii=False, indent=4,
                  sort_keys=True, separators=(',', ': '))

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

                # ログイン時にユーザーのID、名前、パスワード、ポイント数をクライアント側(ブラウザ上)に保存

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

#ーーーーーーーーーーーーーーーーーーーーーーーーランキングーーーーーーーーーーーーーーーーーーーーーー#


@app.route('/ranking/')
def ranking():
    with open('player.json') as f:  # jsonファイルの読み込み
        json_data = json.load(f)

    rank_data = sorted(json_data, key=lambda x:x["point"], reverse=True)  # ポイントが高い順に並べ替えたリストを作る

    num = 0
    for i in rank_data:
        if(session["name"] == i["name"]):
            break
        num += 1

    rank = num

    count = 0
    for i in rank_data:
        del rank_data[count]["id"], rank_data[count]["pas"]
        rank_data[count]["rank"] = count+1
        count += 1

    print("rank sorted")

    with open('ranking.json', 'w') as f:  # jsonファイルに書き込んで上書き保存
        json.dump(rank_data, f, ensure_ascii=False, indent=3,
                  sort_keys=True, separators=(',', ': '))


    return render_template('ranking.html',
                            name=session["name"],
                            point=session["point"],
                            rank=rank)


@app.route('/ranking/get/')
def ranking_get():
    with open('ranking.json') as f:  # jsonファイルの読み込み
        rank_data = json.load(f)

    return jsonify(rank_data)
    

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

@app.route('/babanuki/result/', methods=["POST"])
def babanuki_result():
    global jsonnum  # グローバル変数の読み込み

    rank0 = request.form.get('rank0')
    rank0 = int(rank0)
    print(rank0)
    print(type(rank0))
    #現在のポイント数を取得
    point = session["point"]
    point=int(point)

    get_point = 0  # 変数の宣言

    if rank0==1:
        get_point = 20
    elif rank0==2:
        get_point = 10
    elif rank0==3:
        get_point = 5
    
    print(get_point)
    #反映後の現在のポイント数
    point = point + get_point

    session["point"] = point

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

    return render_template('babanuki_result.html',rank0=rank0,point=point,get_point=get_point)


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

#ーーーーーーーーーーーーーーーーーーーーーーーー脳トレーーーーーーーーーーーーーーーーーーーーーー#
#  脳トレ -脳トレメニュー-
@app.route('/notore_menu', methods=["GET"])
def notore_menu():
    return render_template('notore_menu.html')

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

    # 合ってた回数を取得
    OK_times = request.form.get('OK_times')
    OK_times = int(OK_times)
    # 間違ってた回数を取得
    NG_times = request.form.get("NG_times")
    NG_times = int(NG_times)

    # 現在のポイント数を取得
    point = session["point"]
    point = int(point)

    get_point = 0  # 変数の宣言

    # -獲得ポイント算出-
    # 間違ってた回数が10回以上　or (正解した回数 - 間違ってた回数)が0回以下
    if NG_times >= 10 or (OK_times - NG_times) <= 0:
        get_point = 0
    # (正解した回数 - 間違ってた回数)が20回を下回る
    elif (OK_times - NG_times) < 20:
        get_point = (OK_times - NG_times) * 0.3
    # (正解した回数 - 間違ってた回数)が20回以上
    elif (OK_times - NG_times) >= 20:
        get_point = 6 + 1*(OK_times - NG_times - 20)
    # 獲得ポイントを四捨五入
    print(get_point)
    get_point = int(round(get_point))
    print(get_point)
    # 反映後の現在のポイント数
    point = point + get_point

    session["point"] = point

    # ここで、JSONデータに現在のポイントを保存する処理(JSON担当の方お願いします)
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
        json.dump(json_data, f, ensure_ascii=False, indent=4,
                  sort_keys=True, separators=(',', ': '))

    return render_template('janken_notore/janken_result.html', OK_times=OK_times, NG_times=NG_times, point=point, get_point=get_point)

#ーーーーーーーーーーーーーーーーーーーーーーーーパズル脳トレーーーーーーーーーーーーーーーーーーーーーー#
# パズル脳トレ -スタートページ-
@app.route('/puzzle/start/', methods=["GET"])
def puzzle_start():
    return render_template('puzzle_notore/puzzle_start.html')

# パズル脳トレ -プレイページ-
@app.route('/puzzle/play3_3/')
def puzzle_play():
    return render_template('puzzle_notore/puzzle_play3_3.html')

# じゃんけん脳トレ -結果ページ-
@app.route('/puzzle/result/', methods=["POST"])
def puzzle_result():
    #完成か未完成かを取得
    completeORincomplete = request.form.get('completeORincomplete')

    #プレイしたゲームのレベルを取得
    level = request.form.get('level')

    #現在のポイント数を取得
    point = session["point"]
    point=int(point)

    get_point = 0  # 変数の宣言
    level_name = "" #レベル名の宣言
    #-獲得ポイント算出-
    if completeORincomplete == "complete":
        message = "完成"
        if level == "elementary":
            level_name = "初級"
            get_point = 2
        elif level == "intermediate":
            level_name = "中級"
            get_point = 5
        elif level == "advanced":
            level_name = "上級"
            get_point = 20
    else:
        if level == "elementary":
            level_name = "初級"
        elif level == "intermediate":
            level_name = "中級"
        elif level == "advanced":
            level_name = "上級"
        message = "未完成"
        get_point = 0
    #獲得ポイントを四捨五入
    print(get_point)
    get_point = int(round(get_point))
    print(get_point)
    #反映後の現在のポイント数
    point = point + get_point

    session["point"] = point

    return render_template('puzzle_notore/puzzle_result.html',get_point=get_point,userName=session["name"],point=point,message=message,level_name=level_name)

if __name__ == '__main__':
    app.run(host="localhost", port=8080, debug=True)
