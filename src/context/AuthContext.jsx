import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { useState, useEffect, useContext, createContext } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()
export function AuthProvider(props) {
  const { children } = props
  const [globalUser, setGlobalUser] = useState(null)
  const [globalData, setGlobalData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    setGlobalUser(null)
    setGlobalData(null)
    return signOut(auth)
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email)
  }

  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
    resetPassword,
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('CURRENT USER: ', user)
      setGlobalUser(user)
      if (!user) {
        console.log('No active user')
        return
      }
      try {
        setIsLoading(true)
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        let firebaseData = {}
        if (docSnap.exists()) {
          console.log('Data found in database')
          firebaseData = docSnap.data()
        }
        setGlobalData(firebaseData)
      } catch (error) {
        console.log(error.message)
      } finally {
        setIsLoading(false)
      }
    })

    // clean-up function
    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom Hook
export function useAuth() {
  return useContext(AuthContext)
}
