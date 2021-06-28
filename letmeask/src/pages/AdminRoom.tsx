import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/rooms.scss'
import { useParams } from 'react-router'
//import { useAuth } from '../hooks/useAuth'
import {Question} from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { database } from '../services/firebase'
import { useHistory } from 'react-router-dom'

type RoomParams = {
    id: string;
}
export function AdminRoom()
{

    //const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const history = useHistory();
    const {title, questions} = useRoom(roomId);

    async function handleEndRoom()
    {
        database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        });
        history.push('/');
    }
    async function handleDeleteQuestion(questionId: string)
    {
        if(window.confirm("Tem certeza que quer deletar essa pergunta?"))
        {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string)
    {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
         });
    }

    async function handleHighlightQuestion(questionId: string)
    {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }
    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>

                    {questions.length > 0 && <span>{questions.length} perguntas</span>} 
                    
                </div>
            
                <div className="question-list">
                {questions.map(item => {
                    return (
                    <Question
                        content={item.content} 
                        author={item.author}
                        key={item.id}
                        isAnswered={item.isAnswered}
                        isHighlighted={item.isHighlighted}
                    >
                        {!item.isAnswered && (
                            <>

                            <button type="button" onClick={() => handleCheckQuestionAsAnswered(item.id)}> 
                            <img src={checkImg} alt="Marcar pergunta como respondida"/>
                            </button>

                            <button type="button" onClick={() => handleHighlightQuestion(item.id)}> 
                            <img src={answerImg} alt="Dar destasque a pergunta"/>
                            </button>

                            </>
                        )}

                        <button type="button" onClick={() => handleDeleteQuestion(item.id)}> 
                            <img src={deleteImg} alt='Remover pergunta'/>
                        </button>

                    </Question>
                    );
                } )}
                </div>
            </main>
        </div>
        
    )
}