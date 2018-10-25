import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "./firebase";
import styled from "styled-components";

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const MessageEntryLeft = styled.div`
  width: 50%;
  word-wrap: break-word;
  text-align: center;
  background: #0b93f6;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  max-width: 255px;
  margin-bottom: 12px;
  line-height: 24px;
  margin-left: 3rem;
  margin-top: 1rem;
`;

const MessageEntryRight = styled.div`
  width: 50%;
  max-width: 255px;
  word-wrap: break-word;
  text-align: center;
  background: #e5e5ea;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
`;

const MessageBox = styled.input`
  margin-top: 1rem;
  border-radius: 25px;
  margin-bottom: 2rem;
  width: 320px;
  letter-spacing: 0.1em !important;
  text-indent: 5px;
  height: 55px;
  margin: 7px 0 3px 0;
  border-radius: 0px !important;
  border: 1px solid #dcdcdc !important;
  box-shadow: none !important;
`;

const Title = styled.h1`
  text-align: left;
  padding-bottom: 1rem;
  padding-left: 3rem;
  padding-top: 1rem;
  background-color: blue;
  color: white;
  margin: 0;
`;

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
      .limitToLast(12)
      .on("child_added", updateMessages);
    firebase
      .database()
      .ref("/messages/")
      .limitToLast(12)
      .on("child_changed", updateMessages);
  }

  /**
   * saveMessage
   * Pushes messages from the textInput out to firebase
   * @param messageText
   */
  saveMessage(messageText) {
    return firebase
      .database()
      .ref("/messages/")
      .push({
        name: "Jane Doe",
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
      <div className="App">
        <Section>
          {this.state.messages.map(message => (
            <MessageEntryLeft key={message.key}>{`${
              message.text
            }`}</MessageEntryLeft>
          ))}
        </Section>
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
      </div>
    );
  }
}

export default App;
