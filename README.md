# Web_Game
## アプリ内容
- ポイント制Webゲーム
  - 新規登録（またはログイン）をし、初期持ちポイントをうけとる。ID・パスワード入力が必要とする。
  - それぞれ、ゲームを行いポイントを集める。ゲームをやるごとに賭け金としてポイントを支払う。
  - クイズゲーム… ジャンルとしては脳トレ 
  - ババ抜きゲーム… ３人CPUとプレイヤーで４人対戦

## 作業分担
### ホームページ(志村くん）
- ログイン画面
- 新規登録画面
  - ゲーム選択画面
    - クイズゲーム画面
    - ババ抜きゲーム画面
    - 持ちポイント表示する画面  
### データ管理(篠原くん・山口くん）
- Dict型（辞書型）でID・パスワード・ポイントを保持する
- 初期ポイントは5０pts。
- ポイント
  - ゲームに参加費として毎１０pstを支払う。
  - クイズゲームでは、正解した問題は20ptsとしてポイントが増える。不正解した場合は、ゼロになる。
  - ババ抜きゲームでは、１位の場合は20pts。２位の場合は10ptsと、支払ったポイントを払い戻す。３位の場合は、5ptsを払い戻す。４位の
### クイズゲーム(森永さん）
- ジャンルは脳トレのクイズ(２こ）


### ババ抜きゲーム（桑原くん)
- ３人CPUとプレイヤーで４人対戦　

## 参考になるWebサイト
[https://qiita.com/Umemiya/items/5caefcf4f6a38ab68be1][カードのライブラリ]


