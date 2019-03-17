# -*- coding: utf-8 -*-
import os
import sys
import json
import moment
from bson.json_util import dumps
from bson.objectid import ObjectId

sys.path.append(os.path.join(os.path.dirname(__file__), './', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), './', 'utils'))

import mongodb_client
from cloudAMQP_client import CloudAMQPClient
import strategies

CLICKLOGS_TASK_QUEUE_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
CLICKLOGS_TASK_QUEUE_NAME = 'newshub-click-logs-task-queue'

cloudAMQP_client = CloudAMQPClient(
    CLICKLOGS_TASK_QUEUE_URL, CLICKLOGS_TASK_QUEUE_NAME)

PAGE_SIZE = 10
USER_TABLE_NAME = 'user'
NOTICE_TABLE_NAME = 'notice'
SUBSCRIPTION_TABLE_NAME = 'subscription'
NEWS_TABLE_NAME = 'news'
CATEGORY_TABLE_NAME = 'category'
VOTEDNEWS_TABLE_NAME = 'votedNews'
SAVEDNEWS_TABLE_NAME = 'savedNews'
HIDDENNEWS_TABLE_NAME = 'hiddenNews'
CLICKLOGS_TABLE_NAME = 'clickLogs'


def match(time, fields={}):
    timeStrategy = strategies.getTimeStrategy(time)
    fields.update(timeStrategy)
    return [{'$match': fields}]

def sort(popularity, fields={}):
    popularityStrategy = strategies.getPopularityStrategy(popularity)
    sortStrategy = strategies.getSortStrategy(popularity)
    fields.update(sortStrategy)
    return [
        {'$addFields': {'popularity': popularityStrategy}},
        {'$sort': fields},
        {'$project': {'popularity': 0}}
    ]

def lookup(From, localField, foreignField, As):
    return [
        {
            '$lookup': {
                'from': From,
                'localField': localField,
                'foreignField': foreignField,
                'as': As
            }
        }
    ]

def unwind(field):
    return [{'$unwind': field}]

def replaceRoot(field):
    return [{'$replaceRoot': {'newRoot': field}}]

def paginate(page):
    return [
        {
            '$facet': {
                'metadata': [{'$count': 'total'}, {'$addFields': {'page': page}}],
                'data': [{'$skip': (page - 1) * PAGE_SIZE}, {'$limit': PAGE_SIZE}]
            }
        }
    ]

def processPageData(db, page_data, user_id):
    if 'data' not in page_data:
        page_data['data'] = []
    result_news_list = []
    for news in page_data['data']:
        votedNews = db[VOTEDNEWS_TABLE_NAME].find_one({'news_id': news['_id'], 'user_id': user_id})
        if votedNews is not None:
            news['voted'] = votedNews['voted']
        else:
            news['voted'] = 0
        savedNews = db[SAVEDNEWS_TABLE_NAME].find_one({'news_id': news['_id'], 'user_id': user_id})
        if savedNews is not None:
            news['saved'] = True
        else:
            news['saved'] = False
        hiddenNews = db[HIDDENNEWS_TABLE_NAME].find_one({'news_id': news['_id'], 'user_id': user_id})
        if hiddenNews is not None:
            news['hidden'] = True
        else:
            news['hidden'] = False
        news['id'] = str(news['_id'])
        news['publishedAt'] = moment.date(news['publishedAt']).strftime("%Y-%m-%d %H:%M")
        del news['_id']
        del news['content']
        result_news_list.append(news)
    page_data['data'] = result_news_list
    if  len(page_data['metadata']) == 0:
        page_data['metadata'] = {
            'page': 1,
            'total': 0
        }
    else:
        page_data['metadata'] = page_data['metadata'][0]
    return json.loads(dumps(page_data))

def getNotices(user_id):
    try:
        db = mongodb_client.get_db()
        notices = list(db[NOTICE_TABLE_NAME].find(
            {'user_id': ObjectId(user_id)}))
        for notice in notices:
            notice['id'] = str(notice['_id'])
            del notice['_id']
            del notice['user_id']
        return json.loads(dumps(notices))
    except Exception as e:
        return e


def deleteNotice(id):
    try:
        db = mongodb_client.get_db()
        db = mongodb_client.get_db()
        db[NOTICE_TABLE_NAME].delete_many({'_id': ObjectId(id)})
        return 'Successfully deleted!'
    except Exception as e:
        return e


def fetchCategory(category_id):
    try:
        db = mongodb_client.get_db()
        category = db[CATEGORY_TABLE_NAME].find_one(
            {'category_id': category_id})
        del category['_id']
        return json.loads(dumps(category))
    except Exception as e:
        return e


