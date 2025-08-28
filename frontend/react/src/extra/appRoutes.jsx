import Home from '../pages/Home'; 
import AiMockPage from '../pages/AiMockPage'; 
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import JobBoard from '../pages/JobBoard';
import Dashboard from '../pages/Dashboard';
import CompanyWiseQuestions from '../pages/companyWiseQuestions';
import ResumeReview from '../pages/ResumeReview';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ai-mock-interview" element={<AiMockPage />} />
        <Route path="/job-board" element={<JobBoard />} />
        <Route path="/company-wise-questions" element={<CompanyWiseQuestions />} />
        <Route path="/resume-review" element={<ResumeReview />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
