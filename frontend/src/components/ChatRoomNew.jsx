import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { List, Stack, TextField, Button} from '@mui/material';
import { Box } from '@mui/system';


// some js functionality
var stompClient =null;
const ChatRoomNew = ({landing}) => {

    //some js functionaltiy
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });
    useEffect(() => {
      console.log(userData);
    }, [userData]);

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }
    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        connect();
    }

    // what is rendered 
    return (
        <div style={{ height: "inherit", width: "inherit"}}>
            {userData.connected?
                <Box sx={{
                    height: 'inherit',
                    width: 'inherit',
                    m: 2,
                    p: 1,
                    backgroundColor: 'pink',
                    borderRadius: '20px'
                }}
                >
                    <Stack
                    spacing={1}
                    direction="row"
                    width={"inherit"}
                    height={"inherit"}
                    alignItems="top"
                    >
                    <Box sx={{
                        width: "20%",
                        ml: 1,
                        mr: 1,
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        }}>
                        <Stack
                            sx={{
                            alignItems: 'left',
                            padding: 1
                        }}
                        >
                            <List sx={{width: "inherit", m: 1, p: 1, borderRadius: "20px"}} className={`member ${tab==="CHATROOM" && "active"}`} onClick={()=>{setTab("CHATROOM")}}>Chatroom</List>
                            {[...privateChats.keys()].map((name,index)=>(
                            <List sx={{width: "inherit", m: 1, p: 1, borderRadius: "20px"}} className={`member ${tab===name && "active"}`} onClick={()=>{setTab(name)}} key={index}>{name}</List>
                        ))}
                        </Stack>
                    </Box>
    
                    <Box 
                        sx={{
                        width: "100%",
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        }}>
                        
                        {tab==="CHATROOM" && <Box sx={{ height: "94%" }}>
                            <List sx={{ height: "inherit", width: "inherit", p: 1, overflowY: "scroll"}}>
                            {publicChats.map((chat,index)=>(
                            <List sx={{m:1, p:1, borderRadius:"10px"}} className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                {chat.senderName !== userData.username && <Box sx={{p:1}} className="avatar">{chat.senderName}</Box>}
                                <Box sx={{p:1}}>{chat.message}</Box>
                                {chat.senderName === userData.username && <Box sx={{p:1}} className="avatar self">{chat.senderName}</Box>}
                            </List>
                            
                        ))}
                        </List>
                        
                        <Stack direction="row" justifyContent="flex-end" sx={{ m: 1 }}>
                            <TextField type="text" variant='outlined' size='small' placeholder="Enter a message" value={userData.message} onChange={handleMessage}
                            sx={{width: "100%", borderColor: 'pink', ml: 2, mr: 2}}/> 
                            <Button type="button" variant="contained" sx={{ml: 1, mr: 2, backgroundColor: 'red', '&:hover':{backgroundColor: 'pink'}}} onClick={sendValue}>send</Button>
                        </Stack>
                    </Box>}

                    {tab!=="CHATROOM" && <Box sx={{ height: "94%" }}>
                        <List sx={{ height: "inherit", width: "inherit", p: 1, overflowY: "scroll"}}>
                            {[...privateChats.get(tab)].map((chat,index)=>(
                                <List sx={{m:1, p:1, borderRadius:"10px"}} className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <Box sx={{p:1}} className="avatar">{chat.senderName}</Box>}
                                    <Box sx={{p:1}}>{chat.message}</Box>
                                    {chat.senderName === userData.username && <Box sx={{p:1}} className="avatar self">{chat.senderName}</Box>}
                                </List>
                            ))}
                        </List>
                    
                        <Stack direction="row" justifyContent="flex-end" sx={{ m: 1 }}>
                            <TextField type="text" variant='outlined' size='small' placeholder="Enter a message" value={userData.message} onChange={handleMessage}
                            sx={{ width: '100%', borderColor: 'pink', ml: 2, mr: 2}}/> 
                            <Button type="button" variant="contained" sx={{ml: 1, mr: 2, backgroundColor: 'red', '&:hover':{backgroundColor: 'pink'}}} onClick={sendPrivateValue}>send</Button>
                        </Stack>                        
                    </Box>}
                </Box>
            </Stack>       
        </Box>
        :
        <div className="register">
            <input
                id="user-name"
                placeholder="Enter your name"
                name="userName"
                value={userData.username}
                onChange={handleUsername}
                margin="normal"
            />
            <button type="button" onClick={registerUser}>
                    connect
            </button> 
        </div>                          
        }
        </div>
    )
}

export default ChatRoomNew