# coding=utf-8

"""
程序运行日志记录
"""

import logging
from Biomedical24.settings import BASE_DIR
import os
from logging.handlers import TimedRotatingFileHandler


logFilePath = os.path.join(BASE_DIR, 'logs', 'info.log')
# 此处设置logger名称，否则默认的会和tornado的logger相同而使得下方设置的错误等级被轻质更新为info
log = logging.getLogger('loginfo')
log.setLevel(logging.INFO)

#
handler = TimedRotatingFileHandler(logFilePath, when="W0")

formatter = logging.Formatter('%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s')

handler.setFormatter(formatter)

log.addHandler(handler)
