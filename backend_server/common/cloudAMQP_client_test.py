from cloudAMQP_client import CloudAMQPClient

CLOUDAMQP_URL = 'amqp://rdisyaqq:by5EeV8qAdbjsDOh56T8p2N2tMdM6oxD@dinosaur.rmq.cloudamqp.com/rdisyaqq'
TEST_QUEUE_NAME = 'test'


def test_basic():
    client = CloudAMQPClient(CLOUDAMQP_URL, TEST_QUEUE_NAME)
    sentMsg = {'test': 'demo'}
    client.sendMessage(sentMsg)
    client.sleep(10)
    receivedMsg = client.getMessage()
    assert sentMsg == receivedMsg
    print('test_basic passed!')


if __name__ == '__main__':
    test_basic()
