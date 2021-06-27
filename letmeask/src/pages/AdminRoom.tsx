import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/rooms.scss'
import { useParams } from 'react-router'
//import { useAuth } from '../hooks/useAuth'
import {Question} from '../components/Question'
import { useRoom } from '../hooks/useRoom'

type RoomParams = {
    id: string;
}
export function AdminRoom()
{

    //const {user} = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const {title, questions} = useRoom(roomId);

    return(
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk"/>
                    <div>
                        <RoomCode code={roomId}/>
                        <Button isOutlined>Encerrar sala</Button>
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
                    />
                    );
                } )}
                </div>
            </main>
        </div>
        
    )
}