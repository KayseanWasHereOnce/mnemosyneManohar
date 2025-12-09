import React from 'react';
import { useNavigate } from 'react-router-dom';
import StarTree from '../components/StarTree';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container fade-in">
      <h1 className="landing-title">MNEMOSYNE</h1>
      <p className="landing-subtitle">Created by THE <strong>Manohar</strong></p>
      
      <div className="landing-row">
        <div className="landing-note">
          <p>
            We have built a world that is broken. From the moment a child is born, we hand them a script: 
            Study hard. Get a job. Work like hell. Earn money. Die. We call this "Human Intelligence." 
            <span className="highlight"> I call it a tragedy.</span>
          </p>
           <p>
                We created a system so hectic that we have forgotten how to sit with the people we love. 
                We trade family dinners for overtime. We trade bedtime stories for deadlines. 
                We spend 60 years chasing a future that, once we arrive, feels empty because the voices 
                of the people who mattered most are starting to fade.
              </p>
            <p>
                Some of us desperate to hold on. We want to freeze time. We want to leave something behind that is more than just a bank account.
              </p>
          <p>
            <strong>Mnemosyne is my rebellion against that silence.</strong>
          </p>
          <p>It is a place to leave your laughter, your hard-learned lessons, and your deepest truths. So that one day, years from now, when you are gone, your loved ones can still ask you for advice... and hear you answer.
            </p>
            <p>Even after you die, you can still live with the people you love. This is my small step to bring us back together.</p>
          <p className="closing-line">
            Even after you die, you live with the people you loved.
          </p>
        </div>
        <StarTree />
      </div>

      <button className="btn-enter" onClick={() => navigate('/guide')}>
        Enter The Archive
      </button>
    </div>
  );
};

export default LandingPage;