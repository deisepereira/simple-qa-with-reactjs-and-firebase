import {useParams} from 'react-router-dom'
import { useState,useEffect} from 'react'

import {database} from '../services/firebase'
import {Button} from '../components/Button'
import {Answer} from '../components/Answer'
import {Header} from '../components/Header'
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'

import {ref,push,onValue,off } from 'firebase/database'

import '../styles/question.css'

export function Question(){

    const {user} = useContext(AuthContext)

    const [answers, setAnswers] = useState([])

    const [newAnswer, setNewAnswer] = useState('')  
    
    const [title, setTitle] = useState('')

    const params = useParams()
    const questionId = params.id;

    async function handleSendAnswer(event) {
        event.preventDefault()        

        if(newAnswer.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in')
        }        

        await push(ref(database, `questions/${questionId}/answers`) , {
            content: newAnswer,
            author: {                
                name:user.name,
                avatar:user.avatar
            }
        });          

        setNewAnswer('')
    }

    useEffect(() => {          

        const questionRef = ref(database,  `questions/${questionId}`)        
       
        onValue(questionRef, (question) => {
          
           const databaseQuestion = question.val()

           console.log(databaseQuestion)
           
           const firebaseAnswers = databaseQuestion.answers ?? {}
        
           const parsedAnswers = Object.entries(firebaseAnswers).map(([key,value]) => {
             return{
               id:key,
               content: value.content,
               author: value.author               
             }
         })   
         setTitle(databaseQuestion.content)
         setAnswers(parsedAnswers)
       })   

       return () => {
        off(questionRef,'value')
      }      
    
     }, [])

    return (
        <div id="page-question">            
             <Header/>             
            <main>  
            <h1>{title}</h1>          
                <div className="main-content"> 

                 <form onSubmit={handleSendAnswer}>
                    <textarea 
                    placeholder="Send your answer"
                    onChange={event => setNewAnswer(event.target.value)}
                    value={newAnswer}
                    />
                    <div className="form-footer">                       
                        <Button type="submit" disabled={!user}>Send Answer
                        </Button>
                        {!user && (
                            <p>To send a answer you must <span>
                             Sign In</span></p>
                       ) }
                    </div>
                </form>

                <div className="answers-length">{answers.length >0 && <span>{answers.length} answer(s)</span>}</div>                
                   <div className="answer-list">
                 {answers.map(answer => {
                    return (
                        <Answer
                        key={answer.id}                       
                        content={answer.content}
                        author={answer.author}                        
                        >                      
                        </Answer>
                    )
                })}
              </div> 
                            
                             
                </div>
            </main>
        </div>
    )
}