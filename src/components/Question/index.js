import './question.css'
import { Link} from 'react-router-dom'

export function Question({
    link,
    content,
    author       
}){
    return (
        <div className={`question 
       `}>
            <Link to={`/question/${link}`}>{content}</Link>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt=""/>
                    <span>{author.name}</span>
                </div>                
            </footer>
        </div>
    )
}