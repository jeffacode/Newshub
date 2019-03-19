#!/bin/zsh

redis-server
mongod

pip install -r requirements.txt

cd backend_server
python3 backend_server.py

cd ../news_pipeline_service
python3 news_monitor.py
python3 news_fetcher.py
python3 news_deduper.py

echo ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)