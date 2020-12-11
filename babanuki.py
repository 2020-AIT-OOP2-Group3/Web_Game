import random

#カードを分配する関数
def dist(num):
    player_tehuda = [[] for i in range(num)]
    while len(cards) != 0:
        for i in range(player_num):
            if len(cards) != 0:
                choice = random.choice(cards)
                player_tehuda[i].append(choice)
                cards.remove(choice)
    print("#カードを分配する")
    print("\n【カード分配時の手札】")
    for i in range(num):
        print("　{}の手札は{}".format(name[i],player_tehuda[i]))
    print("\n#揃っているカードを捨てる")
    return player_tehuda

#カードの番号だけ抜き出す関数
def card_num(card):
    if len(card) == 3:
        return int(card[2])
    elif len(card) == 4:
        return int(card[2:4])

#配られた手札の同じカードを消す関数
def del_tehuda(num):
    #被り計算用手札を用意
    kaburi_tehuda =[[0 for i in range(14)] for j in range(num)]
    #ゲーム用手札を用意
    temp_tehuda = [[[] for i in range(14)] for j in range(num)]

    #被りを数え上げて消す
    for i in range(num):
        for j in range(len(player_tehuda[i])):
            #被りを数え上げ
            player_card_num = card_num(player_tehuda[i][j])
            kaburi_tehuda[i][player_card_num] = kaburi_tehuda[i][player_card_num] + 1
            if  kaburi_tehuda[i][player_card_num] == 1 or kaburi_tehuda[i][player_card_num] == 3:
                temp_tehuda[i][player_card_num].append(player_tehuda[i][j])
             #被っていたら中身を空にする
            elif  kaburi_tehuda[i][player_card_num] == 2 or kaburi_tehuda[i][player_card_num] == 4:
                temp_tehuda[i][player_card_num] = []
    #操作しやすい形に変更
    player_game_tehuda = [[] for i in range(len(temp_tehuda))]
    for i in range(len(temp_tehuda)):
        for j in range(len(temp_tehuda[i])):
            if temp_tehuda[i][j] != []:
                player_game_tehuda[i].append(temp_tehuda[i][j][0])
    #この時点で上がりのプレイヤーがいるか確認
    player_game_tehuda=start_clear(player_game_tehuda)
    print("\n【ゲーム開始時の手札】")
    for i in range(len(player_game_tehuda)):
        print("　{}の手札は{}".format(name[i],player_game_tehuda[i]))

    return player_game_tehuda

#ゲーム開始時点で上がりのプレイヤーを確認する関数
def start_clear(tehuda):
    keep = True
    while keep:
        if [] in tehuda:
            keep = True
        else:
            keep = False
        for i in range(len(tehuda)):
            if tehuda[i] == []:
                tehuda.pop(i)
                name.pop(i)
                break
    return tehuda

#ゲームスタート後に手札のカードの被りを確認する関数
def check_card(player_tehuda,choice):
    #被っていない場合はありえない数値を返して処理から外す
    no_kaburi = 100
    for i in range(len(player_tehuda)):
        if card_num(choice) == card_num(player_tehuda[i]) and choice != player_tehuda[i]:
            return i
        else:
            pass
    return no_kaburi

#引いたおよび引かれたプレイヤーの手札の枚数が0枚かどうか判定する関数
def count_card(player1_tehuda,player2_tehuda):
    if len(player1_tehuda) == len(player2_tehuda) == 0:
        return 1
    elif len(player1_tehuda) == 0 and len(player2_tehuda) != 0:
        return 2
    elif len(player1_tehuda) != 0 and len(player2_tehuda) == 0:
        return 3
    elif len(player1_tehuda) != 0 and len(player2_tehuda) != 0:
        return 0

#プレイヤーをソートする関数
def sort_player(tehuda,player_num1,player_num2,name):
    member_length = len(tehuda)
    no_agari = 100
    #二人同時に上がったとき
    if player_num2 == player_num1 + 1 or (player_num2 == len(tehuda)-1 and player_num1 == 0) :
        #引かれたプレイヤーが配列の最後の場合
        if player_num2 == member_length-1:
            tehuda = tehuda[0:len(tehuda)-2]
            name = name[0:len(tehuda)-2]
        #引いたプレイヤーが配列の先頭の場合
        elif player_num1 == 0:
            #先頭を消した配列に対して、さらに先頭を消すために2回pop
            tehuda.pop(0)
            tehuda.pop(0)
            name.pop(0)
            name.pop(0)
        #それ以外の場合
        else:
            #上がったプレイヤーを除く
            temp1 = tehuda[player_num1+2::]
            temp2 = tehuda[0:player_num1]
            tehuda = temp1 + temp2
            temp3 = name[player_num1+2::]
            temp4 = name[0:player_num1]
            name = temp3 + temp4
    #引いたプレイヤーが上がったとき
    elif player_num2 == no_agari:
        #引いたプレイヤーが配列の先頭の場合
        if player_num1 == 0:
            tehuda.pop(0)
            name.pop(0)
        #それ以外の場合
        else:
            temp1 = tehuda[player_num1+1::]
            temp2 = tehuda[0:player_num1]
            tehuda = temp1 + temp2
            temp3 = name[player_num1+1::]
            temp4 = name[0:player_num1]
            name = temp3 + temp4
    #引かれたプレイヤーが上がったとき
    elif player_num1 == no_agari:
        #引かれたプレイヤーが配列の最後の場合
        if player_num2 == member_length - 1:
            tehuda.pop(player_num2)
            name.pop(player_num2)
        #それ以外の場合
        else:
            temp1 = tehuda[player_num2+1::]
            temp2 = tehuda[0:player_num2]
            tehuda = temp1 + temp2
            temp3 = name[player_num2+1::]
            temp4 = name[0:player_num2]
            name = temp3 + temp4
    return tehuda,name

