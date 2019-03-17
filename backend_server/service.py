# -*- coding: utf-8 -*-
import os
import sys
import json
import pyjsonrpc
import operations

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), './', 'common'))

import mongodb_client

SERVER_HOST = 'localhost'
SERVER_PORT = 4040


class RequestHandler(pyjsonrpc.HttpRequestHandler):
    @pyjsonrpc.rpcmethod
    def add(self, a, b):
        return a + b

    @pyjsonrpc.rpcmethod
    def getNotices(self, user_id):
        return operations.getNotices(user_id)

    @pyjsonrpc.rpcmethod
    def deleteNotice(self, id):
        return operations.deleteNotice(id)
    
    @pyjsonrpc.rpcmethod
    def fetchCategory(self, category_id):
        return operations.fetchCategory(category_id)
    
    @pyjsonrpc.rpcmethod
    def fetchSubscriptions(self, user_id):
        return operations.fetchSubscriptions(user_id)
    
    @pyjsonrpc.rpcmethod
    def subscribe(self, user_id, category_id):
        return operations.subscribe(user_id, category_id)
    
    @pyjsonrpc.rpcmethod
    def unsubscribe(self, user_id, category_id):
        return operations.unsubscribe(user_id, category_id)

    @pyjsonrpc.rpcmethod
    def fetchSearchResults(self, user_id):
        return operations.fetchSearchResults(user_id)

    @pyjsonrpc.rpcmethod
    def fetchCategoryNewsList(self, user_id, category_id, page, time, popularity):
        return operations.fetchCategoryNewsList(user_id, category_id, page, time, popularity)
    
    @pyjsonrpc.rpcmethod
    def fetchFeedNewsList(self, user_id, feed, page, time, popularity):
        return operations.fetchFeedNewsList(user_id, feed, page, time, popularity)

    @pyjsonrpc.rpcmethod
    def voteNews(self, user_id, news_id, state):
        return operations.voteNews(user_id, news_id, state)

    @pyjsonrpc.rpcmethod
    def saveNews(self, user_id, news_id):
        return operations.saveNews(user_id, news_id)

    @pyjsonrpc.rpcmethod
    def hideNews(self, user_id, news_id):
        return operations.hideNews(user_id, news_id)
    
    @pyjsonrpc.rpcmethod
    def fetchVotedNews(self, user_id, v, page, time, popularity):
        return operations.fetchVotedNews(user_id, v, page, time, popularity)
    
    @pyjsonrpc.rpcmethod
    def fetchSavedNews(self, user_id, page, time, popularity):
        return operations.fetchSavedNews(user_id, page, time, popularity)
    
    @pyjsonrpc.rpcmethod
    def fetchHiddenNews(self, user_id, page, time, popularity):
        return operations.fetchHiddenNews(user_id, page, time, popularity)

    @pyjsonrpc.rpcmethod
    def sendClickLog(self, user_id, news_id):
        return operations.sendClickLog(user_id, news_id)

http_server = pyjsonrpc.ThreadingHttpServer(
    server_address=(SERVER_HOST, SERVER_PORT),
    RequestHandlerClass=RequestHandler
)

print('Starting HTTP server on %s:%d' % (SERVER_HOST, SERVER_PORT))

http_server.serve_forever()
