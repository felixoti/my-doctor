import React, { useState, useRef, useEffect } from "react";

import axios from "axios";

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Display loading message with dots animation
    const loadingMessage = { text: "Thinking", sender: "bot" };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const response = await axios.post("http://localhost:5000/chatbot", {
        symptoms: input,
      });

      const { diagnosis, description, medicine } = response.data;
      
      const botResponse = {
        text: `Diagnosis: ${diagnosis}\nDescription: ${description}\nMedication: ${medicine}`,
        sender: "bot",
      };

      setMessages((prev) => [...prev.slice(0, -1), botResponse]); // Replace loading message
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { text: "Error connecting to chatbot. Please try again.", sender: "bot" },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Animate loading dots
  useEffect(() => {
    if (loading) {
      let count = 0;
      const interval = setInterval(() => {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            text: `Thinking${".".repeat((count % 3) + 1)}`,
            sender: "bot",
          };
          return newMessages;
        });
        count++;
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    
    <div className="flex flex-col h-screen bg-gray-100 p-2 sm:p-4">
      {/* Chat Display */}
      <div className="flex-1 overflow-y-auto bg-white shadow-md rounded-lg p-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 px-4 py-2 rounded-xl text-sm w-fit break-words ${
              msg.sender === "user"
                ? "bg-green-900 text-white self-end ml-auto"
                : "bg-gray-400 text-gray-900"
            }`}
            style={{ maxWidth: "75%" }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field */}
      <div className="mt-2 flex items-center space-x-2 bg-white p-2 rounded-lg shadow-md">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none resize-none overflow-hidden"
          placeholder="Type your symptoms..."
          rows="1"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;