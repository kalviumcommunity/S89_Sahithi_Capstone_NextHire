import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import './styles/global.css';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/SignUp';
import Dashboard from './components/DashBoard';
import Profile from './components/Profile';
import CompanyWiseQuestions from "./components/CompanyWiseQuestions";
import JobBoard from './components/JobBoard';
import ResumeReview from './components/ResumeReview';
import AiInterview from './components/AiInterview';
import NotePage from './components/NotePage';
import UserSearch from './components/UserSearch';
import Chat from './components/Chat';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Header />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/company-wise-questions" element={<CompanyWiseQuestions />} />
              <Route path="/job-board" element={<JobBoard />} />
              <Route path="/resume-review" element={<ResumeReview />} />
              <Route path="/ai-mock-interview" element={<AiInterview />} />
              <Route path="/note/:date" element={<NotePage />} />
              <Route path="/discover" element={<UserSearch />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;