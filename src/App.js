import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import firebase from "./firebase";

class App extends Component {
  constructor() {
    super();
    this.state = {
      messages: []
    };
  }

  componentDidMount() {
    this.loadMessages();
  }

  getProfilePicUrl() {
    return "";
  }

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
        <header>
          <div>
            <h1>Chat App</h1>
          </div>
        </header>
        <section>
          {this.state.messages.map(message => (
            <div key={message.key}>{`${message.text}`}</div>
          ))}
        </section>
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
          <input ref={node => (input = node)} />
        </form>
      </div>
    );
  }
}

export default App;
