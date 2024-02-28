import { useEffect, useState } from 'react';
import './App.css';
import image from './assets/iconP.jpg';
import image2 from './assets/nImage.png';
import Qr from './assets/qrcode.png';
import send from './assets/send.png';
import  socket  from 'socket.io-client';

const io = socket('http://localhost:4000');

//Obrigatório:
//-melhorar a tela de inserir nome (Feito)
//-colocar o nome acima da mensagem (Feito)
//-criar outros chats a partir da documentação do socket.io(principalmente as partes de rooms)

//opicionais:
//-implementar sistema de conta e login
//-mostrar a quantidade de mensagens não lidas
//-transição em diferentes conversas
//-poder fixar conversas


function App() {
  const [name, setName] = useState("");
  const [join, setJoin] = useState(false);
  const [users, setUsers] = useState([]);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("ProfProg");

  console.log(messages)


  useEffect(()=>{
    
    io.on("users", (users)=>setUsers(users))
    io.on("message", (message)=> setMessages((messages)=>[...messages, message]))
    io.on("connection", (socket)=> console.log(socket.id));
    console.log(`messages: ${messages}`);
  }, [])

  const handleJoin =()=>{
    if(name){
      io.emit( "join", name)
      setJoin(true)
    }
  }

  const logar =()=>{
    io.emit("joinRoom", room);
  }

  const handleMessage =()=>{
    if(content){
      io.emit("message", {content, room, name});
      setContent("");
    }
  }

  if(!join){
    return(

      <div className='container'>
        <div className='background'></div>

        <div className='loginCont'>
          <div className='inputArea'>
            <span>Informe seu nome</span>      
            <div>
              <input value={name} onChange={(e)=>setName(e.target.value)}/>
            </div>
            <div>
              <button onClick={()=>handleJoin()}>Entrar</button>
            </div>
          </div>
          
          <div className='qrArea'>
            <div>
              <span>Logue a partir do Qr code</span>
            </div>

            <div>
              <img src={Qr} className='qr-img'/>
            </div>
          </div>
        </div>
      </div>
    )
  }




  return (
    <div className='container'>
        <div className='background'></div>
        <div className='chatCont'>
          <div className='chat-contact'>
            <div className='chat-option'></div>
            
            <div className='chat-item' onClick={()=>(setRoom("ProfProg"), logar())}>
            <img src={image} className='image-profile' alt=''/>
              <div className='title-chat-cont'>
                  <span className='title-message'>NetWorking Profissão Programador</span>
                  <span className='last-message'>
                    {messages.length? `${messages[messages.length -1].name}: ${messages[messages.length -1].content}`: ''}
                  </span>
              </div>
            </div>

            <div className='chat-item' onClick={()=>(setRoom("teste"), logar())}>
              <img src={image2} className='image-profile' alt=''/>
              <div className='title-chat-cont'>
                  <span className='title-message'>Sala de Testes</span>
                  <span className='last-message'>
                    {messages.length? `${messages[messages.length -1].name}: ${messages[messages.length -1].content}`: ''}
                  </span>
              </div>
            </div>

          </div>
          
          <div className='chat-message'>
            <div className='chat-option'>
              <div className='chat-item '>
                <img src={image} className='image-profile' alt=''/>
                <div className='title-chat-cont'>
                    <span className='title-message'>NetWorking Profissão Programador</span>
                    <span className='last-message'>
                      {users.map((user, index)=>(
                        <span>{user.name}{index + 1 < users.length? ', ': ''}</span>
                      ))}
                    </span>
                </div>
              </div>
            </div>

              
            <div className='chat-message-area'>
               {messages.map((message, index)=> (                   
                  <div className={message.name === name? 'User_Cont Right':'User_Cont Left'}>
                  <div key={index} className={message.name === name? 'User_My_Message':'User_Other_Message'}>
                    <div>
                      {message.name}
                    </div>
                    <span className='mensagem'>
                      {message.content}
                    </span>
                  </div>
                </div>
                ))}
            </div>

            <div className='chat-input-area'>
              <input className='chat-input' placeholder='Mensagem'
               value={content}
               onChange={(e)=> setContent(e.target.value)}
              />
              <img src={send} alt=''className='send-icon' onClick={()=> handleMessage()}/>
            </div>
          </div>



        </div>
      </div>
  );
}

export default App;
