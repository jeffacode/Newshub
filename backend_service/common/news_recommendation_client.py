import requests
import json

url = 'http://localhost:5050/jsonrpc'

def getUserPreference(user_id):
    headers = {'content-type': 'application/json'}
    payload = {
        'method': 'getUserPreference',
        'params': [user_id],
        'jsonrpc': '2.0',
        'id': 0
    }
    print('[x]Request user preference. User: %s.' % user_id)
    response = requests.post(
        url, data=json.dumps(payload), headers=headers).json()
    preference = response['result']
    print('[o]Receive user preference. Preference: %s.' % str(preference))
    return preference