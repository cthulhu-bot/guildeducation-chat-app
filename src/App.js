import React, { Component } from "react";
import firebase from "./firebase";
import { ThemeProvider } from "mineral-ui/themes";
import Message from "./Message";
import "./App.css";

/**
 * Entering messages into the message box will be saved off and
 * redistributed to any other open tabs via the firebase subscription.
 * Entering a text message will randomly assign a hard coded user.
 */
class App extends Component {
  constructor() {
    super();
    this.state = {
      currentVal: "",
      messages: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * componentDidMount
   * Query for messages when the component first mounts
   */
  componentDidMount() {
    this.loadMessages();
  }

  handleChange(event) {
    this.setState({ currentVal: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!event.target[0].value.trim()) {
      return;
    }
    this.props.saveMessage
      ? this.props.saveMessage(event.target[0].value)
      : this.saveMessage(event.target[0].value);
    this.setState({ currentVal: "" });
  }

  /**
   * loadMessages
   * Registers the 2 firebase listeners: child_added and child_changed which
   * call updateMessages when something is updated in firebase which in turn
   * updates component state and kicks off the render cycle
   */
  loadMessages() {
    const updateMessages = snapshot => {
      const data = snapshot.val();
      const newMessage = {
        key: snapshot.key,
        name: data.name,
        text: data.text
      };
      const messages = this.state.messages;
      messages.push(newMessage);

      this.setState({
        messages: messages
      });
    };

    // listen for changes in firebase and updateState accordingly
    firebase
      .database()
      .ref("/messages/")
      .limitToLast(8)
      .on("child_added", updateMessages);
    firebase
      .database()
      .ref("/messages/")
      .limitToLast(8)
      .on("child_changed", updateMessages);
  }

  /**
   * saveMessage
   * Pushes messages from the textInput out to firebase
   * @param messageText
   */
  saveMessage(messageText) {
    const name = Math.floor(Math.random() * 2) === 0 ? "John Doe" : "Jane Doe";
    return firebase
      .database()
      .ref("/messages/")
      .push({
        name: name,
        text: messageText
      })
      .catch(function(error) {
        console.error("Error writing new message to firebase", error);
      });
  }

  render() {
    return (
      <ThemeProvider>
        <div className="App-messages">
          {this.state.messages.map(message => (
            <Message message={message} />
          ))}
          <form onSubmit={this.handleSubmit}>
            <input
              value={this.state.currentVal}
              onChange={this.handleChange}
              data-testid="input"
              className="App-messageBox"
            />
            <button
              className="App-messageButton"
              data-testid="inputButton"
              type="submit"
            >
              ^
            </button>
          </form>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
