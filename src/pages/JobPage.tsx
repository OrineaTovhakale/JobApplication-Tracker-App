import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import type { Job } from '../types/Job';
import { jobService } from '../services';
import { getCurrentUser, removeCurrentUser, validateJob } from '../utils';
import { MESSAGES } from '../constants';
//import './JobPage.module.css';

const JobPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const username = getCurrentUser() || '';

  const fetchJob = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobById(id!);
      if (data.username !== username) {
        navigate('/home');
        return;
      }
      setJob(data);
    } catch (err) {
      console.error(err);
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, [id, username, navigate]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const updateJob = async () => {
    if (!job) return;
    
    setError('');
    
    // Validate job
    const validation = validateJob(job);
    if (!validation.valid) {
      setError(validation.error || MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setLoading(true);
    try {
      await jobService.updateJob(id!, job);
      alert(MESSAGES.JOB_UPDATED);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId: number) => {
    if (!window.confirm(MESSAGES.CONFIRM_DELETE)) return;
    
    setLoading(true);
    try {
      await jobService.deleteJob(jobId);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    removeCurrentUser();
    navigate('/');
  };

  if (loading && !job) {
    return (
      <div className="fade-in flex items-center justify-center min-h-screen bg-white p-6">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="fade-in flex items-center justify-center min-h-screen bg-white p-6">
        <p className="text-gray-600">Job not found</p>
      </div>
    );
  }

  return (
    <div className="fade-in min-h-screen bg-white p-6">
      <div className="container mx-auto">
        <div className="card">
          <div className="flex justify-between items-center mb-12">
            <Button onClick={() => navigate(-1)} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300">
              Back
            </Button>
          </div>
          
          <h1 className="mb-12 text-3xl font-bold text-gray-800 text-center">Job Details</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          <div className="space-y-8 formGrid">
            <Input type="text" placeholder="Company *" value={job.company} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setJob({...job, company: e.target.value})} />
            <Input type="text" placeholder="Role *" value={job.role} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setJob({...job, role: e.target.value})} />
            <Input type="select" placeholder="Select Status" value={job.status} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setJob({...job, status: e.target.value as Job['status']})} />
            <Input type="date" placeholder="Date Applied *" value={job.dateApplied} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setJob({...job, dateApplied: e.target.value})} />
            <Input type="text" placeholder="Extra Details (optional)" value={job.extraDetails || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setJob({...job, extraDetails: e.target.value})} />
          </div>
          
          <Button 
            onClick={updateJob} 
            disabled={loading}
            className="mt-12 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 w-full disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
          
          <div className="mt-12">
            <Button 
              onClick={() => deleteJob(job.id!)} 
              disabled={loading}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 w-full disabled:opacity-50"
            >
              Delete Job
            </Button>
          </div>
          
          <div className="mt-12">
            <Button onClick={signOut} className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;