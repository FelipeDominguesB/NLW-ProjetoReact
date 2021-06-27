import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/rooms.scss'
import { useState, FormEvent } from 'react'
import { useParams } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useEffect } from 'react';
import {Question} from '../components/Question'
type RoomParams = {
    id: string;
}

type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    },
    content : string;
    isHighlighted: boolean,
    isAnswered: boolean 
}>

type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    },
    content : string;
    isHighlighted: boolean,
    isAnswered: boolean 

}
export function Room()
{

    const {user} = useAuth();
    const [newQuestion, setnewQuestion] = useState('');
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('')
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)
        
        roomRef.on('value', room =>{
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions;
            const parsedQuestions =Object.entries(firebaseQuestions).map(([key, value]) =>{
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            });
            setTitle(databaseRoom.setTitle);
            setQuestions(parsedQuestions);
        });
    }, [roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault(); 
        if(newQuestion.trim() === '') return;

        if(!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighlighted: false,
            isAnswered: false 
        };
        
        await database.ref(`/rooms/${roomId}/questions`).push(question);

        setnewQuestion('');
    }
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk"/>
                    <RoomCode code={roomId}/>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>

                    {questions.length > 0 && <span>{questions.length} perguntas</span>} 
                    
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar?"
                        onChange={event => setnewQuestion(event.target.value)}
                        value={newQuestion}
                        
                    />
                    <div className="form-footer">
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div> 
                        ) : (
                            <div>

                            </div>
                        )}
                        
                        <Button type="submit" disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>
                
                

                <div className="question-list">
                {questions.map(item => {
                    return (
                    <Question
                        content={item.content} 
                        author={item.author}
                        key={item.id}
                    />
                    );
                } )}
                </div>
            </main>
        </div>
        
    )
}