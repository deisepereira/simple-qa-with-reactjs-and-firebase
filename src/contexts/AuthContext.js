import { createContext, useState, useEffect } from 'react';

import {provider, auth } from "../services/firebase";
import { signInWithPopup,signOut } from "firebase/auth";

export const AuthContext = createContext({})

export function AuthContextProvider(props) {

    const [user, setUser] = useState();

    useEffect(()=>{
      const unsubscribe = auth.onAuthStateChanged(user => {
          if(user)  {
             const {displayName, photoURL, uid} = user
    
             if(!displayName){
                throw new Error('Missing information from Google Account')
             }
    
             setUser({
                id:uid,
                name:displayName, 
                avatar:photoURL         
             })
          }
       })
 
       return () => {unsubscribe()}
    }, [])
 
    async function signInWithGoogle() {
 
       const result = await signInWithPopup(auth, provider)
 
       if(result.user)  {
          const {displayName, photoURL, uid} = result.user
 
          if(!displayName){
             throw new Error('Missing information from Google Account')
          }
 
          setUser({
             id:uid,
             name:displayName, 
             avatar:photoURL           
          })
       }
    }

    async function signOutFromGoogle() {     
      signOut(auth).then(() => {
         window.location.reload()
       }).catch((error) => {
         // An error happened.
       });
    }

    return(
        <AuthContext.Provider value={{user, signInWithGoogle,signOutFromGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}