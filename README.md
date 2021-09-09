# AVINA with Sight++ v3
AVINA is an open source systems architecture for businesses and organisations to rapidly deploy instances of AI, chatbots and computer vision with Intel hardware at any of their physical sites, with a network aware mobile service that is vicinity and proximity based. 

# Installation

## Prerequisites
- An Azure account with access to QnA service.
- [Docker](https://www.docker.com/get-started)
- [Powershell **Core**](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.1)
- Complete the Organisation server installation & deployment as you will be asked the Domain Name or IP of the organisation server during setup.

## Create an Azure QnA Service and a KnowledgeBase
Since AVINA integrates with a Chatbot service to answer the user's questions, the relevant information about the service must be provided when setting up the application. To create the Azure QnA Service and the Knowledge Base navigate to [Azure QnA Maker](https://www.qnamaker.ai/Create). Follow the instructions to complete the creation of the chatbot. After the creation of the service, you will be redirected to page like this:

![QnA Service Creation](https://user-images.githubusercontent.com/19215701/131325569-0d4a04df-2054-4673-9ae6-79ddf531d842.png)

The Knowledge Base Host is the HTTPS URL in the 2nd line without the `/qnamaker`. (ex. `https://gosh-bot.azurewebsites.net`)

The Endpoint Key is located on the 3rd line after `EndpointKey {EndpointKey}`.

The Knowledge Base ID is at the 1st line between the `/knowledgebases/{Knowledge Base ID}/generateAnswer`.


**⚠️Please keep a copy of these values because we are going to use them later on the deployment.**


## Deployment and Configuration
The AVINA location server is a containerized application, so it can easily be deployed to a cloud service or configured to run on a custom (on-premises) windows, linux, or mac-os machine of your choosing. An on-premise installation is favorable so that the multiple cameras that are installed can send records to the server with minimum latency. A Powershell script is provided to automate configuration.

### Deploying AVINA location server to a server of your choosing
- Download the code.
- Once downloaded, under the `/scripts` directory you will find a Powershell Core script named `ConfigureSightPlusPlusAppSettings.ps1`.  
  Once run (with Powershell Core) the script will ask you to fill in the required settings to configure the `.env` file, such as the [Knowledge Base ID, the Knowledge Base Host and the Endpoint Key that were generated in an earlier step](#create-an-azure-qna-service-and-a-knowledgebase).
- After configuring the application, you can deploy it by running `docker-compose up --build -d`.

## Working with AVINA
Once the deployment is complete, we can start setting up the devices.
To add devices to your database, you can send POST requests to `http://{IP-of-your-server-or-localhost-if-deployed-locally}:9999/devices`
The schema of the JSON request can be found [here](api/schemas/device-schema.json).

An example of a camera device is:
```{
    "_id": "1",
    "deviceType": "camera",
    "deviceLocation": "Reception",
    "site": "GOSH DRIVE",
    "isIndoor": true,
    "floor": 0
}
```

An example of a BLE device:
```
{
    "_id": "2",
    "deviceType": "BLE",
    "deviceLocation": "Reception",
    "site": "GOSH DRIVE",
    "isIndoor": true,
    "floor": 0
}
```

Once you have set up at least one camera and one BLE in the same location, you are ready to use AVINA.

### Camera Setup
For the camera setup so that it will send its records to the server, follow the instructions [here](https://github.com/UCL-SightPlusPlus/SightPlusPlus-ComputerVision).

If don't want to setup the camera right now, you can mock a camera's record by sending a POST request to `http://{IP-of-your-server-or-localhost-if-deployed-locally}:9999/records`
The schema of the JSON request can be found [here](api/schemas/record-schema.json).
An example of a record regarding queueing:
```{
    "timestamp": "2021-08-31T18:25:43.511Z",
    "deviceId": "1",
    "recordType": 1,
    "queueing": 2 //# of people waiting in the queue.
}
```
An example of a record regarding empty seats available:
```{
    "timestamp": "2021-08-31T18:25:43.511Z",
    "deviceId": "1",
    "recordType": 2,
    "freeSeats": 2 //# of empty chairs.
}
```

## Next Steps
Now you can continue with the [mobile app setup](https://github.com/UCL-SightPlusPlus/SightPlusPlus-App).