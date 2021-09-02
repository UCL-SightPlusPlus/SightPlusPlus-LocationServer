# AVINA with Sight++ v3
AVINA is an open source systems architecture for businesses and organisations to rapidly deploy instances of AI, chatbots and computer vision with Intel hardware at any of their physical sites, with a network aware mobile service that is vicinity and proximity based.

## Prerequisites
- An Azure account with access to QnA service.
- [NodeJS](https://nodejs.org/en/)
- [MongoDB](https://docs.mongodb.com/manual/installation/)
- [Powershell **Core**](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.1)

## Create an Azure QnA Service and a KnowledgeBase
Since AVINA integrates with a Chatbot service to answer the user's questions, the relevant information about the service must be provided when setting up the application. To create the Azure QnA Service and the Knowledge Base navigate to [Azure QnA Maker](https://www.qnamaker.ai/Create). Follow the instructions to complete the creation of the chatbot. After the creation of the service, you will be redirected to page like this:

![QnA Service Creation](https://user-images.githubusercontent.com/19215701/131325569-0d4a04df-2054-4673-9ae6-79ddf531d842.png)

The Knowledge Base ID is in between the `/knowledgebases/{Knowledge Base ID}/generateAnswer`.

The Knowledge Base Host is https url in the 2nd line without the `/qnamaker`.

The Endpoint Key is located on the 3rd line after `EndpointKey {EndpointKey}`.

**⚠️Please keep a copy of these values because we are going to use them later on the deployment.**


## Testing and Configuration
The AVINA location server is a containerized application, so it can easily be deployed to a cloud service or configured to run on a custom (on-premises) windows, linux, or mac-os machine of your choosing. An on-premise installation is favorable so that the multiple cameras that are installed can send records to the server with minimum latency. A Powershell script is provided to automate configuration.

### Testing AVINA location server
- Download the code.
- Once downloaded, under the `/scripts` directory (e.g.orca-win-x64/Scripts) you will find a Powershell Core script named `ConfigureSightPlusPlusAppSettings.ps1`.  
Once run (with Powershell Core) the script will ask you to fill in the required settings to configure the `.env` file, such as the [Knowledge Base ID, the Knowledge Base Host and the Endpoint Key that were generated in an earlier step](#create-an-azure-qna-service-and-a-knowledgebase).
- After that navigate to the project's main folder and edit the .env file. Change the `DATABASE_HOST=mongo` line to `DATABASE_HOST=localhost`
- Run `npm install`.
- Run `npm run test` to run the mocha tests or `npm run test-with-coverage` to run the test and generate a coverage report.

**⚠️If the tests fail, please make sure that MongoDB is running on your machine.**
