import React, { PureComponent } from 'react';
import { Chat, Channel, ChannelHeader, Thread, Window } from 'stream-chat-react';
import { MessageList, TypingIndicator, MessageInputFlat, MessageCommerce, MessageInput, withChannelContext, Avatar } from 'stream-chat-react';
import { StreamChat } from 'stream-chat';
import PropTypes from 'prop-types';


import 'stream-chat-react/dist/css/index.css';

const chatClient = new StreamChat('2fp7wkq6nhhu');


// in a real app you would do some round robin on active agents..
const assignedSupportAgent = 'support-agent-123'




const Button = ({ open, onClick }) => (
  <div
    onClick={onClick}
    className={`button ${open ? 'button--open' : 'button--closed'}`}
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


class MyChannelHeader extends PureComponent {
  static propTypes = {
    /** Via Context: the channel to render */
    channel: PropTypes.object.isRequired,
    /** Set title manually */
    title: PropTypes.string,
    /** Via Context: the number of users watching users */
    watcher_count: PropTypes.number,
    /** Show a little indicator that the channel is live right now */
    live: PropTypes.bool,
  };

  handleUserPresenceChange = () => {
    console.log('user presence change');
    this.setState({members: this.props.channel.state.members})
  }

  // TODO: connect the .on
  //
  //
  //
  componentDidMount() {
    this.props.channel.on('user.presence.changed', this.handleUserPresenceChange)
  }

  componentWillUnmount() {
    this.props.channel.off('user.presence.changed', this.handleUserPresenceChange)
  }

  renderOnline() {
    const onlineUsers = []
    console.log(this.props.channel.state.members);
    if (this.props.channel.state.members) {
      for (let m of Object.values(this.props.channel.state.members)) {
        if (m.user.online) {
          onlineUsers.push(m.user);
        }
      }
    }


    return (
      <ul>
        {onlineUsers.map((value, index) => {
          return <li key={index}>{value.name} - {value.id}</li>
        })}
      </ul>
    )
  }

  render() {
    return (
      <div className="str-chat__header-livestream">
        {this.renderOnline()}

        <div className="str-chat__header-livestream-left">
          <p className="str-chat__header-livestream-left--title">
            {this.props.title || this.props.channel.data.name}{' '}
            {this.props.live && (
              <span className="str-chat__header-livestream-left--livelabel">
                live
              </span>
            )}
          </p>
          {this.props.channel.data.subtitle && (
            <p className="str-chat__header-livestream-left--subtitle">
              {this.props.channel.data.subtitle}
            </p>
          )}
          <p className="str-chat__header-livestream-left--members">
            {!this.props.live && this.props.channel.data.member_count > 0 && (
              <>{this.props.channel.data.member_count} members, </>
            )}
            {this.props.watcher_count} online
          </p>
        </div>

      </div>
    );
  }
}

MyChannelHeader = withChannelContext(MyChannelHeader);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      name: "",
      email: "",
      channel: null,
    };
  }

  toggleDemo = () => {
    if (this.state.open) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true });
    }
  };

  handleNameChange = (event) => {
    this.setState({name: event.target.value});
  }

  handleEmailChange = (event) =>  {
    this.setState({email: event.target.value});
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const userID = window.btoa(this.state.email).replace("=", "");
    console.log('userid', userID);
    this.user = await chatClient.setGuestUser({ id: userID, name: this.state.name, email: this.state.email });
    console.log("got id back", chatClient.user.id);
    const channel = chatClient.channel('commerce', userID, {members: [chatClient.user.id, assignedSupportAgent], assigned: assignedSupportAgent});
    channel.watch({presence: true})

    this.setState({channel: channel})
  }

  renderGuestUserUI() {
    return   (
        <div>
       Hi, what's your name and email?
       <form onSubmit={this.handleSubmit}>
         <label>
           Name:
           <input type="text" value={this.state.name} onChange={this.handleNameChange} />
         </label>
         <label>
           Email:
           <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
         </label>
         <input type="submit" value="Submit" />
         </form>
      </div>
    )
  }

  renderChat() {
    return (
      <Chat client={chatClient} theme={'commerce light'}>
      <Channel channel={this.state.channel}>
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
  )
  }

  render() {
    let nodes = ''

    if (this.state.open) {
      if (this.state.channel) {
        nodes = this.renderChat();
      } else {
        nodes = this.renderGuestUserUI();
      }
    }


    console.log("nodes is", nodes);


    return (
      <div className={`wrapper ${this.state.open ? 'wrapper--open' : ''}`}>
        {nodes}
        <Button onClick={this.toggleDemo} open={this.state.open} />
      </div>
    );
  }
}

export default App;
