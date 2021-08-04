# SightPlusPlus
## How to run
Make sure you have node installed
* Install dependencies
Open up a terminal and direct to the project folder. Run the commands below one by one:
```
npm init
npm i express mongoose
npm i --save-dev nodemon dotenv
```
* Environment settings
Create a .env file in the project folder and save your environment settings
```
DATABASE_HOST = $dbHost
DATABASE_PORT = $dbPort
DATABASE_NAME = $dbName
UDP_SERVER_HOST = localhost
UDP_PORT = 7979
DEVICE_CRON = 0 * * * *
KB_HOST=https://gosh-bot.azurewebsites.net
KB_ENDPOINT_KEY=15a397e6-5775-4c42-8562-a040fbb090a9
KB_ID=06e05c24-ff93-4475-af98-19b4208f0f96
```

Set the `KB_ENDPOINT_KEY` and `KB_ID` variables to your
QnA Maker authoring endpoint key and knowledgebase id.

These values can be found in the QnA Maker service (https://www.qnamaker.ai/Home/MyServices).
Look up your Knowledge Base. Then, press the "View Code" button.

The 'KB_ID' can be found on the 1st line

`POST /knowledgebases/{KB_ID}/generateAnswer`

The `KB_ENDPOINT_KEY` can be found on the 3rd line
`Authorization: EndpointKey {KB_ENDPOINT_KEY}`


Set the `KB_HOST` variable to your QnA Maker runtime endpoint.
The value of `KB_HOST` has the format https://YOUR-RESOURCE-NAME.azurewebsites.net

Start the api
```
npm start
```
