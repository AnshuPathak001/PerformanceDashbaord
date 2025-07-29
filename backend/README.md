## Getting Started - Steps to run:

## For backend:

goto backend folder

## Run below commands for Mac(for windows need to check):

## Create & Activate Environment

python3 -m venv venv
source venv/bin/activate

## To install all the dependencies

pip install -r requirements.txt

## to run open air if you face playwright error run ->

playwright install

## to run backend

node index.js

---

## For frontend:

goto frontend folder

npm i
npm start

###### To run Github MCP Server

## For backend:

goto backend folder

## Run below commands for Mac:

## Create & Activate Environment

python3 -m venv venv
source venv/bin/activate

## For Windows follow below command:

venv\Scripts\activate

## To install all the dependencies

pip install -r requirements.txt

## To run backend-

uvicorn src.github.main:app --reload

## For frontend:

goto frontend folder

npm i
npm start