def fetchSubscriptions(user_id):
    try:
        db = mongodb_client.get_db()
        subscriptions = list(db[SUBSCRIPTION_TABLE_NAME].find(
            {'user_id': ObjectId(user_id)}))
        subscribed_categories = []
        for subscription in subscriptions:
            category = db[CATEGORY_TABLE_NAME].find_one(
                {'category_id': subscription['category_id']})
            del category['_id']
            subscribed_categories.append(category)
        return json.loads(dumps(subscribed_categories))
    except Exception as e:
        return e


def subscribe(user_id, category_id):
    try:
        db = mongodb_client.get_db()
        # 创建新的订阅数据
        db[SUBSCRIPTION_TABLE_NAME].insert({
            'user_id': ObjectId(user_id),
            'category_id': category_id
        })
        # 更新订阅人数
        category = db[CATEGORY_TABLE_NAME].find_one(
            {'category_id': category_id})
        new_subscribers = category['subscribers'] + 1
        db[CATEGORY_TABLE_NAME].update_one(
            {'category_id': category_id},
            {'$set': {'subscribers': new_subscribers}
             })
        return 'Successfully subscribed!'
    except Exception as e:
        return e


def unsubscribe(user_id, category_id):
    try:
        db = mongodb_client.get_db()
        # 删除订阅数据
        db[SUBSCRIPTION_TABLE_NAME].delete_one({
            'user_id': ObjectId(user_id),
            'category_id': category_id
        })
        # 更新订阅人数
        category = db[CATEGORY_TABLE_NAME].find_one(
            {'category_id': category_id})
        new_subscribers = category['subscribers'] - 1
        db[CATEGORY_TABLE_NAME].update_one(
            {'category_id': category_id},
            {'$set': {'subscribers': new_subscribers}
             })
        return 'Successfully unsubscribed!'
    except Exception as e:
        return e


def fetchSearchResults(user_id):
    try:
        db = mongodb_client.get_db()
        categories = list(db[CATEGORY_TABLE_NAME].find())
        search_results = []
        for category in categories:
            if len(list(db[SUBSCRIPTION_TABLE_NAME].find({
                'user_id': ObjectId(user_id),
                    'category_id': category['category_id']}))) == 0:
                category['subscribed'] = False
            else:
                category['subscribed'] = True
            del category['_id']
            search_results.append(category)
        return json.loads(dumps(search_results))
    except Exception as e:
        return e

def fetchCategoryNewsList(user_id, category_id, page, time, popularity):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        page = int(page)
        pipeline = match(time, {'category_id': category_id}) + \
                    sort(popularity) + \
                    paginate(page)
        page_data = list(db[NEWS_TABLE_NAME].aggregate(pipeline))[0]
        return processPageData(db, page_data, user_id)
    except Exception as e:
        return e

def fetchFeedNewsList(user_id, feed, page, time, popularity):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        page = int(page)

        # 返回当前用户订阅的所有分类的新闻数据
        if feed == 'home':
            pipeline = match(time, {'user_id': user_id}) + \
                        lookup(NEWS_TABLE_NAME, 'category_id', 'category_id', 'news') + \
                        unwind('$news') + \
                        replaceRoot('$news') + \
                        sort(popularity) + \
                        paginate(page)
            page_data = list(db[SUBSCRIPTION_TABLE_NAME].aggregate(pipeline))[0]
            return processPageData(db, page_data, user_id)

        # 返回votes排名靠前的新闻数据
        if feed == 'popular':
            pipeline = match(time, {'votes': {'$gt': 0}}) + \
                        sort(popularity, {'votes': -1}) + \
                        paginate(page)
            page_data = list(db[NEWS_TABLE_NAME].aggregate(pipeline))[0]
            return processPageData(db, page_data, user_id)
        
        # 返回所有新闻数据
        if feed == 'all':
            pipeline = match(time) + \
                        sort(popularity) + \
                        paginate(page)
            page_data = list(db[NEWS_TABLE_NAME].aggregate(pipeline))[0]
            return processPageData(db, page_data, user_id)
    except Exception as e:
        return e

