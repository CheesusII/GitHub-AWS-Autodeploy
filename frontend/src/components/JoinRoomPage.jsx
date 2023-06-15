import React from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function JoinRoomPage({resetToggle, chatting}) {
  
  return (
    <div style={{ height: 'inherit', width: 'inherit' }}>
      <Stack spacing={4} sx={{
          justifyContent: 'center',
          alignItems: 'center', 
          width: 'inherit'}}>
          <TextField id='Username' label='Username' variant='outlined' size='small' sx={{ width: '50%', borderColor: 'pink'}}>Enter Username</TextField>
          <TextField id='roomId' label='Room ID' variant='outlined' size='small' sx={{ width: '50%', borderColor: 'pink'}}>Enter Room ID</TextField>
          <Button onClick={chatting} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Join Room!</Button>
          <Button onClick={resetToggle} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Return</Button>  
      </Stack>
                                
    </div>    
  )
};