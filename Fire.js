import firebase from "firebase";
import "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA9KQFKgoUcsOOrJJL_Yaa3rsOkYeUNZKA",
  authDomain: "todo-list-3ae56.firebaseapp.com",
  databaseURL: "https://todo-list-3ae56.firebaseio.com",
  projectId: "todo-list-3ae56",
  storageBucket: "todo-list-3ae56.appspot.com",
  messagingSenderId: "448119273742",
  appId: "1:448119273742:web:c1075d5b892dc34edf3f5f",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy("title");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];

      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;

    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;

    ref.doc(list.id).update(list);
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  detach() {
    this.unsubscribe();
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }
}

export default Fire;
