import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000')

function App() {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<string[]>([])

  // Fetch messages on component mount
  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/chat/messages')
        const data = await response.json()
        setMessages(data.map((msg: { message: string }) => msg.message)) // Map to just the message text
      } catch (err) {
        console.error('Error fetching messages:', err)
      }
    }

    fetchMessages()

    // Listen for new messages via socket
    socket.on("receiveMessage", (data: string) => {
      setMessages((prevMessages) => [...prevMessages, data])
    })

    // Clean up the socket listener on unmount
    return () => {
      socket.off("receiveMessage")
    }
  }, [])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() === '') return

    socket.emit("sendMessage", message)
    setMessage('')
  }

  return (
    <>
      <div>
        <h1>Chat</h1>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>
              <p>{msg}</p>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input type='text' value={message} onChange={(e) => setMessage(e.target.value)} required />
          <button type='submit'>Send</button>
        </form>
      </div>
    </>
  )
}

export default App
