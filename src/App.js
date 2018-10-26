import React, { Component } from "react";
import firebase from "./firebase";
import styled from "styled-components";
import { ThemeProvider } from "mineral-ui/themes";
import Flex, { FlexItem } from "mineral-ui/Flex";
import { createStyledComponent } from "mineral-ui/styles";

const LeftMessage = createStyledComponent(FlexItem, {
  background: "#0b93f6",
  borderRadius: "25px",
  color: "white",
  lineHeight: "24px",
  marginBottom: "12px",
  marginRight: "300px",
  marginTop: "0.5rem",
  maxWidth: "255px",
  padding: "10px 20px",
  textAlign: "center",
  width: "50%",
  wordWrap: "break-word"
});

const RightMessage = createStyledComponent(FlexItem, {
  background: "#e5e5ea",
  borderRadius: "25px",
  color: "black",
  lineHeight: "24px",
  marginBottom: "12px",
  marginLeft: "300px",
  marginTop: "0.5rem",
  maxWidth: "255px",
  padding: "10px 20px",
  textAlign: "center",
  width: "50%",
  wordWrap: "break-word"
});

const MessageBox = styled.input`
  margin-top: 1rem;
  width: 320px;
  letter-spacing: 0.1em !important;
  text-indent: 3px;
  height: 50px;
  border-radius: 0px !important;
  margin-bottom: 100px;
`;

const Messages = styled.div`
  text-align: center;
`;

/**
 * Entering messages into the message box will be saved off and
 * redistributed to any other open tabs via the firebase subscription.
 * Entering a text message will randomly assign a hard coded user.
 */
class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  /**
   * componentDidMount
   * Query for messages when the component first mounts
   */
  componentDidMount() {
    this.loadMessages();
  }

  getProfilePicUrl() {
    return "";
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
        text: data.text,
        profilePicUrl: data.profilePicUrl,
        imageUrl: data.imageUrl
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
        text: messageText,
        profilePicUrl: this.getProfilePicUrl()
      })
      .catch(function(error) {
        console.error("Error writing new message to firebase", error);
      });
  }

  render() {
    let input;

    return (
      <ThemeProvider>
        <Messages>
          {this.state.messages.map(message => (
            <Flex justifyContent={"center"}>
              {message.name === "Jane Doe" ? (
                <LeftMessage key={message.key}>{`${message.text}`}</LeftMessage>
              ) : (
                <RightMessage key={message.key}>{`${
                  message.text
                }`}</RightMessage>
              )}
            </Flex>
          ))}
          <form
            onSubmit={e => {
              e.preventDefault();
              if (!input.value.trim()) {
                return;
              }
              this.saveMessage(input.value);
              input.value = "";
            }}
          >
            <MessageBox ref={node => (input = node)} />
          </form>
        </Messages>
      </ThemeProvider>
    );
  }
}

export default App;