#終了条件関数
def game_fin(tehuda):
    keep = True
    if len(tehuda) == 1:
        keep = False
    return keep

#ゲームスタート
def game_start(tehuda,name,turn):
    #上がっていない場合ありえない数値を渡して処理から除外
    no_agari = 100
    no_kaburi = 100
    #カードを引く部分
    for i in range(len(tehuda)):
        tmp=name[i]
        if tmp == "あなた":
            print("カードを引いてください")
            key=input()
           
        turn = turn + 1
        if i < len(tehuda) - 1:
            choice = random.choice(tehuda[i+1])
            tehuda[i].append(choice)
            tehuda[i+1].remove(choice)
            check = check_card(tehuda[i],choice)
            print("　{}は{}から{}を引きました".format(name[i],name[i+1],choice))
            #カードがかぶっている場合
            if check != no_kaburi:
                temp = tehuda[i][check]
                tehuda[i].remove(tehuda[i][check])
                tehuda[i].remove(choice)
                print("　{}は{}と{}が揃いました".format(name[i],temp,choice))

            #引いたプレイヤーと引かれたプレイヤーの手札の枚数を確認
            game_clear = count_card(tehuda[i],tehuda[i+1])
            #どちらも上がらない
            if game_clear == 0:
                pass
            #どちらも上がる
            elif game_clear == 1:
                temp1 = tehuda[i]
                temp2 = tehuda[i+1]
                print("　{}と{}は上がりました".format(name[i],name[i+1]))
                make_rank([name[i],name[i+1]])
                tehuda,name = sort_player(tehuda,i,i+1,name)
                break
            #引いたプレイヤーのみ上がり
            elif game_clear == 2:
                print("　{}は上がりました".format(name[i]))
                make_rank([name[i]])
                tehuda,name = sort_player(tehuda,i,no_agari,name)
                break
            #引かれたプレイヤーのみ上がり
            elif game_clear == 3:
                print("　{}は上がりました".format(name[i+1]))
                make_rank([name[i+1]])
                tehuda,name = sort_player(tehuda,no_agari,i+1,name)
                break

        elif i == len(tehuda) - 1:
            choice = random.choice(tehuda[0])
            tehuda[i].append(choice)
            tehuda[0].remove(choice)
            check = check_card(tehuda[i],choice)
            print("　{}は{}を引きました".format(name[i],choice))
            #カードのかぶりを確認
            if check != no_kaburi:
                temp = tehuda[i][check]
                tehuda[i].remove(tehuda[i][check])
                tehuda[i].remove(choice)
                print("　{}は{}と{}が揃いました".format(name[i],temp,choice))
            #手札の枚数を確認
            game_clear = count_card(tehuda[i],tehuda[0])
            if game_clear == 0:
                pass
            elif game_clear == 1:
                temp1 = tehuda[i]
                temp2 = tehuda[0]
                print("　{}と{}は上がりました".format(name[i],name[0]))
                make_rank([name[i],name[i+1]])
                tehuda,name = sort_player(tehuda,i,0,name)
                break
            elif game_clear == 2:
                print("　{}は上がりました".format(name[i]))
                make_rank([name[i]])
                tehuda,name = sort_player(tehuda,i,no_agari,name)
                break
            elif game_clear == 3:
                print("　{}は上がりました".format(name[0]))
                make_rank([name[0]])
                tehuda,name = sort_player(tehuda,no_agari,0,name)
                break
    print("")
    print("【各プレイヤーの手札】")
    for i in range(len(tehuda)):
        print("　{} >>手札 {}".format(name[i],tehuda[i]))

    return tehuda,name, turn

def make_rank(agari):
    rank.append(agari)

if __name__ in '__main__':
    pts = 0
#カード作成
    type = ["h","s","k","d"]
    cards = []
    joker = "j-0"
    for i in range(1,14,1):
     for j in range(len(type)):
            cards.append(type[j]+"-"+str(i))
    cards.append("j-0")

    player_num = 4
    #プレイヤーの名前作成
    name = []
    name.append("あなた")
    for i in range(player_num-1):
        name.append("CPU"+str(i+1))

    #カードを分配
    player_tehuda = dist(player_num)
    #カードのかぶりを確認
    player_game_tehuda = del_tehuda(player_num)
    #ババ抜きループ開始
    keep = True
    tehuda = player_game_tehuda
    turn = 1
    print("\n#ババ抜きスタート")
    rank = []
    while keep:
        tehuda,name,turn = game_start(tehuda,name,turn)
        keep = game_fin(tehuda)
        if keep==True:
            keep ="あなた"in name
    make_rank([name[0]])

    #最終ランキング表示
    print("\n☆☆☆☆最終結果☆☆☆☆")
    for i in range(len(rank)):
        if len(rank[i]) != 1:
            rank_str = ",".join(rank[i])
        else:
            rank_str = "".join(rank[i])
        print("{}位 : {}".format(i+1,rank_str))

        if "あなた"in rank[i]:
            print("あなたは{}位です".format(i+1))
            if i==0:
                pts=20
            elif i==1:
                pts=10
            elif i==2:
                pts=5
            else:
                pts=0
            break

    print("{}pts獲得しました".format(pts))