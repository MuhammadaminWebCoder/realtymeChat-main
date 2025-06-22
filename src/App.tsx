import { useEffect } from 'react';
import './App.css'
import { UseAuthToken } from './middleware'
import { onAuthStateChanged } from 'firebase/auth';
import { setUserOnlineStatus } from './services/onlineStatus';
import { auth } from './firebase';
function App() {
  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserOnlineStatus(); // auth.currentUser aniq bo‘lganda chaqiramiz
    }
  });

  return () => unsub();
}, []);
  return (
    <div className='h-screen'>
      <UseAuthToken/>
    </div>
  )
}

export default App

