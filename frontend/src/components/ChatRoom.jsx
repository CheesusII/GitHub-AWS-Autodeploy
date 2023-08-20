import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import { List, Stack, TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import Logo from '../assets/logo_final.png';
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {generateUUID, replaceTextWithClass,getTextInsideDiv} from '../utility/customUtilFunctions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


let stompClient =null;
const ChatRoomNew = ({landing}) => {

    const [open, setOpen] = React.useState(false);
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [messageId,setMessageId] =useState("");
    const [editedTxt,setEditedTxt] =useState("");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: '',
      });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
          let chatMessage = {
            senderName: userData.username,
            status:"JOIN",
            msgId: generateUUID()
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onDisconnected = () => {
        setUserData({...userData,"connected": false});
        let chatMessage = {
            senderName: userData.username,
            status:"LEAVE",
            msgId: generateUUID()
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        let payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!(payloadData.senderName === "Server")){
                    if(!privateChats.get(payloadData.senderName)){
                        privateChats.set(payloadData.senderName,[]);
                        payloadData.onlineUsers.forEach((item) => {
                            privateChats.set(item,[]);
                        });
                        setPrivateChats(new Map(privateChats));
                    }
                }
                payloadData.senderName = "Server";
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            case "PICTURE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
            case "LEAVE":
                privateChats.delete(payloadData.senderName);
                setPrivateChats(new Map(privateChats));
                break;
            case "EDIT":
                replaceTextWithClass(getTextInsideDiv(payloadData.msgId), payloadData.message, payloadData.msgId);
                break;
            case "DELETE":
                replaceTextWithClass(getTextInsideDiv(payloadData.msgId), "Message has been deleted!", payloadData.msgId);
                break;
            default:
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        let payloadData = JSON.parse(payload.body);
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
        console.error(err);   
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const sendValue=()=>{
            if (stompClient) {
              let chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE",
                date: new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'}),
                msgId: generateUUID()
              };
              console.log(chatMessage);
                if(userData.message !== "" && userData.message !== null && userData.message !== undefined && userData.message.length < 280){
                    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
                    setUserData({...userData,"message": ""});
                } else {
                    alert("Message is empty or too long or has invalid characters");
                }
            }
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
            let chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                message: userData.message,
                status:"MESSAGE",
                date: new Date().toLocaleTimeString([], {hour12: false, hour: '2-digit', minute:'2-digit'}),
                msgId: generateUUID()
            };
            

            if(userData.message !== "" && userData.message !== null && userData.message !== undefined && userData.message.length < 280){
                if(userData.username !== tab){
                    privateChats.get(tab).push(chatMessage);
                    setPrivateChats(new Map(privateChats));
                }
                stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
                setUserData({...userData,"message": ""});
            } else {
                alert("Message is empty or too long or has invalid characters");
            }
        }
    }

    const handleUsername=(event)=>{
        const {value}=event.target;
        setUserData({...userData,"username": value});
    }

    const registerUser=()=>{
        connect();
    }

    window.onbeforeunload = function () {
        onDisconnected();
        stompClient.disconnect();
        landing();
        return "Do you really want to close?";
    };

    function handleClick() {
        onDisconnected();
        stompClient.disconnect();
        landing();
    }

    async function handleFile(event) {
        await getBase64(event.target.files[0]);
    }

    async function handleFilePrivate(event) {
        await getBase64Private(event.target.files[0]);
    }

    async function getBase64Private(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let chatMessage = {
                senderName: userData.username,
                receiverName:tab,
                status:"PICTURE",
                picture: String(reader.result),
                msgId: generateUUID()
                };
            if(userData.username !== tab){
                privateChats.get(tab).push(chatMessage);
                setPrivateChats(new Map(privateChats));
            }
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
        
    async function getBase64(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          let chatMessage = {
            senderName: userData.username,
            status:"PICTURE",
            picture: String(reader.result),
            msgId: generateUUID()
          };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };

        return reader.result;
     }

     function changePrevText(event) {
        stompClient.send("/app/message", {}, JSON.stringify({msgId: messageId, message: editedTxt, status: "EDIT"}));
        handleClose();
        }

    function syncMessageId(event) {
        let btnClicked = event.target;
        let btnClasses = btnClicked.classList
        let btnClass = btnClasses[2]
        setMessageId(btnClass);
    }

    function handleEditChange(event) {
        setEditedTxt(event.target.value);
    }

    async function deleteMessage(event) {
        let btnClicked = event.target;
        let btnClasses = btnClicked.classList
        let btnClass = btnClasses[2]
        stompClient.send("/app/message", {}, JSON.stringify({msgId: btnClass, message: "", status: "DELETE"}));
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'white',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    return (
        <div style={{ height: "inherit", width: "inherit"}}>
            {userData.connected?
                <Box sx={{
                    height: 'inherit',
                    width: 'inherit',
                    m: 2,
                    p: 1,
                    backgroundColor: 'black',
                    borderRadius: '20px'
                }}
                >
                    <Stack
                        width={"100%"}
                        height={"100%"}
                        alignItems={"flex-start"}
                    >
                        <img onClick={handleClick} src={Logo} alt="Logo_lion" style={{marginLeft: '50%', height:'7%'}}></img> 
                        <IconButton aria-label="home" component="label" onClick={handleClick}>
                            <ArrowBackIcon color="error" />
                        </IconButton>                        
                        <Box sx={{
                            height: '98%',
                            width: '98%',
                            m: 1,
                            p: 1,
                            backgroundColor: '#333333',
                            borderRadius: '20px'
                            }}
                        >
                        <Stack
                        spacing={1}
                        direction="row"
                        width={"100%"}
                        height={"100%"}
                        alignItems="top"
                        >
                        <Box sx={{
                            width: "20%",
                            ml: 1,
                            mr: 1,
                            backgroundColor: 'grey',
                            borderRadius: '20px',
                            }}>
                            <Stack
                                sx={{
                                alignItems: 'left',
                                padding: 1
                            }}
                            >
                                <List sx={{width: "inherit", m: 1, p: 1, borderRadius: "20px"}} className={`member ${tab==="CHATROOM" && "active"}`} onClick={()=>{setTab("CHATROOM")}}>Public Chat</List>
                                <List></List>
                                <List>&nbsp;Online now:</List>
                                {[...privateChats.keys()].map((name,index)=>(
                                <List sx={{width: "inherit", m: 1, p: 1, borderRadius: "20px"}} className={`member ${tab===name && "active"}`} onClick={()=>{setTab(name)}} key={index}>{name}</List>
                            ))}
                            </Stack>
                        </Box>
        
                        <Box 
                            sx={{
                            width: "100%",
                            backgroundColor: 'grey',
                            borderRadius: '20px',
                            }}>
                            
                            {tab==="CHATROOM" && <Stack sx={{ height: "100%" }}>
                                <List sx={{ height: "inherit", width: "inherit", p: 1, overflowY: "scroll"}}>
                                    {publicChats.map((chat,index)=>(
                                        <List sx={{m:1, p:1, borderRadius:"10px"}} className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                            {chat.senderName !== userData.username && <Stack direction="row">
                                                <Box sx={{p:1}}>{chat.date}</Box>
                                                <Box sx={{p:1}} className="avatar">{chat.senderName}</Box>
                                            </Stack>}
                                            {chat.status === "PICTURE" && <img src={`${chat.picture}`} alt="send drawing"></img>}
                                            <Box className={`${chat.msgId}`} sx={{p:1}}>{chat.message}</Box>
                                            {chat.senderName === userData.username && <Stack direction="row">
                                            <IconButton className={`${chat.msgId}`} aria-label="edit entry" component="label" onClick={(event) => {
                                                syncMessageId(event);
                                                handleOpen();
                                            }}>
                                                <EditIcon  className={`${chat.msgId}`}/>
                                            </IconButton>
                                            <IconButton className={`${chat.msgId}`} aria-label="delete entry" component="label" onClick={(event) => {
                                                deleteMessage(event);
                                            }}>
                                                <DeleteForeverIcon className={`${chat.msgId}`}/>
                                            </IconButton>
                                                                                            
                                            <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                                            Edit your message:
                                                        </Typography>
                                                        <Typography id="modal-modal-description" sx={{ mt: 2 }} />
                                                        <Stack direction="row">
                                                            <TextField id="outlined-basic" label="" variant="outlined" onChange={handleEditChange}/>
                                                            <Button className={""} type="submit" variant="contained" sx={{ml: 1, mr: 2, backgroundColor: '#cc0000', '&:hover':{backgroundColor: 'red'}}} onClick={changePrevText}>change</Button>
                                                        </Stack>
                                                    
                                                    </Box>
                                            </Modal>
                                                <Box sx={{p:1}} className="avatar self">{chat.senderName}</Box>
                                                <Box sx={{p:1}}>{chat.date}</Box>
                                            </Stack>}
                                        </List>
                                    ))}
                                </List>
                            
                                <Stack direction="row" sx={{ m: 1 }}>
                                    <TextField id="messageInput" type="text" variant='outlined' size='small' placeholder="Enter a message" value={userData.message} onChange={handleMessage}
                                    sx={{width: "100%", ml: 2, mr: 2, backgroundColor:'white'}}/> 
                                    <IconButton aria-label="upload picture" component="label">
                                        <input hidden id="pictureInput" accept="image/*" type="file"  onChange={handleFile} />
                                        <PhotoCamera />
                                    </IconButton>
                                    <Button type="submit" variant="contained" sx={{ml: 1, mr: 2, backgroundColor: '#cc0000', '&:hover':{backgroundColor: 'red'}}} onClick={sendValue}>send</Button>
                                </Stack>
                            </Stack>}

                            {tab!=="CHATROOM" && <Stack sx={{ height: "100%" }}>
                                <List sx={{ height: "inherit", width: "inherit", p: 1, overflowY: "scroll"}}>
                                {[...privateChats.get(tab)].map((chat,index)=>(
                                <List sx={{m:1, p:1, borderRadius:"10px"}} className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
                                    {chat.senderName !== userData.username && <Stack direction="row">
                                        <Box sx={{p:1, color:'text.white' }}>{chat.date}</Box>
                                        <Box sx={{p:1}} className="avatar">{chat.senderName}</Box>
                                    </Stack>}
                                    {chat.status === "PICTURE" && <img src={`${chat.picture}`} alt="send drawing"></img>}
                                    <Box className={`${chat.msgId}`} sx={{p:1}}>{chat.message}</Box>
                                    {chat.senderName === userData.username && <Stack direction="row">
                                        <Box sx={{p:1}} className="avatar self">{chat.senderName}</Box>
                                        <Box sx={{p:1}}>{chat.date}</Box>
                                    </Stack>}
                                </List>
                            ))}
                            </List>
                                <Stack direction="row" sx={{ m: 1 }}>
                                    <TextField type="text" variant='outlined' size='small' placeholder="Enter a message" value={userData.message} onChange={handleMessage}
                                    sx={{ width: '100%', ml: 2, mr: 2, backgroundColor:'white'}}/>
                                    <IconButton aria-label="upload picture" component="label">
                                        <input hidden id="pictureInput" accept="image/*" type="file"  onChange={handleFilePrivate} />
                                        <PhotoCamera />
                                    </IconButton> 
                                    <Button type="button" variant="contained" sx={{ml: 1, mr: 2, backgroundColor: '#cc0000', '&:hover':{backgroundColor: 'red'}}} onClick={sendPrivateValue}>send</Button>
                                </Stack>                        
                            </Stack>}
                        </Box>
                    </Stack>       
                </Box>
            </Stack>               
        </Box>
                
        :
        <div style={{ height: 'inherit', width: 'inherit' }}>
            <Stack spacing={10} sx={{height: 'inherit'}}>
                <img src={Logo} alt="Logo" style={{marginTop: '5%', alignSelf: 'center'}}></img>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Box
                    sx={{
                        alignItems: 'center',
                        width: '30%',
                        backgroundColor: '#333333',
                        padding: '30px',
                        borderRadius: '20px'
                    }}>
                        <Stack spacing={5} sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <Stack spacing={4} sx={{
                                justifyContent: 'center',
                                alignItems: 'center', 
                                width: 'inherit'}}>
                                <TextField id="usernameInput" value={userData.username} onChange={handleUsername} label='Username' variant='filled' size='small' sx={{ width: '50%', backgroundColor: 'white'}}>Enter Username</TextField>
                                <Button onClick={registerUser} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Join Room!</Button>
                                <Button onClick={landing} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Return</Button>
                            </Stack>
                        </Stack>
                    </Box>
                </div>
            </Stack>                                
        </div>                           
        }
    </div>
    )
}

export default ChatRoomNew