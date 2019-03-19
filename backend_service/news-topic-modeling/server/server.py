# -*- coding: utf-8 -*-
import os
import sys
import pickle
import moment
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model

from bson.objectid import ObjectId

from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
from jsonrpc import JSONRPCResponseManager, dispatcher

sys.path.append(os.path.join(os.path.dirname(__file__), '../../', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'trainer'))

import mongodb_client
from news_topics import news_topics
from preprocessor import PreProcessor

MODEL_FILE = os.path.normpath(os.path.join(
    os.path.dirname(__file__), '../model/keras_model.h5'))
VARS_FILE = os.path.normpath(os.path.join(
    os.path.dirname(__file__), '../model/vars'))
TOKS_FILE = os.path.normpath(os.path.join(
    os.path.dirname(__file__), '../model/tokenizer'))

SERVER_HOST = 'localhost'
SERVER_PORT = 6060

N_CLASSES = 0
VOCAB_SIZE = 0
MAX_DOCUMENT_LENGTH = 0
EMBED_DIM = 0

tokenizer = None
classifier = None


def restoreVars():
    with open(VARS_FILE, 'rb') as f:
        vars = pickle.load(f)
        global VOCAB_SIZE
        VOCAB_SIZE = vars['VOCAB_SIZE']
        global EMBED_DIM
        EMBED_DIM = vars['EMBED_DIM']
        global MAX_DOCUMENT_LENGTH
        MAX_DOCUMENT_LENGTH = vars['MAX_DOCUMENT_LENGTH']
        global N_CLASSES
        N_CLASSES = vars['N_CLASSES']

    with open(TOKS_FILE, 'rb') as f:
        global tokenizer
        tokenizer = pickle.load(f)


def loadModel():
    global classifier
    classifier = load_model(MODEL_FILE)


# 为已经存进数据库的新闻打主题标签
def backfill():
    try:
        db = mongodb_client.get_db()
        news_list = db['news'].find({})
        for news in news_list:
            if 'topic_id' not in news:
                description = news['description']
                if description is None:
                    description = news['title']
                topic = classify(description)
                news['topic_id'] = topic
                db['news'].replace_one(
                    {'_id': ObjectId(news['_id'])}, news, upsert=True)
    except Exception as e:
        return e


@dispatcher.add_method
def classify(text):
    text = PreProcessor.clean_text(text)
    data = np.array([text])
    data = tokenizer.texts_to_sequences(data)
    data = tf.keras.preprocessing.sequence.pad_sequences(
        data, maxlen=MAX_DOCUMENT_LENGTH)

    y_predicted = np.argmax(classifier.predict(data), axis=1)

    topic = news_topics[y_predicted[0]]
    return topic


@Request.application
def application(request):
    response = JSONRPCResponseManager.handle(
        request.data, dispatcher)
    return Response(response.json, mimetype='application/json')


if __name__ == '__main__':
    restoreVars()

    print("Begin loading model.")
    loadModel()
    print('[local time: %s]Model loaded.' % moment.now().format('YYYY-M-D H:M'))

    print('Begin backfilling news.')
    backfill()
    print('[local time: %s]Backfill news finished.' % moment.now().format('YYYY-M-D H:M'))
    
    run_simple(SERVER_HOST, SERVER_PORT, application)