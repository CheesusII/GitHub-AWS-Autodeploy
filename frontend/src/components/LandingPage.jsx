import React, { useState } from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import Logo from '../assets/logo_draft.png';
import CreateRoomPage from './CreateRoomPage';
import JoinRoomPage from './JoinRoomPage';

export default function LandingPage({chatting}) {
    const [toggle, setToggle] = useState(0)
    const createRoom = () => setToggle(1)
    const joinRoom = () => setToggle(2)
    const resetToggle = () => setToggle(0)    

    return (
    <div style={{height: 'inherit', width: 'inherit'}}>
        <Stack spacing={10} sx={{height: 'inherit'}}>
            <img src={Logo} alt="Logo" style={{ marginTop: '2%', alignSelf: 'center'}}></img>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Box
                sx={{
                    alignItems: 'center',
                    width: '30%',
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '20px'
                }}>
                    <Stack spacing={5} sx={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}>
                        {toggle===1 && <CreateRoomPage resetToggle={resetToggle} chatting={chatting} />}
                        {toggle===2 && <JoinRoomPage resetToggle={resetToggle} chatting={chatting} />}
                        {toggle===0 &&<Button onClick={createRoom} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Create Room</Button>}
                        {toggle===0 &&<Button onClick={joinRoom} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Join Room</Button>}
                        
                    </Stack>
                </Box>
            </div>
        </Stack>
    </div>    
  )
};

