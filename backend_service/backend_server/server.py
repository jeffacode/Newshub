# -*- coding: utf-8 -*-
import os
import sys
from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
from jsonrpc import JSONRPCResponseManager, dispatcher

import operations

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client

SERVER_HOST = 'localhost'
SERVER_PORT = 4040


@dispatcher.add_method
def getNotices(user_id):
    return operations.getNotices(user_id)

@dispatcher.add_method
def deleteNotice(id):
    return operations.deleteNotice(id)

@dispatcher.add_method
def fetchTopic(topic_id):
    return operations.fetchTopic(topic_id)

@dispatcher.add_method
def fetchSubscriptions(user_id):
    return operations.fetchSubscriptions(user_id)

@dispatcher.add_method
def subscribe(user_id, topic_id):
    return operations.subscribe(user_id, topic_id)

@dispatcher.add_method
def unsubscribe(user_id, topic_id):
    return operations.unsubscribe(user_id, topic_id)

@dispatcher.add_method
def fetchSearchResults(user_id):
    return operations.fetchSearchResults(user_id)

@dispatcher.add_method
def fetchTopicNewsList(user_id, topic_id, page, time, popularity):
    return operations.fetchTopicNewsList(user_id, topic_id, page, time, popularity)

@dispatcher.add_method
def fetchFeedNewsList(user_id, feed, page, time, popularity):
    return operations.fetchFeedNewsList(user_id, feed, page, time, popularity)

@dispatcher.add_method
def voteNews(user_id, news_id, state):
    return operations.voteNews(user_id, news_id, state)

@dispatcher.add_method
def saveNews(user_id, news_id):
    return operations.saveNews(user_id, news_id)

@dispatcher.add_method
def hideNews(user_id, news_id):
    return operations.hideNews(user_id, news_id)

@dispatcher.add_method
def fetchVotedNews(user_id, v, page, time, popularity):
    return operations.fetchVotedNews(user_id, v, page, time, popularity)

@dispatcher.add_method
def fetchSavedNews(user_id, page, time, popularity):
    return operations.fetchSavedNews(user_id, page, time, popularity)

@dispatcher.add_method
def fetchHiddenNews(user_id, page, time, popularity):
    return operations.fetchHiddenNews(user_id, page, time, popularity)

@dispatcher.add_method
def sendClickLog(user_id, news_id):
    return operations.sendClickLog(user_id, news_id)


@Request.application
def application(request):
    response = JSONRPCResponseManager.handle(
        request.data, dispatcher)
    return Response(response.json, mimetype='application/json')


if __name__ == '__main__':
    run_simple(SERVER_HOST, SERVER_PORT, application)
