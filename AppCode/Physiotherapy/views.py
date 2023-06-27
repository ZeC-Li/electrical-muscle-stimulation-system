from django.shortcuts import render,render_to_response
from django.http.response import HttpResponse

from Biomedical24DeviceApp.helper import get_js_api_init, send_data_to_device,GetUserInfo
from B24DMaternityExerciseApp.models import *
from configs.config import WECHAT_CONFIG

from utils import commonfun
from utils.loger import log

from datetime import timedelta,datetime,date

SEARCH_DAY_C = 7

def GetDayDataFromCache(QDate,DataRecord):
    for item in DataRecord:
        if item.MoveDate == QDate:
            return item
    return None

def GetUserOptDay(OpenID):
    curDate = date.today()
    startDate = curDate - timedelta(days=SEARCH_DAY_C)
    queryres = YC_UserOptDay.objects.filter(OpenID=OpenID, MoveDate__gt=startDate)

    resMoveCount = []
    resDataOptDate = []
    for i in range(SEARCH_DAY_C):
        searchDate = startDate + timedelta(days=(i + 1))
        searchDateSTR = searchDate.strftime('%m-%d')
        resDataOptDate.append(searchDateSTR)
        dayObj = GetDayDataFromCache(searchDate, queryres)
        if not dayObj:
            resMoveCount.append(0)
        else:
            countAll = dayObj.MoveTypeJiaoKe + dayObj.MoveTypeJiaoBu + dayObj.MoveTypePenGu \
                        + dayObj.MoveTypePanTui + dayObj.MoveTypeDianTi + dayObj.MoveTypeMaoZi \
                        + dayObj.MoveTypeDengChe
            resMoveCount.append(countAll)

    return {"OptDate": resDataOptDate, "OptData": resMoveCount}


def index(request):
    print(request)
    log.info(request)

    if request.method == "GET":
        code = request.GET.get('code')
        print(code)
        log.info(code)
        nRes,userinfo = GetUserInfo(code)
        if 1 == nRes:
            # 保存数据到数据库
            commonfun.SaveWxUserInfo(userinfo)
        elif -1 == nRes:
            userinfo = {'openid':"zhouyi"}
            # return HttpResponse("<h1>刷新无效请退出后再次进入!</h1>")
        elif 0 == nRes:
            userinfo = {'openid': "zhouyi"}
            # return HttpResponse("<h1>无法获取用户代码!</h1>")

        userData = GetUserOptDay(userinfo['openid'])

        host = request.get_host()
        path = request.get_full_path()
        full_url = r"http://%s%s" % (host, path)
        data = get_js_api_init(full_url)
        data['openid'] = userinfo['openid']
        data['origin_id'] = WECHAT_CONFIG['origin_id']
        data['device_id'] = "gh_dd58c7bef8e7_1130f476bcac759d"

        data.update(userData)
        return render_to_response("MaternityExercise/yunchancao.html", data)

    elif 'POST' == request.method:
        type = request.POST.get("type", None)
        Openid = request.POST.get("Openid", None)
        if('0' == type):
            TTypeQiangdu = request.POST.get("TTypeQiangdu", None)
            TTypeShichang = request.POST.get("TTypeShichang", None)
            TTypeCijimoshi = request.POST.get("TTypeCijimoshi", None)
            TTypeCijiboxing = request.POST.get("TTypeCijiboxing", None)

            YC_DataList.objects.create(OpenID=Openid, TTypeQiangdu=TTypeQiangdu, TTypeShichang=TTypeShichang,
                                       TTypeCijimoshi=TTypeCijimoshi, TTypeCijiboxing=TTypeCijiboxing)
            return HttpResponse("ok")

        strMoveType = request.POST.get("MoveType", None)
        MoveType = int(strMoveType)
        strTime = request.POST.get("Time", None)
        Time = int(strTime)

        NowTime = datetime.now()
        NowDay = NowTime.strftime('%Y-%m-%d')
        queryres = YC_UserOptDay.objects.filter(OpenID=Openid, MoveDate=NowDay)
        if not queryres:
            """创建一条数据"""
            UserOptRecord = YC_UserOptDay.objects.create(OpenID=Openid)
        else:
            if(1 == TType):
                queryres[0].TTypeQiangdu = queryres[0].TTypeQiangdu+1
            elif (2 == MoveType):
                queryres[0].TTypeShichang = queryres[0].TTypeShichang + 1
            elif (3 == MoveType):
                queryres[0].TTypeCijimoshi = queryres[0].TTypeCijimoshi + 1
            elif (4 == MoveType):
                queryres[0].TTypeCijiboxing = queryres[0].TTypeCijiboxing + 1

            else:
                return HttpResponse("error")

            queryres[0].save()
            UserOptRecord = queryres[0]

        YC_UserOpt.objects.create(YCData=UserOptRecord, MoveType=MoveType, MoveTime=Time)

        return HttpResponse("ok")