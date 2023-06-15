import React, { useState } from 'react'
import ChatRoomNew from './components/ChatRoomNew'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';

const App = () => {
  const [page, setPage] = useState(0)
  const landing = () => setPage(0)
  const chatting = () => setPage(1)
  
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path="*" element={<>Error 404: Not found!</>} />
          {page === 0 && <Route path="/" element={<LandingPage chatting={chatting}/>} />}
          {page === 1 && <Route path="/" element={<ChatRoomNew landing={landing}/>} />}
          <Route path="rooms/:routeId" element={<></>} />
      </Routes>
    </BrowserRouter>
    </>
  )
  
}

export default App;