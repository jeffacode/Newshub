# -*- coding: utf-8 -*-
import os
import sys
import math
import moment
from dateutil.parser import parse
from sklearn.feature_extraction.text import TfidfVectorizer

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient
import mongodb_client

DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'newshub-dedupe-news-task-queue'

SLEEP_TIME_IN_SECONDS = math.ceil((6 * 3600) / (20 * 250)) + 3
NEWS_TABLE_NAME = 'news'
SAME_NEWS_SIMILARITY_THRESHOLD = 0.8

dedupe_news_queue_client = CloudAMQPClient(
    DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)


def handle_message(msg):
    if msg is None:
        return
    if not isinstance(msg, dict):
        print('[!]message is broken.')
        return
    task = msg
    content = task['content']
    
    # 从mongodb中找和当前新闻同一天内发布的新闻进行TF-IDF比较
    published_at = parse(task['publishedAt'])
    published_at_day = moment.utc(published_at.year, published_at.month, published_at.day)
    published_at_day_begin = published_at_day.date
    published_at_day_end = published_at_day.add(days=1).date

    db = mongodb_client.get_db()
    recent_news_list = list(db[NEWS_TABLE_NAME].find(
        {'publishedAt': {'$gte': published_at_day_begin, '$lt': published_at_day_end}}))

    if recent_news_list is not None and len(recent_news_list) > 0:
        documents = [news['content'] for news in recent_news_list]
        documents.insert(0, content)

        # 计算TF-IDF
        print('[x]Deduping %s news from %s' % (task['source'], task['url']))
        tfidf = TfidfVectorizer().fit_transform(documents)
        pairwise_sim = tfidf * tfidf.T

        rows, _ = pairwise_sim.shape
        for row in range(1, rows):
            if pairwise_sim[row, 0] > SAME_NEWS_SIMILARITY_THRESHOLD:
                # 除[0,0]外在第一列其他位置有任何一个值超过阈值就认为当前新闻重复
                print('[!]Duplicated news. Ignored.')
                return
    # 不是重复新闻即可插入mongodb
    task['publishedAt'] = published_at
    task['votes'] = 0
    task['upvotes'] = 0
    task['downvotes'] = 0
    db[NEWS_TABLE_NAME].replace_one({'digest': task['digest']}, task, upsert=True)
    print('[o]Not duplicated news. Saved.')

print('[local time: %s]News deduper starts.' % moment.now().format("YYYY-M-D H:M"))
try:
    while dedupe_news_queue_client is not None:
        msg = dedupe_news_queue_client.getMessage()
        handle_message(msg)
        dedupe_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
except Exception as e:
    print('[local time: %s]News deduper ends.' % moment.now().format("YYYY-M-D H:M"))
    print(e)
