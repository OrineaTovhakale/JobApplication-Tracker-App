import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import type { Job } from '../types/Job';

const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const navigate = useNavigate();

  const fetchJob = useCallback(async () => {
    const res = await axios.get(`http://localhost:3001/jobs/${id}`);
    setJob(res.data);
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const updateJob = async () => {
    if (job) {
      await axios.put(`http://localhost:3001/jobs/${id}`, job);
      alert('Updated');
      navigate('/home');
    }
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Job Details</h1>
      <Input type="text" placeholder="Company" value={job.company} onChange={(e) => setJob({...job, company: e.target.value})} className="mb-4" />
      <Input type="text" placeholder="Role" value={job.role} onChange={(e) => setJob({...job, role: e.target.value})} className="mb-4" />
      <Input
        type="select"
        placeholder="Status"
        value={job.status}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
          setJob({ ...job, status: e.target.value as Job['status'] })
        }
        className="mb-4"
      />
      <Input type="date" placeholder="Date Applied" value={job.dateApplied} onChange={(e) => setJob({...job, dateApplied: e.target.value})} className="mb-4" />
      <Input type="text" placeholder="Extra Details" value={job.extraDetails || ''} onChange={(e) => setJob({...job, extraDetails: e.target.value})} className="mb-4" />
      <Button onClick={updateJob} className="mt-4 bg-green-500">Update</Button>
    </div>
  );
};

export default JobPage;