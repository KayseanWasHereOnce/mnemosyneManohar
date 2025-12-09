import React from 'react';
import { useNavigate } from 'react-router-dom';

const GuidePage = () => {
  const navigate = useNavigate();

  return (
    <div className="guide-container fade-in">
        <h2 className="guide-title">HOW IT WORKS</h2>
        <div className="guide-card">
            <div className="step">
                <h3>1. The Connection</h3>
                <p>Define <strong>Who You Are</strong> and <strong>Who This Is For</strong>.</p>
                <p>Are you a father leaving words for a daughter? A friend leaving jokes for a friend? We map the relationship.</p>
            </div>
            <div className="step">
                <h3>2. The Imprint</h3>
                <p>Share everything. Your favorite food, the smell of your childhood home, your deepest regrets, and your random thoughts.</p>
                <p>Share memories, food, regrets. We don't just record words; we record <strong>you</strong>.</p>
            </div>
            <div className="step">
                <h3>3. My Little Heart</h3>
                <p>We feed all of this into <strong>"My Little Heart"</strong></p>
                <p>It doesn’t just store data. It learns to act like you. It learns to speak like you.</p>
            </div>
        </div>

        <button className="btn-enter" onClick={() => navigate('/auth')}>
            Initialize My Little Heart
        </button>
    </div>
  );
};

export default GuidePage;