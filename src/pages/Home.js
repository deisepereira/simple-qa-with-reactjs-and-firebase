import {database} from '../services/firebase'
import {Button} from '../components/Button'
import {Header} from '../components/Header'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'

import { useState,useEffect } from 'react'

import '../styles/home.css'
import {ref,push,off, onValue } from 'firebase/database'

import { Question } from '../components/Question'

export function Home(){    
  
    const {user} = useContext(AuthContext)

    const [questions, setQuestions] = useState([])

    const [newQuestion, setNewQuestion] = useState('')   
    
    async function handleSendQuestion(event) {
        event.preventDefault()        

        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in')
        }        

        await push(ref(database, 'questions') , {
            content: newQuestion,
            author: {                
                name:user.name,
                avatar:user.avatar
            }
        });          

        setNewQuestion('')
    }

    useEffect(() => {          

        const questionsRef = ref(database, 'questions')        
       
        onValue(questionsRef, (question) => {
          
           const firebaseQuestions = question.val() ?? {}         
        
           const parsedQuestions = Object.entries(firebaseQuestions).map(([key,value]) => {
             return{
               id:key,
               content: value.content,
               author: value.author               
             }
         })       
         setQuestions(parsedQuestions)
       })   

       return () => {
        off(questionsRef,'value')
      }      
    
     }, [])
   
   
    return (
        <div id="page-home"> 
             <Header/>
            <main>            
                <div className="main-content"> 

                 <form onSubmit={handleSendQuestion}>
                    <textarea 
                    placeholder="what do you want to ask?"
                    onChange={event => setNewQuestion(event.target.value)}
                    value={newQuestion}
                    />
                    <div className="form-footer">                       
                        <Button type="submit" disabled={!user}>Send Question
                        </Button>
                        {!user && (
                            <p>To send a question you must <span>
                             Sign In</span></p>
                       ) }
                    </div>
                </form>
                <div className="questions-length">{questions.length >0 && <span>{questions.length} question(s)</span>}</div>                
                   <div className="question-list">
                 {questions.map(question => {
                    return (
                        <Question
                        key={question.id} 
                        link={question.id}
                        content={question.content}
                        author={question.author}                        
                        >                      
                        </Question>
                    )
                })}
              </div>              
                             
                </div>
            </main>
        </div>
    )
}