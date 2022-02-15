import pymongo
import pathlib
import json
from pymongo import MongoClient, InsertOne

client = MongoClient("mongodb://root:password@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false")
db = client["hw2"]

Collection = db["factbook"]

# Opening a directory
for path in pathlib.Path("factbook.json").iterdir():
    if path.is_file():
        continue
    else:
        print(path)
        for insidePath in pathlib.Path(path).glob('*.json'):
            if insidePath.is_file():
                with open(insidePath) as file:
                    file_data = json.load(file)
                    
                if isinstance(file_data, list):
                    Collection.insert_many(file_data)  
                else:
                    Collection.insert_one(file_data)