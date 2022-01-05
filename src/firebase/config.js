import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDEE8Js8iCA1jHHYWzZOnWkDJhKvgVdbH4',
  authDomain: 'splitwise-83ca0.firebaseapp.com',
  projectId: 'splitwise-83ca0',
  storageBucket: 'splitwise-83ca0.appspot.com',
  messagingSenderId: '28731846735',
  appId: '1:28731846735:web:c71c48fb172396b7eefa3a',
  measurementId: 'G-3YFM72C1BJ'
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
