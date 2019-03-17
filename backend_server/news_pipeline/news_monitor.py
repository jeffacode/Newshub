# -*- coding: utf-8 -*-
import os
import sys
import math
import random
import hashlib
import base64
import redis
import moment

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from news_api_client import news_api_client
from cloudAMQP_client import CloudAMQPClient

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

NEWS_TIME_OUT_IN_SECONDS = 3 * 24 * 3600
SLEEP_TIME_IN_SECONDS = math.ceil(6 * 3600 / 250)

SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
SCRAPE_NEWS_TASK_QUEUE_NAME = 'newshub-scrape-news-task-queue'

PAGE_SIZE = 20
LANGUAGE = 'en'
NEWS_SOURCES = [
    'cnn',
    'wired',
    'mirror',
    'engadget',
    'the-verge',
    'usa-today',
    'techcrunch',
    'the-washington-post',
    'entertainment-weekly',
    'the-washington-times'
]

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)
cloudAMQP_client = CloudAMQPClient(
    SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)

print('[local time: %s]News pipeline starts.' % moment.now().format("YYYY-M-D H:M"))
try:
    while True:
        random.shuffle(NEWS_SOURCES)
        for source in NEWS_SOURCES:
            page = 1
            total = PAGE_SIZE
            while page <= math.ceil(total / PAGE_SIZE):
                if page == 1:
                    print('[x]%s: page=1.' % (source))
                else:
                    print('[x]%s: page=%d, pages_left=%d.' % (source, page, math.ceil(total / PAGE_SIZE) - page))
                res = news_api_client.get_everything(
                    sources=source,
                    page=page,
                    page_size=PAGE_SIZE,
                    language=LANGUAGE
                )
                if (res['status'] != 'error') and (res['articles'] is not None):
                    num_of_new_news = 0
                    for news in res['articles']:
                        # 生成news digest作为新闻的唯一标识符
                        news_digest = base64.b64encode(
                            hashlib.new("md5", news['title'].encode('utf-8')
                        ).digest()).decode('utf-8')
                        
                        # news digest在redis中不存在代表新闻是新的
                        if redis_client.get(news_digest) is None:
                            num_of_new_news += 1
                            news['digest'] = news_digest # 添加digest字段
                            news['source'] = source # source字段改为当前source
                            del news['content'] # 丢弃content字段
                        
                            if news['publishedAt'] is None:
                                # format: YYYY-MM-DDTHH:MM:SS in UTC
                                news['publishedAt'] = moment.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
                            
                            redis_client.set(news_digest, news['title']) # redis里存一份从news digest到title的映射
                            redis_client.expire(news_digest, NEWS_TIME_OUT_IN_SECONDS)  # 过期后自动清除
                            
                            cloudAMQP_client.sendMessage(news)  # 将news发送到消息队列
                    print('[o]%s: %d new news fetched.' % (source, num_of_new_news))
                    if page == 1:
                        total = res['totalResults']
                        if total > 500: total = 500
                    page += 1
                    cloudAMQP_client.sleep(SLEEP_TIME_IN_SECONDS)  # 完成一次请求后开始休眠
                else:
                    break  # 错误就终止请求当前源，跳到下一个源继续
except Exception as e:
    print('[local time: %s]News pipeline ends.' % moment.now().format("YYYY-M-D H:M"))
    print(e)