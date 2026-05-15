import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCCUjdAvEJ_vp6Ofw-X4eE9mlpTSpw6TQw',
  authDomain: 'codehive-chat.firebaseapp.com',
  projectId: 'codehive-chat',
  storageBucket: 'codehive-chat.firebasestorage.app',
  messagingSenderId: '86344417264',
  appId: '1:86344417264:web:05e04221ed45a1235ca735'
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)