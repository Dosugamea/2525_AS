from time import sleep
import NicoExt,sys
id = sys.argv[1]

mail=""
password=""

try:
    NicoExt.g_video(id)
except:
    NicoExt.nico_login(user=mail,passwd=password)
    try:
        NicoExt.g_video(id)
    except:
        print("動画をダウンロードできませんでした")
        a = input(">> PAUSED <<")
        sys.exit()
try:
    NicoExt.g_comments(id)
    NicoExt.g_infos(id)
except:
    NicoExt.g_cookie(mail=mail,password=password)
    try:
        NicoExt.g_comments(id)
        NicoExt.g_infos(id)
    except:
        print("コメント/情報をダウンロードできませんでした")
        a = input(">> PAUSED <<")
        sys.exit()
print("取得は正常に終了しました")
sleep(3)
sys.exit()