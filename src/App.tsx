// App.tsx
import './App.css';
import { UseAuthToken } from './middleware';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { useEffect } from 'react';
import { useContactInfo } from './store/zustandStore';
import { setUserOnlineStatus } from './services/onlineStatus';

function App() {
  const {
    setCurrentUser,
    setIsUserLoaded,
    isUserLoaded
  } = useContactInfo();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        localStorage.setItem("accessToken", token);

        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Foydalanuvchi",
          photoURL: user.photoURL,
          username: user.displayName || "Foydalanuvchi",
        };

        setCurrentUser(userData);
        setUserOnlineStatus();
      } else {
        setCurrentUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");
      }

      setIsUserLoaded(true); // ✅ Auth tekshiruvi tugadi
    });

    return () => unsub();
  }, [setCurrentUser, setIsUserLoaded]);

  return (
    <div className="h-screen">
      <UseAuthToken />
    </div>
  );
}

export default App;
