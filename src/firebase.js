import firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBqPquWUVi6KlvgIQN_zNer3pLHd6uGPfU",
    authDomain: "reactproject-10e50.firebaseapp.com",
    databaseURL: "https://reactproject-10e50.firebaseio.com",
    projectId: "reactproject-10e50",
    storageBucket: "reactproject-10e50.appspot.com",
    messagingSenderId: "737413681141",
    appId: "1:737413681141:web:97444676760858d9eb1abc",
    measurementId: "G-8FYGN34H9D"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase