from kafka import KafkaConsumer
import json
import requests
import socket
import urllib3
import pycompiler
import os

urllib3.disable_warnings()
requests.packages.urllib3.disable_warnings()

HOST_NAME='10.60.1.8:9092'
GROUP="employee_portal"
TOPIC="leadstatusupdate"

consumer = KafkaConsumer(
 bootstrap_servers=HOST_NAME,  
 client_id=socket.gethostname(),
 value_deserializer = lambda v: json.loads(v.decode('ascii')),
 auto_offset_reset='earliest',
 enable_auto_commit=True,
 auto_commit_interval_ms=1000,
 group_id=GROUP,
 max_poll_records=100,
 max_poll_interval_ms=30000
)


consumer.subscribe(topics=TOPIC)
partitions = consumer.partitions_for_topic(TOPIC)


webhook_result="http://fastapi:8000/update-status"


def mypost(url,obj):
    return requests.post(url, json = obj,verify=False)



for message in consumer:
    
    try:    
        consumer.commit()
        payload=message.value["data"]
        print(payload)
        res=mypost(webhook_result,payload)
        print(res.json())
    except Exception as e :
       print(e)


    
    
