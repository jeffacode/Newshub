import news_scraper as scraper

EXPECTED_STRING = "At least 49 people have been killed, and 20 seriously injured, after mass shootings at two mosques in the New Zealand city of Christchurch."
URL = "http://us.cnn.com/asia/live-news/new-zealand-christchurch-shooting-intl/index.html"

def test_basic():
  news = scraper.extract_news(URL)
  assert EXPECTED_STRING in news
  print(news)
  print('test_basic passed!')

if __name__ == '__main__':
  test_basic()