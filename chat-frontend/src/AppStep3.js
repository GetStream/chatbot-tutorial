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

function App () {
  const [open, setOpen] = React.useState(true);
  const [channel, setChannel] = React.useState(null);

  const toggle = () => {
    setOpen(!open);
  };

  return (
    <div className={`wrapper ${open ? "wrapper--open" : ""}`}>
      <Button onClick={toggle} open={open} />
    </div>
  );
}

export default App;
