import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageCircle, User, Users } from 'lucide-react';

const ModeSelection = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem('mnemosyne_user');
    if (storedUser) setUsername(storedUser);
  }, []);

  const selectMode = (mode) => {
    // We send the 'mode' to the dashboard so it knows what to hide/show
    navigate('/dashboard', { state: { mode: mode } });
  };

  return (
    <div className="mode-container fade-in">
      <h2 className="mode-title">Welcome to the Sanctuary, {username}.</h2>
      <p className="mode-subtitle">How do you wish to interact with this Heart today?</p>

      <div className="mode-cards">
        
        {/* OPTION 1: THE CREATOR (Ancestry Mode) */}
        <div className="mode-card glass-card" onClick={() => selectMode('creator')}>
            <div className="icon-wrapper">
                <User size={40} color="#fff" />
                <Mic size={20} className="sub-icon" />
            </div>
            <h3>I am {username}</h3>
            <p>I want to leave memories, stories, and secrets for the future.</p>
            <span className="btn-select">Enter as Ancestor &rarr;</span>
        </div>

        {/* OPTION 2: THE VISITOR (Remembrance Mode) */}
        <div className="mode-card glass-card" onClick={() => selectMode('visitor')}>
             <div className="icon-wrapper">
                <Users size={40} color="#fff" />
                <MessageCircle size={20} className="sub-icon" />
            </div>
            <h3>I miss {username}</h3>
            <p>I want to ask questions, hear their voice, and feel their presence.</p>
            <span className="btn-select">Enter as Visitor &rarr;</span>
        </div>

      </div>
    </div>
  );
};

export default ModeSelection;