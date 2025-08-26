import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Input from '../components/Input';
import Button from '../components/Button';
import type { Job } from '../types/Job';

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>({ company: '', role: '', status: 'Applied', dateApplied: '', extraDetails: '', username: '' });
  const navigate = useNavigate();
  const username = localStorage.getItem('token') || '';

  const fetchJobs = useCallback(async () => {
    const res = await axios.get('http://localhost:3001/jobs');
    const data = res.data.filter((j: Job) => j.username === username);
    setJobs(data);
  }, [username]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async () => {
    const jobWithUser = { ...newJob, username };
    await axios.post('http://localhost:3001/jobs', jobWithUser);
    fetchJobs();
  };

  const deleteJob = async (id: number) => {
    await axios.delete(`http://localhost:3001/jobs/${id}`);
    fetchJobs();
  };

  const startEdit = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-8">My Job Applications</h1>
      <div className="mb-8">
        <Input type="text" placeholder="Company" value={newJob.company} onChange={(e) => setNewJob({...newJob, company: e.target.value})} className="mb-4" />
        <Input type="text" placeholder="Role" value={newJob.role} onChange={(e) => setNewJob({...newJob, role: e.target.value})} className="mb-4" />
        <Input type="select" placeholder="Status" value={newJob.status} onChange={(e) => setNewJob({...newJob, status: e.target.value as Job['status']})} className="mb-4" />
        <Input type="date" placeholder="Date Applied" value={newJob.dateApplied} onChange={(e) => setNewJob({...newJob, dateApplied: e.target.value})} className="mb-4" />
        <Input type="text" placeholder="Extra Details" value={newJob.extraDetails || ''} onChange={(e) => setNewJob({...newJob, extraDetails: e.target.value})} className="mb-4" />
        <Button onClick={addJob} className="mt-4 bg-green-500">Add Job</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onEdit={() => startEdit(job)} onDelete={() => deleteJob(job.id!)} />
        ))}
      </div>
    </div>
  );
};

export default Home;