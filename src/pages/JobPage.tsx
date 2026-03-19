import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import Toast from '../components/Toast';
import type { ToastType } from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';
import type { Job } from '../types/Job';
import { jobService } from '../services';
import { getCurrentUser, removeCurrentUser, validateJob, sanitizeInput } from '../utils';
import { MESSAGES } from '../constants';

const JobPage: React.FC = () => {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const username = getCurrentUser() ?? '';

  const [job, setJob]                 = useState<Job | null>(null);
  const [formError, setFormError]     = useState('');
  const [loading, setLoading]         = useState(false);
  const [toast, setToast]             = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

  const fetchJob = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await jobService.getJobById(id);
      if (data.username !== username) { navigate('/home'); return; }
      setJob(data);
    } catch {
      setFormError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, [id, username, navigate]);

  useEffect(() => { fetchJob(); }, [fetchJob]);

  const updateJob = async () => {
    if (!job) return;
    setFormError('');
    const sanitized: Job = {
      ...job,
      company:      sanitizeInput(job.company),
      role:         sanitizeInput(job.role),
      extraDetails: job.extraDetails ? sanitizeInput(job.extraDetails) : '',
    };
    const validation = validateJob(sanitized);
    if (!validation.valid) { setFormError(validation.error ?? MESSAGES.REQUIRED_FIELDS); return; }
    setLoading(true);
    try {
      await jobService.updateJob(id!, sanitized);
      showToast(MESSAGES.JOB_UPDATED);
      setTimeout(() => navigate('/home'), 1500);
    } catch {
      showToast(MESSAGES.NETWORK_ERROR, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!job) return;
    setLoading(true);
    try {
      await jobService.deleteJob(job.id!);
      showToast(MESSAGES.JOB_DELETED);
      setTimeout(() => navigate('/home'), 1500);
    } catch {
      showToast(MESSAGES.NETWORK_ERROR, 'error');
      setLoading(false);
    }
    setConfirmDelete(false);
  };

  if (loading && !job) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
      <p style={{ color: 'var(--color-text-muted)' }}>Loading application…</p>
    </div>
  );

  if (!loading && !job) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'var(--color-bg)' }}>
      <p style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>Application not found.</p>
      <Button variant="primary" onClick={() => navigate('/home')}>Back to applications</Button>
    </div>
  );

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Button variant="primary" onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </Button>
        </div>

        <div className="card">
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '1.75rem', letterSpacing: '-0.01em' }}>
            Edit Application
          </h1>

          {formError && (
            <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-red-soft)', border: '1px solid #fca5a5', color: 'var(--color-red)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              {formError}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '1.75rem' }}>
            <label>
              Company *
              <Input type="text" placeholder="e.g. Google" value={job!.company} onChange={e => setJob({ ...job!, company: e.target.value })} />
            </label>
            <label>
              Role *
              <Input type="text" placeholder="e.g. Software Engineer" value={job!.role} onChange={e => setJob({ ...job!, role: e.target.value })} />
            </label>
            <label>
              Status
              <Input
                type="select"
                placeholder="Select Status"
                value={job!.status}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setJob({ ...job!, status: e.target.value as Job['status'] })}
              />
            </label>
            <label>
              Date Applied *
              <Input type="date" placeholder="Date Applied" value={job!.dateApplied} onChange={e => setJob({ ...job!, dateApplied: e.target.value })} />
            </label>
            <label>
              Extra Details (optional)
              <Input type="text" placeholder="Notes, recruiter, referral…" value={job!.extraDetails ?? ''} onChange={e => setJob({ ...job!, extraDetails: e.target.value })} />
            </label>
          </div>

          <Button variant="primary" onClick={updateJob} disabled={loading} >
            {loading ? 'Updating…' : 'Update Application'}
          </Button>

          <div style={{ marginTop: '10px' }}>
            <Button variant="danger" onClick={() => setConfirmDelete(true)} disabled={loading} >
              Delete Application
            </Button>
          </div>

          <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => { removeCurrentUser(); navigate('/'); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={confirmDelete} title="Delete Application?" message={MESSAGES.CONFIRM_DELETE}
        onConfirm={handleDeleteConfirmed} onCancel={() => setConfirmDelete(false)}
        confirmText="Delete" cancelText="Cancel"
      />
    </div>
  );
};

export default JobPage;