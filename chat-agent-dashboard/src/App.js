import React from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  ChannelList,
  TypingIndicator,
  MessageInputFlat,
  MessageCommerce,
  MessageInput,
  Window
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

import "stream-chat-react/dist/css/index.css";

const chatClient = new StreamChat(process.env.REACT_APP_STREAM_API_KEY);

chatClient.setUser(
  {
    id: "support-agent-123",
    name: "Jessica",
    image: "https://getstream.io/random_svg/?id=support-agent-123&name=Jessica"
  },
  chatClient.devToken("support-agent-123")
);

const filters = { type: "commerce" };
const sort = { last_message_at: -1 };
const channels = chatClient.queryChannels(filters, sort, {
  watch: true,
  presence: true
});

function App() {
  return (
    <div>
      <Chat client={chatClient} theme={"commerce light"}>
        <ChannelList
        filters={filters}
        sort={sort}
        />
        <Channel>
          <Window>
            <ChannelHeader />

            <MessageList
              TypingIndicator={TypingIndicator}
              Message={MessageCommerce}
            />

            <MessageInput Input={MessageInputFlat} />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}

export default App;
