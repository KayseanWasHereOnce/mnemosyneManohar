import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, Lock, User, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  // State to toggle between Login (true) and Register (false)
  const API_URL = "https://mnemosyne-api-ru9z.onrender.com";
  const [isLogin, setIsLogin] = useState(true);
  
  // Form Data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [relationship, setRelationship] = useState(""); // For "Who is this for?"
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
        if (isLogin) {
            // --- LOGIN LOGIC ---
            // The backend expects "username" and "password" as form data for OAuth2
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post(`${API_URL}/token`, formData);
            
            // Save Token
            localStorage.setItem('mnemosyne_token', response.data.access_token);
            // Save Username for the dashboard to say "Welcome, Manohar"
            localStorage.setItem('mnemosyne_user', username);
            
            navigate('/select-mode');
        } else {
            // --- REGISTER LOGIC ---
            await axios.post(`${API_URL}/register`, {
                username: username,
                hashed_password: password
            });
            // Success! Now switch to login view
            setIsLogin(true);
            setErrorMsg("✅ Heart Initialized! Please log in.");
            setUsername(""); 
            setPassword("");
        }
    } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
            setErrorMsg("❌ Incorrect username or password.");
        } else if (err.response && err.response.status === 400) {
            setErrorMsg("❌ Username already taken.");
        } else {
            setErrorMsg("❌ Connection failed. Check backend.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card glass-card">
        
        {/* --- HEADER --- */}
        <div className="auth-header">
            <Heart className={`heart-icon ${!isLogin ? 'beating' : ''}`} size={48} color="#ef4444" fill={!isLogin ? "#ef4444" : "none"} />
            <h2>{isLogin ? "Access Heart" : "Create a Heart"}</h2>
        </div>

        {/* --- TOGGLE TABS (New Visibility Fix) --- */}
        <div className="auth-tabs">
            <button 
                className={isLogin ? "tab active" : "tab"} 
                onClick={() => { setIsLogin(true); setErrorMsg(""); }}
            >
                Login
            </button>
            <button 
                className={!isLogin ? "tab active" : "tab"} 
                onClick={() => { setIsLogin(false); setErrorMsg(""); }}
            >
                Create Account
            </button>
        </div>

        {/* --- FORM --- */}
        <form onSubmit={handleAuth}>
            
            {/* Show "Who is this for" only when Creating */}
            {!isLogin && (
                <div className="input-group slide-down">
                    <label>Who is this Heart for?</label>
                    <input 
                        type="text" 
                        placeholder="e.g. My Daughter" 
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        // Not strictly required by backend yet, but good for UI
                    />
                </div>
            )}

            <div className="input-group">
                <User size={18} className="input-icon" />
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required 
                />
            </div>

            <div className="input-group">
                <Lock size={18} className="input-icon" />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>

            {/* Error Message Display */}
            {errorMsg && <p className="error-text">{errorMsg}</p>}

            <button type="submit" className="btn-auth" disabled={isLoading}>
                {isLoading ? "Processing..." : (isLogin ? "Enter Archive" : "Initialize Heart")} 
                {!isLoading && <ArrowRight size={18} />}
            </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;