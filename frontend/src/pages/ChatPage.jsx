import React from 'react'
import { useAuthStore } from '../store/useAuthStore'
useAuthStore

const ChatPage = () => {
  const {logout}=useAuthStore();
  return (
    <div className="z-30">

      <button onClick={logout}>Logout</button>

      </div>
  )
}

export default ChatPage