# -*- coding: utf-8 -*-
import os
import sys
import operator
from bson.objectid import ObjectId

from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
from jsonrpc import JSONRPCResponseManager, dispatcher

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client

USER_PREFERENCE_TABLE_NAME = 'userPreference'

SERVER_HOST = 'localhost'
SERVER_PORT = 5050


def isclose(a, b, rel_tol=1e-09, abs_tol=0.0):
    return abs(a - b) <= max(rel_tol * max(abs(a), abs(b)), abs_tol)


@dispatcher.add_method
def getUserPreference(user_id):
    try:
        db = mongodb_client.get_db()
        user_preference = db[USER_PREFERENCE_TABLE_NAME].find_one(
            {'user_id': ObjectId(user_id)})

        if user_preference is None:
            return []

        sorted_tuples = sorted(list(user_preference['preference'].items(
        )), key=operator.itemgetter(1), reverse=True)
        sorted_topic_list = [x[0] for x in sorted_tuples]
        sorted_topic_p_list = [x[1] for x in sorted_tuples]

        # 如果排在第一的和最后的主题的偏好值相近，代表偏好模型暂且无效
        if isclose(sorted_topic_p_list[0], sorted_topic_p_list[-1]):
            return []
            
        return sorted_topic_list
    except Exception as e:
        return e


@Request.application
def application(request):
    response = JSONRPCResponseManager.handle(
        request.data, dispatcher)
    return Response(response.json, mimetype='application/json')


if __name__ == '__main__':
    run_simple(SERVER_HOST, SERVER_PORT, application)
