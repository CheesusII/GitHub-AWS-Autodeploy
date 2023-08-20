import React from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import Logo from '../assets/logo_final.png';

export default function LandingPage({chatting}) {  

    return (
    <div style={{height: 'inherit', width: 'inherit'}}>
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
                        <Button onClick={chatting} variant="contained" sx={{backgroundColor: 'red', '&:hover':{backgroundColor: 'pink',}, width: '50%'}}>Start chatting!</Button>
                    </Stack>
                </Box>
            </div>
        </Stack>
    </div>    
  )
};

