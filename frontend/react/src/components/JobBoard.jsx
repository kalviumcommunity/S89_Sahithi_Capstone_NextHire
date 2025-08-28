import React from 'react';
import '../styles/JobBoard.css';

// Map company names to their official careers page URLs
const companyCareerLinks = {
  Apple: "https://jobs.apple.com/",
  Google: "https://careers.google.com/jobs/results/",
  Microsoft: "https://careers.microsoft.com/us/en",
  Amazon: "https://www.amazon.jobs/en/",
  IBM: "https://www.ibm.com/employment/",
  Facebook: "https://www.metacareers.com/jobs/",
};

const JobBoard = () => {
  const jobs = [
    {
      role: "Software Engineer",
      company: "Apple",
      salary: "$130,000 - $170,000",
      location: "Cupertino, CA"
    },
    {
      role: "Frontend Developer",
      company: "Google",
      salary: "$120,000 - $150,000",
      location: "Mountain View, CA"
    },
    {
      role: "Cloud Architect",
      company: "Amazon",
      salary: "$150,000",
      location: "Redmond, WA"
    },
    {
      role: "Data Scientist",
      company: "Microsoft",
      salary: "$140,000",
      location: "Seattle, WA"
    },
    {
      role: "DevOps Engineer",
      company: "IBM",
      salary: "$130,000",
      location: "Austin, TX"
    },
    {
      role: "Full Stack Developer",
      company: "Facebook",
      salary: "$150,000 - $180,000",
      location: "Menlo Park, CA"
    }
  ];

  return (
    <div className="jobboard-container">
      <h1 className="jobboard-title">Job Board</h1>
      <div className="jobboard-cards-wrapper">
        {jobs.map((job, index) => (
          <div key={index} className="jobboard-card">
            <div className="jobboard-card-title">{job.role}</div>
            <div className="jobboard-card-desc">
              <b>Company:</b>{" "}
              {companyCareerLinks[job.company] ? (
                <a
                  href={companyCareerLinks[job.company]}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
                >
                  {job.company}
                </a>
              ) : (
                job.company
              )}
            </div>
            <div className="jobboard-card-desc"><b>Salary:</b> {job.salary}</div>
            <div className="jobboard-card-desc">
              <b>Location:</b>{" "}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(job.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2", textDecoration: "underline", cursor: "pointer" }}
              >
                {job.location}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBoard;