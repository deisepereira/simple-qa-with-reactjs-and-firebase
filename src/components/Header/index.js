import './header.css'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext'

import {Link} from 'react-router-dom'

import googleIconImg from '../../assets/images/google-icon.svg'

export function Header(){  

    const {user, signInWithGoogle,signOutFromGoogle} = useContext(AuthContext)

    async function handleSignIn(){   
        if(!user){
            await signInWithGoogle()
        }               
    }

    async function handleSignOut(){ 
        if(user){
        await signOutFromGoogle()          
        }          
    }

    return (
        <header>
        <div className="content">
            <h1><Link to="/">Simple Q&amp;A</Link></h1>
            {user ? (
                   <div className="user-info">
                        <img src={user.avatar} alt=""/>
                        <span>{user.name}</span>
                        <button onClick={handleSignOut} className="sign-out">
                          Sign out  
                        </button> 
                   </div>
               ) : (
                <button onClick={handleSignIn} className="sign-in">
                  <img src={googleIconImg} alt="Logo da Google"/>
                  Sign in 
                </button> 
               )}                   
        </div>
    </header>  
    )
}