import requests
import json

url = 'http://localhost:6060/jsonrpc'

def classify(news):
    headers = {'content-type': 'application/json'}
    payload = {
        'method': 'classify',
        'params': [news],
        'jsonrpc': '2.0',
        "id": 0
    }
    print('[x]Request news topic. News text: %s.' % news)
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
    topic = response['result']
    print('[o]Receive news topic. Topic: %s.' % str(topic))
    return topic