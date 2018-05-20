from subprocess import Popen, CREATE_NEW_CONSOLE
from bottle import route, run,HTTPResponse,request, static_file
from datetime import datetime
import json,glob,os,math

#バイトからファイルサイズ表記に変える
def roundstr(size):
    return str(round(size, 1))
def filesize(bytesize):
    if bytesize < 1024:
        return str(bytesize) + ' B'
    elif bytesize < 1024 ** 2:
        return roundstr(bytesize / 1024.0) + ' KB'
    elif bytesize < 1024 ** 3:
        return roundstr(bytesize / (1024.0 ** 2)) + ' MB'
    elif bytesize < 1024 ** 4:
        return roundstr(bytesize / (1024.0 ** 3)) + ' GB'
    elif bytesize < 1024 ** 5:
        return roundstr(bytesize / (1024.0 ** 4)) + ' TB'
    else:
        return str(bytesize) + ' B'
def check_exist(file_name):
    files = []
    for e in ('*.flv','*.mp4'):
        files.extend(glob.glob(e))
    for f in files:
        if file_name in f and ".mp4" in f\
        or file_name in f and ".flv" in f:
            return f
    return False
def js_resp(jsdata):
    r = HTTPResponse(status=200, body=json.dumps(jsdata))
    r.set_header('Content-Type', 'application/json')
    r.set_header('Access-Control-Allow-Origin','*')
    return r

#ダウンロードを開始する(URLをPOSTする)
# (別プロセスで開始する
@route('/add',method='GET')
def start_download():
    try:
        url = request.query['url']
        id = url[url.find("watch/")+6:]
        if (id.isdigit() and len(id) < 9)\
        or "sm" in id or "so" in id:
            if check_exist(id) == False:
                Popen('python download.py %s'%(id), creationflags=CREATE_NEW_CONSOLE)
                return js_resp({"Message":"OK"})
            else:
                return js_resp({"Message":"Already Exist"})
        else:
            return js_resp({"Message":"Not MovieID"})
    except:
        return js_resp({"Message":"Not URL"})

#ダウンロード済みであるかどうかをURLから調べる(URLをPOSTする)
# (ダウンロード済みなら Found でなければ NotFoundを返す
@route('/check',method="GET")
def check_download():
    try:
        url = request.query['url']
        file_name = url[url.find("watch/")+6:]
        if check_exist(file_name) == False:
            return js_resp({"Message":"NotExist"})
        else:
            return js_resp({"Message":"Exist"})
    except:
        return js_resp({"Message":"Not URL"})

#ダウンロード状態のリストをJSONで返す
#(flv/mp4 を先にダウンロードして
# comments.xmlを後にすれば一応動作する)
@route('/list',method='GET')
def list_download():
    files = glob.glob("*.xml")
    videos = []
    for e in ('*.flv','*.mp4'):
        videos.extend(glob.glob(e))
    retd = []
    for v in videos:
        d = {"Name":"","Stat":"Downloading","Size":"","Date":""}
        d["Name"] = v.replace(".mp4","").replace(".flv","")
        id = d["Name"][:d["Name"].find("_")]
        for f in files:
            if id in f and "xml" in f:
                d["Stat"] = "Complete"
                break
        d["Date"] = datetime.fromtimestamp(os.path.getctime(v)).strftime('%Y-%m-%d %H:%M:%S')
        d["Size"] = filesize(os.path.getsize(v))
        retd.append(d)
    return js_resp(retd)

#動画を直接再生する(サーバーにエラーが湧きまくるが一応動くと思われる)
@route("/play",method="GET")
def play():
    url = request.query['url']
    file_name = url[url.find("watch/")+6:]
    file = check_exist(file_name)
    if file == False:
        return js_resp({"Message":"NotExists"})
    else:
        return static_file(file,root='.')

run(host='localhost', port=8080, debug=True)