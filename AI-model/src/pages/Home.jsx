import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiSun, FiMoon, FiCpu } from 'react-icons/fi';
import '../styles/home.css';

function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Welcome to NexusAI. How can I assist you today?");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  async function generateAnswers() {
    if (!question.trim()) return;
    
    setIsLoading(true);
    const userQuestion = question;
    setQuestion("");
    
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAOxHRPqBZAic_asutpVyVysZtT1QIhfDg",
        method: "post",
        data: {
          contents: [{
            parts: [{ "text": userQuestion }]
          }],
        }
      });
      
      const aiResponse = response['data']['candidates'][0]['content']['parts'][0]['text'];
      setAnswer(aiResponse);
      setChatHistory([...chatHistory, { question: userQuestion, answer: aiResponse }]);
    } catch (error) {
      setAnswer("Sorry, I encountered an error. Please try again later.");
      console.error("API Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateAnswers();
    }
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <FiCpu className="logo-icon" />
            <h1>NexusAI</h1>
          </div>
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>
        </div>
        <p className="tagline">Your intelligent conversational partner</p>
      </header>

      <main className="chat-container">
        <div className="chat-history">
          {chatHistory.length > 0 ? (
            chatHistory.map((item, index) => (
              <div key={index} className="chat-message">
                <div className="user-question">
                  <span className="message-label">You:</span>
                  <p>{item.question}</p>
                </div>
                <div className="ai-answer">
                  <span className="message-label">NexusAI:</span>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="welcome-message">
              <h2>Start a conversation with NexusAI</h2>
              <p>Ask anything, from casual questions to complex topics</p>
            </div>
          )}
        </div>

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>NexusAI is thinking...</span>
          </div>
        )}

        <div className="input-container">
          <textarea
            placeholder="Message NexusAI..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            aria-label="Type your message"
          />
          <button 
            className="send-button"
            onClick={generateAnswers}
            disabled={!question.trim() || isLoading}
            aria-label="Send message"
          >
            <FiSend />
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <p>NexusAI v1.0 · Designed with precision · © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default Home;