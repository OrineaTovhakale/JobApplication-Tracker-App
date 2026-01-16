import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import type { Job } from '../types/Job';
import { jobService } from '../services';
import { getCurrentUser, removeCurrentUser, validateJob } from '../utils';
import { MESSAGES } from '../constants';
//import './Home.module.css';

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>({ company: '', role: '', status: 'Applied', dateApplied: '', extraDetails: '', username: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; jobId: number | null }>({ isOpen: false, jobId: null });
  const navigate = useNavigate();
  const username = getCurrentUser() || '';

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await jobService.getJobsByUsername(username);
      data.sort((a: Job, b: Job) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async () => {
    setError('');
    
    const validation = validateJob(newJob);
    if (!validation.valid) {
      setError(validation.error || MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setLoading(true);
    try {
      const jobWithUser: Job = { ...newJob, username };
      await jobService.createJob(jobWithUser);
      await fetchJobs();
      setIsAdding(false);
      setNewJob({ company: '', role: '', status: 'Applied', dateApplied: '', extraDetails: '', username: '' });
      showToast(MESSAGES.JOB_ADDED, 'success');
    } catch (err) {
      console.error(err);
      showToast(MESSAGES.NETWORK_ERROR, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setConfirmDelete({ isOpen: true, jobId: id });
  };

  const confirmDeleteJob = async () => {
    if (!confirmDelete.jobId) return;
    
    setLoading(true);
    try {
      await jobService.deleteJob(confirmDelete.jobId);
      await fetchJobs();
      showToast(MESSAGES.JOB_DELETED, 'success');
    } catch (err) {
      console.error(err);
      showToast(MESSAGES.NETWORK_ERROR, 'error');
    } finally {
      setLoading(false);
      setConfirmDelete({ isOpen: false, jobId: null });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete({ isOpen: false, jobId: null });
  };

  const startEdit = (job: Job) => {
    navigate(`/jobs/${job.id}`);
  };

  const searchJobs = async () => {
    setError('');
    setLoading(true);
    try {
      let data = await jobService.getJobsByUsername(username);
      
      if (searchQuery) {
        data = data.filter((j: Job) => 
          j.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
          j.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      if (searchStatus) {
        data = data.filter((j: Job) => j.status === searchStatus);
      }
      
      data.sort((a: Job, b: Job) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());
      setJobs(data);
      setIsSearching(false);
    } catch (err) {
      console.error(err);
      showToast(MESSAGES.NETWORK_ERROR, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchStatus('');
    fetchJobs();
    setIsSearching(false);
  };

  const signOut = () => {
    removeCurrentUser();
    navigate('/');
  };

  return (
    <div className="fade-in min-h-screen bg-white p-4 sm:p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Job Applications</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button onClick={() => setIsAdding(!isAdding)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap">
              Add New Job
            </Button>
            <Button onClick={() => setIsSearching(!isSearching)} className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap">
              Search Jobs
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {isAdding && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Add New Job</h2>
            <div className="space-y-4">
              <Input type="text" placeholder="Company *" value={newJob.company} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewJob({...newJob, company: e.target.value})} />
              <Input type="text" placeholder="Role *" value={newJob.role} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewJob({...newJob, role: e.target.value})} />
              <Input type="select" placeholder="Select Status" value={newJob.status} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewJob({...newJob, status: e.target.value as Job['status']})} />
              <Input type="date" placeholder="Date Applied *" value={newJob.dateApplied} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewJob({...newJob, dateApplied: e.target.value})} />
              <Input type="text" placeholder="Extra Details (optional)" value={newJob.extraDetails || ''} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewJob({...newJob, extraDetails: e.target.value})} />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={addJob} disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Job'}
              </Button>
              <Button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg transition-all duration-300">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {isSearching && (
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Search Jobs</h2>
            <div className="space-y-4">
              <Input type="text" placeholder="Search by Company or Role" value={searchQuery} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSearchQuery(e.target.value)} />
              <Input type="select" placeholder="Filter by Status" value={searchStatus} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setSearchStatus(e.target.value as Job['status'])} />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button onClick={searchJobs} disabled={loading} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300 disabled:opacity-50">
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button onClick={clearSearch} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300">
                Clear
              </Button>
              <Button onClick={() => setIsSearching(false)} className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg transition-all duration-300">
                Close
              </Button>
            </div>
          </div>
        )}

        {loading && !isAdding && !isSearching ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No job applications yet. Start by adding one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 homeGrid">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} onEdit={() => startEdit(job)} onDelete={() => handleDeleteClick(job.id!)} />
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button onClick={signOut} className="w-full sm:w-auto sm:min-w-[200px] bg-gray-700 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg transition-all duration-300">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        title="Delete Job Application?"
        message={MESSAGES.CONFIRM_DELETE}
        onConfirm={confirmDeleteJob}
        onCancel={cancelDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Home;