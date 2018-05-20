from time import sleep
import NicoExt,sys,os
id = sys.argv[1]

mail="PUT_YOUR_MAIL_ADDRESS"
password="PUT_YOUR_PASSWORD"

if not os.path.exists(id):
    os.makedirs(id)

try:
    NicoExt.g_video(id,"./"+id+"/")
except:
    NicoExt.nico_login(user=mail,passwd=password)
    try:
        NicoExt.g_video(id,"./"+id+"/")
    except:
        print("動画をダウンロードできませんでした")
        a = input(">> PAUSED <<")
        sys.exit()
try:
    NicoExt.g_comments(id,"./"+id+"/")
    NicoExt.g_infos(id,"./"+id+"/")
except:
    NicoExt.g_cookie(mail=mail,password=password)
    try:
        NicoExt.g_comments(id,"./"+id+"/")
        NicoExt.g_infos(id,"./"+id+"/")
    except:
        print("コメント/情報をダウンロードできませんでした")
        a = input(">> PAUSED <<")
        sys.exit()
print("取得は正常に終了しました")
sleep(3)