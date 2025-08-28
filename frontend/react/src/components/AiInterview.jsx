import React, { useRef, useState } from 'react';
import '../styles/AiInterview.css';

const roles = [
  { value: '', label: 'Select Role' },
  { value: 'software-engineer', label: 'Software Engineer' },
  { value: 'data-scientist', label: 'Data Scientist' },
  // Add more roles as needed
];

const AiInterview = () => {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finished, setFinished] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const chunks = useRef([]);

  // Fetch questions when role changes
  const handleRoleChange = async (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    setQuestions([]);
    setCurrentQuestion(0);
    setFinished(false);
    setFeedback('');
    setScore(null);
    setVideoURL('');
    setVideoFile(null);
    if (selectedRole) {
      const res = await fetch(`http://localhost:5000/api/interview-questions/${selectedRole}`);
      const data = await res.json();
      setQuestions(data.questions || []);
    }
  };

  const startRecording = async () => {
    setFeedback('');
    setScore(null);
    setVideoURL('');
    setVideoFile(null);
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    chunks.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      setVideoFile(blob);
      stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    };
    recorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleFileChange = (e) => {
    setFeedback('');
    setScore(null);
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setVideoURL(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      setFeedback('Please record or upload a video first.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('question', questions[currentQuestion]); // send question

    try {
      const response = await fetch('http://localhost:5000/api/interview-analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setFeedback(data.feedback || 'Analysis failed. Please try again.');
        setScore(null);
      } else {
        setFeedback(data.feedback || 'No feedback received.');
        setScore(data.score || null);
      }
    } catch (err) {
      setFeedback('Error uploading video. Please try again.');
      setScore(null);
    }
    setLoading(false);
  };

  const handleNext = () => {
    setFeedback('');
    setScore(null);
    setVideoURL('');
    setVideoFile(null);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleFinish = () => {
    setFinished(true);
  };

  // UI rendering
  if (finished) {
    return (
      <div className="aii-container">
        <h2>AI Interview Practice</h2>
        <p className="aii-complete">🎉 Congratulations! You have completed the Interview.</p>
      </div>
    );
  }

  return (
    <div className="aii-container">
      <h2>AI Interview Practice</h2>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="role-select" style={{ fontWeight: 'bold', marginRight: 8 }}>Role:</label>
        <select id="role-select" value={role} onChange={handleRoleChange}>
          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </div>

      {!role && <p>Please select a role to begin.</p>}

      {role && questions.length > 0 && currentQuestion < questions.length && (
        <>
          <div className="aii-question-box">
            <span className="question-number" style={{ fontWeight: 'bold', marginRight: 6 }}>
              Question {currentQuestion + 1}:
            </span>
            <span className="question-text">{questions[currentQuestion] || "Question not found!"}</span>
          </div>

          <div className="aii-btn-row">
            <button className="aii-btn" onClick={startRecording} disabled={recording}>
              Record Video
            </button>
            <button className="aii-btn" onClick={stopRecording} disabled={!recording}>
              Stop Recording
            </button>
          </div>

          <div className="aii-upload-row">
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </div>

          {videoURL && (
            <video src={videoURL} controls width="400" className="aii-video" />
          )}

          <form onSubmit={handleAnalyze}>
            <button className="aii-analyze-btn" type="submit" disabled={loading || !videoFile}>
              {loading ? 'Analyzing...' : 'Analyze Video'}
            </button>
          </form>

          {score !== null && (
            <div className="aii-score">
              <strong>Score: {score}/100</strong>
            </div>
          )}

          {feedback && (
            <div className="aii-feedback">
              <strong>{feedback}</strong>
              {currentQuestion < questions.length - 1 && (
                <div>
                  <button className="aii-next-btn" onClick={handleNext}>
                    Next Question
                  </button>
                </div>
              )}
              {currentQuestion === questions.length - 1 && (
                <div>
                  <button className="aii-next-btn" onClick={handleFinish}>
                    Finish
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <video ref={videoRef} style={{ display: 'none' }} />
    </div>
  );
};

export default AiInterview;