import React, { useState } from 'react';
import '../styles/ResumeReview.css';

const ResumeReview = () => {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFeedback('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setFeedback('Please upload a resume PDF file.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('http://localhost:5000/api/resume-review', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setFeedback(data.feedback || 'Upload failed. Please try again.');
      } else {
        setFeedback(data.feedback || 'No feedback received.');
      }
    } catch (err) {
      setFeedback('Error uploading file. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="resume-review-container">
      <div className="resume-review-card">
        <h2 className="resume-review-title">Resume Review</h2>
        <form className="resume-review-form" onSubmit={handleSubmit}>
          <label>
            Upload Resume (PDF):
            <input
              className="resume-review-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              name="resume"
            />
          </label>
          <button className="resume-review-btn" type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>
        {feedback && (
          <div className="resume-review-feedback">
            <strong>{feedback}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeReview;