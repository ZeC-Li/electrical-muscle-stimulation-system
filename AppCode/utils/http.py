# coding=utf-8


import json
from django.shortcuts import HttpResponse


def text_response(text, content_type="text/plain"):
    """
    普通字符串回复，不会组装成json
    """
    result = HttpResponse(text, content_type=content_type)
    return result


def success(data=None):
    """
    通常请求处理一切正常时使用此返回
    """
    result = {
        "code": 0,
        "msg": "success"
    }
    if data:
        result['data'] = data

    return HttpResponse(json.dumps(result), content_type="application/json")


def failed(code=None):
    """
    通常请求处理失败时使用此返回
    code应当为一个元组
    元祖第0个表示错误码
    元祖第1个表示错误消息
    """
    result = {
        "code": code[0],
        "msg": code[1]
    }
    return HttpResponse(json.dumps(result), content_type="application/json")
