import './answer.css'
export function Answer({   
    content,
    author       
}){
    return (
        <div className={`answer 
       `}>
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt=""/>
                    <span>{author.name}</span>
                </div>                
            </footer>
        </div>
    )
}