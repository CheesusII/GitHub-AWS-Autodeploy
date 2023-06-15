import React from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export default function CreateRoomPage({resetToggle, chatting}) {
  
  const username = ""

  return (
    <div style={{ height: 'inherit', width: 'inherit' }}>
      <Stack spacing={5} sx={{
          justifyContent: 'center',
          alignItems: 'center', 
          width: 'inherit'}}>
          <TextField id='user_name' label='Username' value={username} variant='outlined' size='small' sx={{ width: '50%', borderColor: 'pink'}}>Enter Username</TextField>
          <Button onClick={chatting} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Create Room!</Button> 
          <Button onClick={resetToggle} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Return</Button>
      </Stack>
                                
    </div>    
  )
};