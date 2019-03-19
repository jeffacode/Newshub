# -*- coding: utf-8 -*-
import os
import sys
import moment
from bson.objectid import ObjectId

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

from cloudAMQP_client import CloudAMQPClient
import mongodb_client
from news_topics import news_topics

NUM_OF_TOPICS = len(news_topics)
INITIAL_P = 1.0 / NUM_OF_TOPICS
ALPHA = 0.1

SLEEP_TIME_IN_SECONDS = 3

CLICK_LOGS_TASK_QUEUE_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
CLICK_LOGS_TASK_QUEUE_NAME = 'newshub-click-logs-task-queue'

NEWS_TABLE_NAME = 'news'
USER_PREFERENCE_TABLE_NAME = 'userPreference'

click_logs_queue_client = CloudAMQPClient(
    CLICK_LOGS_TASK_QUEUE_URL, CLICK_LOGS_TASK_QUEUE_NAME)

def handle_message(msg):
    if msg is None:
        return
    if not isinstance(msg, dict):
        print('[!]message is broken.')
        return
    if ('user_id' not in msg
        or 'news_id' not in msg
        or 'timestamp' not in msg):
        print('[!]message is broken.')
        return
    task = msg
    user_id = task['user_id']
    news_id = task['news_id']

    db = mongodb_client.get_db()
    user_preference = db[USER_PREFERENCE_TABLE_NAME].find_one({'user_id': ObjectId(user_id)})

    if user_preference is None:
        print('[local time: %s]Creating user preference for new user: %s.' % (moment.now().format('YYYY-M-D H:M'), user_id))
        preference = {}
        for topic in news_topics:
            preference[topic] = INITIAL_P
        user_preference = {'user_id': ObjectId(user_id), 'preference': preference}
    
    print('[local time: %s]Updating user preference for user: %s.' % (moment.now().format('YYYY-M-D H:M'), user_id))
    news = db[NEWS_TABLE_NAME].find_one({'_id': ObjectId(news_id)})

    if news is None:
        print('[!]News: %s not found. Skipped.' % news_id)
        return
    if 'topic_id' not in news:
        print('[!]News: %s does not have a topic. Skipped.' % news_id)
        return
    if news['topic_id'] not in news_topics:
        print('[!]News: %s has an unrecoginzed topic: %s. Skipped.' % (news_id, news['topic_id']))
        return

    click_topic = news['topic_id']
    click_topic_p = user_preference['preference'][click_topic]
    user_preference['preference'][click_topic] = (1 - ALPHA) * click_topic_p + ALPHA

    for topic, p in user_preference['preference'].items():
        if not topic == click_topic:
            user_preference['preference'][topic] = (1 - ALPHA) * p
    db[USER_PREFERENCE_TABLE_NAME].replace_one({'user_id': ObjectId(user_id)}, user_preference, upsert=True)
    print('[local time: %s]Update finished.' % moment.now().format('YYYY-M-D H:M'))

def run():
    print('[local time: %s]Click logs processor starts.' % moment.now().format('YYYY-M-D H:M'))
    try:
        while click_logs_queue_client is not None:
            msg = click_logs_queue_client.getMessage()
            handle_message(msg)
            click_logs_queue_client.sleep(SLEEP_TIME_IN_SECONDS)
    except Exception as e:
        print('[local time: %s]Click logs processor ends.' % moment.now().format('YYYY-M-D H:M'))
        print(e)

if __name__ == '__main__':
    run()