#!/bin/zsh

redis-server
mongod

pip install -r requirements.txt

cd news_pipeline
python3 news_monitor.py
python3 news_fetcher.py
python3 news_deduper.py

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)