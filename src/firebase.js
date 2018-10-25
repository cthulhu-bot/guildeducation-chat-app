import * as firebase from "firebase";

var config = {
  apiKey: "AIzaSyCiP5ojH9LAXyZpoGcR2vqgeikBDB7PunA",
  authDomain: "guildeducation-chat.firebaseapp.com",
  databaseURL: "https://guildeducation-chat.firebaseio.com",
  projectId: "guildeducation-chat",
  storageBucket: "guildeducation-chat.appspot.com",
  messagingSenderId: "564496880232"
};
firebase.initializeApp(config);

export default firebase;
