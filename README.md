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
DEVICE_CRON = 0 * * * *
```
Start the api
```
npm start
```
