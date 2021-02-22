import React,{useRef,useState} from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA8MG6FGyQ0kL1MP_cLO05lWqZcvT2XN8Y",
  authDomain: "web-service-45649.firebaseapp.com",
  projectId: "web-service-45649",
  storageBucket: "web-service-45649.appspot.com",
  messagingSenderId: "201537777453",
  appId: "1:201537777453:web:90cba1b438f2881ab36da4",
  measurementId: "G-PRS458H7Y4"

})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return (
    <button onClick={signInWithGoogle}>Logar com o Google</button>
  )
}
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sair</button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue,setFormValue] = useState('');
  const sendMessage = async(e)=>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');
    dummy.current.scrollIntoView({bahavior:'smooth'})
  }
  return (
    <>
    <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <span ref={dummy}></span>
    </main>
      <form onSubmit={sendMessage}>''
        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} placeholder='Diga algo'></input>
        <button type='submit' disabled={!formValue}>Enviar</button>
      </form>
    </>
  )
}
function ChatMessage(props) {
  const { text, uid, photoURL} = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'send' : 'received';
  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}></img>
      <p>{text}</p>
    </div>
  </>)
}

export default App;
