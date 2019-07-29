const axios = require("axios");
const StreamChat = require("stream-chat").StreamChat;
require("dotenv").config();


/**
 * getStreamClient - returns the Stream Chat client
 *
 * @returns {object}  Stream chat client
 */
function getStreamClient() {
  const client = new StreamChat(
    process.env.STREAM_API_KEY,
    process.env.STREAM_API_SECRET
  );
  return client;
}

/**
 * analyseIntentWithLUIS - runs intent analysis on the message with LUIS
 *
 * @param  {string} messageText the message text to analyse
 * @returns {object}             returns the top intent as {intent: 'name', score: 0.9}
 */
async function analyseIntentWithLUIS(context, messageText) {
  const appID = process.env.LUIS_APP_ID;
  const key = process.env.LUIS_SUBSCRIPTION_KEY;
  const region = process.env.LUIS_REGION;
  const url = `https://${region}.api.cognitive.microsoft.com/luis/v2.0/apps/${appID}?subscription-key=${key}&q=${messageText}`;
  const response = await axios.get(url);
  const data = response.data;
  context.log("response", response);

  return data.topScoringIntent;
}

/**
 * anonymous function - This request handler does a few things
 *
 * 1. Handle the Stream webhook data
 * 2. Run intent analysis with LUIS
 * 3. Send a reply on the channel
 */
module.exports = async function(context, req) {
  // show a nice error if you send a GET request
  if (req.method === "GET") {
    context.res = {
      body: { error: "Invalid request, only POST requests are allowed" }
    };
    return;
  }
  // important: validate that the request came from Stream
  const chatClient = getStreamClient();
  const valid = chatClient.verifyWebhook(req.rawBody, req.headers['x-signature']);
  if (!valid) {
    context.res = {
      body: { error: "Invalid request, signature is invalid" }
    };
    return;
  }

  // reply to message.new, but not to messages written by the bot
  // (you get an interesting loop if you don't exclude bot messages)
  if (req.body.type === "message.new" && req.body.message.user.id !== "mrbot") {
    // parse the stream webhook format
    const messageText = req.body.message.text;
    const cID = req.body.cid;
    const channelType = cID.split(":")[0];
    const channelID = cID.split(":")[1];

    // run intent analysis with LUIS
    const topIntent = await analyseIntentWithLUIS(context, messageText);
    const intent = topIntent.intent;
    const score = topIntent.score;
    context.log(
      `Received a message.new with text "${messageText}" and found intent ${intent} with score ${score}`
    );

    // if we understand this intend, send a reply
    const channel = chatClient.channel(channelType, channelID);
    const botUser = {id: "mrbot",name: "MR Bot"};

    if (intent === "Answer") {
      await channel.sendMessage({
        text: "42 is the answer",
        user: botUser
      });
    } else if (intent === "RestaurantReservation.Reserve") {
      await channel.sendMessage({
        text: "Great idea, I'm hungry",
        user: botUser
      });
    }

    // send a 200 response with some extra info
    context.res = {
      body: { messageText: messageText, intent: intent, score: score }
    };
  } else {
    let userID = null;
    if (req.body.message && req.body.message.user) {
      userID = req.body.message.user.id;
    }
    const msg = `Skipping request of type ${req.body.type} from userID ${userID}`;
    context.log(msg);
    context.res = {
      body: { error: msg }
    };
  }
};
