import React from "react";
import PropTypes from "prop-types";
import {
  Chat,
  Channel,
  Window,
  MessageList,
  TypingIndicator,
  MessageInputFlat,
  MessageCommerce,
  MessageInput,
  withChannelContext,
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
 * A little interface for the user to setup their name and email before
 * The chat starts.
 */
class GuestUserInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: ""
    };
  }

  handleNameChange = event => {
    this.setState({ name: event.target.value });
  };

  handleEmailChange = event => {
    this.setState({ email: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const userID = window.btoa(this.state.email).replace(/=/g, "");
    // in a real app you would do some round robin on active agents..
    const assignedSupportAgent = "support-agent-123";
    this.user = await chatClient.setGuestUser({
      id: userID,
      name: this.state.name,
      email: this.state.email
    });
    const channel = chatClient.channel("commerce", userID, {
      members: [chatClient.user.id, assignedSupportAgent],
      assigned: assignedSupportAgent
    });
    channel.watch({ presence: true });

    this.props.setChannel(channel);
  };

  render() {
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
                <form onSubmit={this.handleSubmit}>
                  <label>
                    Name:
                    <input
                      type="text"
                      value={this.state.name}
                      onChange={this.handleNameChange}
                    />
                  </label>
                  <br />
                  <label>
                    Email:
                    <input
                      type="text"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
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
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      channel: null
    };
  }

  setChannel = channel => {
    this.setState({ channel });
  };

  toggleDemo = () => {
    this.setState({ open: !this.state.open });
  };

  renderChat() {
    return <div>nochat just yet</div>;
  }

  render() {
    let nodes = "";

    if (this.state.open) {
      if (this.state.channel) {
        nodes = this.renderChat();
      } else {
        nodes = <GuestUserInput setChannel={this.setChannel} />;
      }
    }

    return (
      <div className={`wrapper ${this.state.open ? "wrapper--open" : ""}`}>
        {nodes}
        <Button onClick={this.toggleDemo} open={this.state.open} />
      </div>
    );
  }
}

export default App;
