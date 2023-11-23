const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore/lite");
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require("firebase/auth")

const firebaseConfig = {
  // replace with info your project...
  apiKey: "AIzaSyDGdrKAw2Aia-djw2TG6PEdLxZebMs0Bgk",
  authDomain: "next-crud-dev-neto.firebaseapp.com",
  projectId: "next-crud-dev-neto",
  storageBucket: "next-crud-dev-neto.appspot.com",
  messagingSenderId: "241596422946",
  appId: "1:241596422946:web:193e5e43c4625d4c11a37b"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);

const loginWithGoogle = {
  logarGoole: async(auth, email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user)
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      }
    );
  },
  criarComGoogle: async(auth, email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        return user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      }
    );
  }

}


module.exports = { auth, loginWithGoogle, appFirebase }
