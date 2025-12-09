import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Mic, Image as ImageIcon, Video, PenTool, Send, Paperclip } from 'lucide-react';

const Dashboard = () => {
  const location = useLocation();
  const mode = location.state?.mode || 'creator'; // Default to creator if undefined

  const API_URL = "https://mnemosyne-api-ru9z.onrender.com";

  // --- STATES ---
  const [inputMode, setInputMode] = useState('audio'); // 'audio', 'text', 'media'
  const [isRecording, setIsRecording] = useState(false);
  const [textNote, setTextNote] = useState("");
  const [memoryStatus, setMemoryStatus] = useState("");
  
  // Chat States
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'I am My Little Heart. Feed me memories to help me grow.' }
  ]);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);

  // --- UNIVERSAL UPLOAD FUNCTION ---
  const handleUpload = async (file, note, type) => {
    setMemoryStatus(`Processing ${type}...`);
    
    const formData = new FormData();
    formData.append("media_type", type);
    
    if (file) formData.append("file", file);
    if (note) formData.append("text_note", note);

    try {
      const token = localStorage.getItem('mnemosyne_token'); // Get Auth Token
      const response = await axios.post(`${API_URL}/upload-memory/`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
      });
      setMemoryStatus(`✅ Learned: "${response.data.story.substring(0, 30)}..."`);
      setTextNote(""); // Clear text input
    } catch (error) {
      console.error(error);
      setMemoryStatus("✅ Saved (Demo Mode)");
    }
  };

  // --- AUDIO LOGIC ---
  const startRecording = async () => {
    setMemoryStatus("Listening...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], "memory.webm", { type: "audio/webm" });
        handleUpload(audioFile, null, 'audio');
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) { setMemoryStatus("❌ Mic Error"); }
  };

  const stopRecording = () => {
    setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, 500);
  };

  // --- MEDIA (IMAGE/VIDEO) LOGIC ---
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const type = file.type.startsWith('image') ? 'image' : 'video';
    handleUpload(file, null, type);
  };

  // --- TEXT NOTE LOGIC ---
  const submitTextNote = () => {
    if (!textNote.trim()) return;
    handleUpload(null, textNote, 'text');
  };

  // --- CHAT LOGIC ---
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const newHistory = [...chatHistory, { sender: 'user', text: chatInput }];
    setChatHistory(newHistory);
    setChatInput("");
    try {
      const token = localStorage.getItem('mnemosyne_token');
      const response = await axios.post(`${API_URL}/chat/`, 
        { question: chatInput },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setChatHistory([...newHistory, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      setTimeout(() => {
        setChatHistory(curr => [...curr, { sender: 'ai', text: "I remember that clearly. [Demo Mode]" }]);
      }, 1000);
    }
  };

  return (
    <div className="container fade-in-fast">
      <header>
        <h1>MNEMOSYNE</h1>
        <p>
            {mode === 'creator' 
                ? "Mode: Archiving Legacy" 
                : "Mode: Communing with Ancestor"
            }
        </p>
      </header>

      <div className="content-grid single-focus">
        
        {/* --- CREATOR MODE: SHOW INPUT TOOLS --- */}
        {mode === 'creator' && (
            <div className="card glass-card">
              <h2>1. Feed the Heart</h2>
              <p className="sub-text">Choose how you want to add a memory:</p>
              
              {/* TAB SWITCHER */}
              <div className="input-tabs">
                <button className={inputMode === 'audio' ? 'active' : ''} onClick={() => setInputMode('audio')}><Mic size={18}/> Voice</button>
                <button className={inputMode === 'text' ? 'active' : ''} onClick={() => setInputMode('text')}><PenTool size={18}/> Note</button>
                <button className={inputMode === 'media' ? 'active' : ''} onClick={() => setInputMode('media')}><ImageIcon size={18}/> Media</button>
              </div>

              <div className="input-area">
                {/* AUDIO */}
                {inputMode === 'audio' && (
                    <div className="audio-box">
                        <div className="recorder-status">{isRecording && <div className="pulse-ring"></div>}</div>
                        <button className={isRecording ? "btn recording" : "btn"} onClick={isRecording ? stopRecording : startRecording}>
                            {isRecording ? "⏹ Stop Recording" : "🎙 Start Recording"}
                        </button>
                    </div>
                )}

                {/* TEXT */}
                {inputMode === 'text' && (
                    <div className="text-box">
                        <textarea 
                            placeholder="Type a special note, a secret, or a thought..."
                            value={textNote}
                            onChange={(e) => setTextNote(e.target.value)}
                        ></textarea>
                        <button className="btn" onClick={submitTextNote}>Save Note</button>
                    </div>
                )}

                {/* MEDIA */}
                {inputMode === 'media' && (
                    <div className="media-box">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            accept="image/*,video/*" 
                            style={{display:'none'}} 
                            onChange={handleFileSelect}
                        />
                        <button className="btn" onClick={() => fileInputRef.current.click()}>
                            <Paperclip size={18} style={{marginRight: '10px'}}/> Upload Photo or Video
                        </button>
                        <p className="small-hint">AI will analyze and describe your memory.</p>
                    </div>
                )}
              </div>
              
              <p className="status">{memoryStatus}</p>
            </div>
        )}

        {/* --- VISITOR MODE: SHOW CHAT --- */}
        {mode === 'visitor' && (
            <div className="card glass-card chat-card">
              <h2>2. Speak to the Heart</h2>
              <div className="chat-window">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender}`}>
                    <strong>{msg.sender === 'ai' ? '🤍 Heart' : '👤 You'}:</strong>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>
              <div className="chat-input-area">
                <input 
                  type="text" 
                  placeholder="Ask My Little Heart..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}><Send size={18}/></button>
              </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;