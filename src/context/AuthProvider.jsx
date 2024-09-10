import { createContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  getIdToken
} from 'firebase/auth';
import { app } from '../firebase/firebase.config';
import axios from 'axios';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveTokenToLocalStorage = async (user) => {
    try {
      const token = await getIdToken(user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error saving token to localStorage:', error);
    }
  };

  const createUser = async (email, password, name, photo) => {
    try {
      setLoading(true);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateUserProfile(name, photo);

      const response = await axios.post('https://pet-adoption-server-alpha.vercel.app/api/users/register', {
        name,
        email: user.email,
        password,
        photo
      });

      await saveTokenToLocalStorage(user);

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveTokenToLocalStorage(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      await saveTokenToLocalStorage(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithFacebook = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, facebookProvider);
      await saveTokenToLocalStorage(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with Facebook:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, githubProvider);
      await saveTokenToLocalStorage(result.user);
      return result;
    } catch (error) {
      console.error('Error signing in with Github:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (name, photo) => {
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const emailEncoded = encodeURIComponent(currentUser.email);
          const response = await axios.get(`https://pet-adoption-server-alpha.vercel.app/api/users/email/${emailEncoded}`);
          const userData = response.data;
          if (userData) {
            currentUser.role = userData.role;
            await saveTokenToLocalStorage(currentUser);
          } else {
            console.log('User not found in the database');
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log('User not found, might be a new user');
          } else {
            console.error('Error fetching user:', error);
          }
        }
      }
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  
  

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    signInWithFacebook,
    signInWithGithub,
    logOut,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
