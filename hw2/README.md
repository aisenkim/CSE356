# HW2 

## Requirements

- Step 1: Install mongodb, configure it to listen to network connections

- Step 2: Create a database called “hw2”

- Step 3: Create a collection called “factbook”

- Step 4: Populate the collection with data from https://github.com/opendatajson/factbook.json

- (hint, write a script to do it)

- Step 5: Open TCP port 27017 to allow access to mongodb from network 130.245.171.73/22

## Commands

```bash
# 1. run docker compose
docker compose up -d

# 2. Install pip and pymongo
pip3 install pymongo

# 3. Open port 27017

# 4. populate collection
python3 script.py

```

## Notes
- Opening port for outside access
    - https://www.digitalocean.com/community/tutorials/how-to-configure-remote-access-for-mongodb-on-ubuntu-20-04
