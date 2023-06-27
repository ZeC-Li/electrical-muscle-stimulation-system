# coding=utf-8

"""
装饰器文件
"""


from utils.loger import log


def log_exception(func):
    """
    用于包装函数，若有异常则输出到日志
    """
    def temp(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            log.exception(e)
    return temp


def single_class(cls):
    """
    单例类装饰器，被装饰的类只能有一个对象
    """
    instances = {}

    def _singleton(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return _singleton