def voteNews(user_id, news_id, state):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        news_id = ObjectId(news_id)
        state = int(state)
        votedNews = db[VOTEDNEWS_TABLE_NAME].find_one({'user_id': user_id, 'news_id': news_id})
        if votedNews is None:
            # 获取更新策略
            voteStrategy = strategies.voteStrategies[0][state]
            # 插入新的votedNews
            db[VOTEDNEWS_TABLE_NAME].insert_one({
                'user_id': user_id,
                'news_id': news_id,
                'voted': voteStrategy[0]
            })
        else:
            # 获取更新策略
            voteStrategy = strategies.voteStrategies[votedNews['voted']][state]
            if voteStrategy[0] == 0:
                # 从表中删除当前记录
                db[VOTEDNEWS_TABLE_NAME].delete_one({'_id': votedNews['_id']})
            else:
                # 更新当前votedNews的voted字段
                db[VOTEDNEWS_TABLE_NAME].update_one({'_id': votedNews['_id']}, {
                    '$set': {'voted': voteStrategy[0]}
                })
        # 更新当前news的votes、upvotes、downvotes字段
        news = db[NEWS_TABLE_NAME].find_one({'_id': news_id})
        newVotes = news['votes'] + voteStrategy[1]
        newDownvotes = news['downvotes'] + voteStrategy[2]
        newUpvotes = news['upvotes'] + voteStrategy[3]
        db[NEWS_TABLE_NAME].update_one({'_id': news_id}, {
            '$set': {
                'votes': newVotes,
                'downvotes': newDownvotes,
                'upvotes': newUpvotes
            }
        })
        return 'Sucessfully voted!'
    except Exception as e:
        return e

def saveNews(user_id, news_id):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        news_id = ObjectId(news_id)
        savedNews = db[SAVEDNEWS_TABLE_NAME].find_one({'user_id': user_id, 'news_id': news_id})
        if savedNews is None:
            db[SAVEDNEWS_TABLE_NAME].insert_one({'user_id': user_id, 'news_id': news_id})
        else:
            db[SAVEDNEWS_TABLE_NAME].delete_one({'_id': savedNews['_id']})
        return 'Successfully saved!'
    except Exception as e:
        return e

def hideNews(user_id, news_id):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        news_id = ObjectId(news_id)
        hiddenNews = db[HIDDENNEWS_TABLE_NAME].find_one({'user_id': user_id, 'news_id': news_id})
        if hiddenNews is None:
            db[HIDDENNEWS_TABLE_NAME].insert_one({'user_id': user_id, 'news_id': news_id})
        else:
            db[HIDDENNEWS_TABLE_NAME].delete_one({'_id': hiddenNews['_id']})
        return 'Successfully hidden!'
    except Exception as e:
        return e

def fetchVotedNews(user_id, v, page, time, popularity):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        v = int(v)
        page = int(page)
        pipeline = [{'$match': {'user_id': user_id, 'voted': v}}] + \
                    lookup(NEWS_TABLE_NAME, 'news_id', '_id', 'news') + \
                    unwind('$news') + \
                    replaceRoot('$news') + \
                    match(time) + \
                    sort(popularity) + \
                    paginate(page)
        page_data = list(db[VOTEDNEWS_TABLE_NAME].aggregate(pipeline))[0]
        return processPageData(db, page_data, user_id)
    except Exception as e:
        return e

def fetchSavedNews(user_id, page, time, popularity):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        page = int(page)
        pipeline = [{'$match': {'user_id': user_id}}] + \
                    lookup(NEWS_TABLE_NAME, 'news_id', '_id', 'news') + \
                    unwind('$news') + \
                    replaceRoot('$news') + \
                    match(time) + \
                    sort(popularity) + \
                    paginate(page)
        page_data = list(db[SAVEDNEWS_TABLE_NAME].aggregate(pipeline))[0]
        return processPageData(db, page_data, user_id)
    except Exception as e:
        return e

def fetchHiddenNews(user_id, page, time, popularity):
    try:
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        page = int(page)
        pipeline = [{'$match': {'user_id': user_id}}] + \
                    lookup(NEWS_TABLE_NAME, 'news_id', '_id', 'news') + \
                    unwind('$news') + \
                    replaceRoot('$news') + \
                    match(time) + \
                    sort(popularity) + \
                    paginate(page)
        page_data = list(db[HIDDENNEWS_TABLE_NAME].aggregate(pipeline))[0]
        return processPageData(db, page_data, user_id)
    except Exception as e:
        return e

def sendClickLog(user_id, news_id):
    try:
        timestamp = moment.utcnow()

        message = {'user_id': user_id, 'news_id': news_id, 'timestamp': timestamp.strftime('%Y-%m-%dT%H:%M:%SZ')}
        cloudAMQP_client.sendMessage(message)

        # 在mongo中保留log
        db = mongodb_client.get_db()
        user_id = ObjectId(user_id)
        news_id = ObjectId(news_id)
        db[CLICKLOGS_TABLE_NAME].insert({
            'user_id': user_id,
            'news_id': news_id,
            'timestamp': timestamp.date
        })
        return 'click log successfully saved!'

    except Exception as e:
        return e