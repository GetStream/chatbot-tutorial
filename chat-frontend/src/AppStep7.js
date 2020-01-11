import React from "react";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  TypingIndicator,
  MessageInputFlat,
  MessageCommerce,
  MessageInput,
  ChannelContext,
  Avatar
} from "stream-chat-react";
import { StreamChat } from "stream-chat";

import "stream-chat-react/dist/css/index.css";

const chatClient = new StreamChat(process.env.REACT_APP_STREAM_API_KEY);

/**
 * A little button component to toggle the chat interface
 */
const Button = ({ open, onClick }) => (
  <div
    onClick={onClick}
    className={`button ${open ? "button--open" : "button--closed"}`}
  >
    {open ? (
      <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M19.333 2.547l-1.88-1.88L10 8.12 2.547.667l-1.88 1.88L8.12 10 .667 17.453l1.88 1.88L10 11.88l7.453 7.453 1.88-1.88L11.88 10z"
          fillRule="evenodd"
        />
      </svg>
    ) : (
      <svg width="24" height="20" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M.011 20L24 10 .011 0 0 7.778 17.143 10 0 12.222z"
          fillRule="evenodd"
        />
      </svg>
    )}
  </div>
);

/**
 * A custom channel header element which shows who is currently online
 */
function MyChannelHeader() {
  const channelContext = React.useContext(ChannelContext);
  const channel = channelContext.channel;
  const client = channelContext.client;
  const [members, setMembers] = React.useState(channel.state.members);

  React.useEffect(() => {
    function handleUserPresenceChange(event) {
      setMembers(channel.state.members);
    }

    client.on("user.presence.changed", handleUserPresenceChange);

    return function cleanup() {
      client.off("user.presence.changed", handleUserPresenceChange);
    };
  });

  const onlineUsers = [];
  if (members) {
    for (let m of Object.values(members)) {
      if (m.user.online) {
        onlineUsers.push(m.user);
      }
    }
  }

  if (!onlineUsers.length) {
    return (
      <div className="str-chat__header-livestream">
        Sorry, nobody is online at the moment. A support agent has been
        notified.
      </div>
    );
  }

  return (
    <div className="str-chat__header-livestream">
      Currently online:
      {onlineUsers.map((value, index) => {
        return (
          <div key={index}>
            <Avatar image={value.image} name={value.name} />
            {value.name}
          </div>
        );
      })}
    </div>
  );
}

/**
 * A little interface for the user to setup their name and email before
 * The chat starts.
 */
export function GuestUserInput({ setChannel, ...props }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleSubmit = async event => {
    event.preventDefault();
    const userID = window.btoa(email).replace(/=/g, "");
    // in a real app you would do some round robin on active agents..
    const assignedSupportAgent = "support-agent-123";
    const user = await chatClient.setGuestUser({
      id: userID,
      name: name,
      email: email
    });
    const channel = chatClient.channel("commerce", userID, {
      members: [chatClient.user.id, assignedSupportAgent],
      assigned: assignedSupportAgent,
      status: "open"
    });
    channel.watch({ presence: true });

    setChannel(channel);
  };

  return (
    <div className="str-chat str-chat-channel commerce light">
      <div className="str-chat__container">
        <div className="str-chat__main-panel">
          <div className="str-chat__header-livestream">
            <div>
              Hi, feel free to ask any questions or share your feedback. We're
              happy to help!
              <Avatar image="https://pbs.twimg.com/profile_images/897621870069112832/dFGq6aiE_400x400.jpg" />
              <Avatar image="https://i.pravatar.cc/300" />
              <Avatar image="https://i.pravatar.cc/200" />
            </div>
          </div>
          <div className="str-chat__list ">
            <div>
              Hi, what's your name and email?
              <form onSubmit={handleSubmit}>
                <label>
                  Name:
                  <input
                    type="text"
                    value={name}
                    onChange={event => {
                      setName(event.target.value);
                    }}
                  />
                </label>
                <br />
                <label>
                  Email:
                  <input
                    type="text"
                    value={email}
                    onChange={event => {
                      setEmail(event.target.value);
                    }}
                  />
                </label>
                <br />
                <input type="submit" value="Submit" />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [open, setOpen] = React.useState(true);
  const [channel, setChannel] = React.useState(null);

  const toggle = () => {
    setOpen(!open);
  };

  function renderChat() {
    return (
      <Chat client={chatClient} theme={"commerce light"}>
        <Channel channel={channel}>
          <Window>
            <MyChannelHeader />

            <MessageList
              TypingIndicator={TypingIndicator}
              Message={MessageCommerce}
            />

            <MessageInput Input={MessageInputFlat} />
          </Window>
        </Channel>
      </Chat>
    );
  }

  let nodes = "";

  if (open) {
    if (channel) {
      nodes = renderChat();
    } else {
      nodes = <GuestUserInput setChannel={setChannel} />;
    }
  }

  return (
    <div className={`wrapper ${open ? "wrapper--open" : ""}`}>
      {nodes}
      <Button onClick={toggle} open={open} />
    </div>
  );
}

export default App;
