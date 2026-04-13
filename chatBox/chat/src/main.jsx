import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import './index.css';

function ChatBox() {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  function changeName(e) {
    setMessage(e.target.value);
  }

  async function addMessage() {
    if (!message.trim()) return;

    const newMessages = [...messages, { role: "user", text: message }];
    setMessages(newMessages);

    try {
      const response = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();
      console.log("BACKEND RESPONSE:", data);

      if (data.reply) {
        setMessages([...newMessages, { role: "bot", text: data.reply }]);
      } else {
        setMessages([
          ...newMessages,
          { role: "bot", text: "ERROR: " + JSON.stringify(data) }
        ]);
      }

    } catch (error) {
      console.error("ERROR:", error);

      setMessages([
        ...newMessages,
        { role: "bot", text: "Network error" }
      ]);
    }

    setMessage('');
  }
  function handleKeyDown(e) {
  if (e.key === "Enter") {
    addMessage();
  }
  }
  return (
    <div className="wrapper">

      <div className="chatBox">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className='formDev'>
        <input
          value={message}
          onChange={changeName}
          onKeyDown={handleKeyDown}
          placeholder='Start chatting...'
          className='input'
        />

        <button onClick={addMessage} className='btn' type="button">
          Send
        </button>
      </div>

    </div>
  );
}

createRoot(document.getElementById('root')).render(<ChatBox />);