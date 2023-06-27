from Biomedical24App.models import CWXUserInfo

def SaveWxUserInfo(dicUserInfo):
    strOpenId = dicUserInfo["openid"]
    if not strOpenId:
        return False
    print("OpenID[%s]"%strOpenId)
    queryres = CWXUserInfo.objects.filter(openid=strOpenId)
    print("开始插入数据[%r]"%dicUserInfo)
    if not queryres:
        """创建一条数据"""
        CWXUserInfo.objects.create(**dicUserInfo)

    return True