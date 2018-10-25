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
    const updateMessages = dataSnapshot => {
      const data = dataSnapshot.val();
      this.setState(
        Object.assign(this.state, {
          key: dataSnapshot.key,
          name: data.name,
          text: data.text,
          profilePicUrl: data.profilePicUrl,
          imageUrl: data.imageUrl
        })
      );
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
    return (
      <div className="App">
        <header>
          <div>
            <h1>Chat App</h1>
          </div>
        </header>
        <section>
          {this.state.messages.map(message => (
            <div>{`${message}`}</div>
          ))}
        </section>
        <form>
          <input type="text" name="inputText" />
        </form>
      </div>
    );
  }
}

export default App;
