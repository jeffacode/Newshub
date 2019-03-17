# -*- coding: utf-8 -*-
import os
import sys
import math
import moment
import news_scraper

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient


SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
SCRAPE_NEWS_TASK_QUEUE_NAME = 'newshub-scrape-news-task-queue'
DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'newshub-dedupe-news-task-queue'

SLEEP_TIME_IN_SECONDS = math.ceil((6 * 3600) / (20 * 250))

scrape_news_queue_client = CloudAMQPClient(
    SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
dedupe_news_queue_client = CloudAMQPClient(
    DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)


def handle_message(msg):
    if msg is None:
        return
    if not isinstance(msg, dict):
        print('[!]message is broken.')
        return
    task = msg
    content = None
    print('[x]Scraping %s news from %s' % (task['source'], task['url']))
    content = news_scraper.extract_news(task['url'])
    if content is None or len(content) == 0:
        print('[!]Nothing scrapped. Ignored.')
    else:
        print('[o]%s...[total %s chars]' % (content[:30], len(content)))
        task['content'] = content
        dedupe_news_queue_client.sendMessage(task)  # 爬取内容成功后再将新闻数据发送到dedupe news queue


print('[local time: %s]News fetcher starts.' % moment.now().format("YYYY-M-D H:M"))
try:
    while scrape_news_queue_client is not None:
        msg = scrape_news_queue_client.getMessage()
        handle_message(msg)
        # scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
except Exception as e:
    print('[local time: %s]News fetcher ends.' % moment.now().format("YYYY-M-D H:M"))
    print(e)
