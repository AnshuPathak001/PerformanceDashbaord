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
node index.js

# If github mcp server doesn't run then run below cmd and pass hardcoded ip address in PullRequestCard file inside frontend/src/components/pullRequestcard/index.js line no - 26

uvicorn src.github.main:app --reload --host 0.0.0.0

## For frontend:

goto frontend folder

npm i
npm start


###### To run all the backend and frontend server by a single command - (for winodws only)

## This command will run mongodb, github mcp server and frontend

## run on root folder

npm install
npm run start

## if github mcp server doesn't start then run below cmd and check for process id and kill it with below cmd

netstat -ano | findstr :8000
taskkill /PID 25464 /F

## and restart the server again

npm run start

###### To run Github MCP Server Only
