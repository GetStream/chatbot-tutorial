# chatbot-tutorial

This chatbot tutorial teaches you how to build your own customer chat experience and chatbot. Read the full tutorial: [The Definitive Tutorial for Building Your Own Customer Support Chat & Serverless Chatbot] (https://getstream.io/blog/)

## Convenient links:

-   [LUIS Tutorial](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/)
-   [React Chat Tutorial](https://getstream.io/chat/react-chat/tutorial/)
-   [React Native Chat Tutorial](https://getstream.io/chat/react-native-chat/tutorial/)
-   [iOS/Swift Chat Tutorial](https://getstream.io/tutorials/ios-chat/)
-   [Chat API Tour](https://getstream.io/chat/get_started/)


## Install

If you don't feel like doing the full tutorial you can get this repo up and running by following these instructions

### Account setup

Ensure you have an account for [Stream](https://getstream.io/chat/) and [LUIS](https://www.luis.ai/). 


### Disable auth & permissions

Disable auth and permission checks on your stream chat account.
Head over the [dashboard](https://getstream.io/dashboard/) -> click your app -> click chat -> disable permissions & auth -> save

### Git clone

```
git clone git@github.com:GetStream/chatbot-tutorial.git
cd chatbot-tutorial
```



### Support Chat React

Create a file called **.env.development**, the full path is **chatbot-tutorial/chat-frontend/.env.development** with these settings

```
REACT_APP_STREAM_API_KEY=replacewithyourstreamapikey
```

Next run these steps

```
cd chat-frontend
yarn; yarn start
```

### Support Agent React Chat Dashboard

Create a file called **.env.development**, the full path is **chatbot-tutorial/chat-agent-dashboard/.env.development** with these settings

```
REACT_APP_STREAM_API_KEY=replacewithyourstreamapikey
```

Next run these steps

```
cd ..
cd chat-agent-dashboard
yarn; yarn start
```

### Serveless Chatbot

Create a file called **.env**, the full path is **chatbot-tutorial/serverless/.env** and setup the environment variables:

```
STREAM_API_KEY=replacewithyourstreamapikey
STREAM_API_SECRET=secret
LUIS_APP_ID=appid
LUIS_SUBSCRIPTION_KEY=subscriptionkey
LUIS_REGION=westus
```

Next run these steps

```
cd ..
cd serverless
yarn
func start
```

Note that to actually deploy the serverless code you'll need to setup a function app, configure your Azure CLI and setup the above 5 environment variables for your function app (it's in the Azure dashboard). The Chatbot tutorial covers this in more detail.
