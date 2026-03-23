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
import { getCurrentUser, removeCurrentUser, validateJob, sanitizeInput } from '../utils';
import { MESSAGES } from '../constants';

type SortField = 'dateApplied' | 'company' | 'role';
type SortDir   = 'asc' | 'desc';

const Panel: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="card fade-in" style={{ marginBottom: '1.5rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{title}</h2>
      <button onClick={onClose} aria-label="Close panel" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: '4px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
    {children}
  </div>
);

const StatsBar: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const counts = {
    total:       jobs.length,
    applied:     jobs.filter(j => j.status === 'Applied').length,
    interviewed: jobs.filter(j => j.status === 'Interviewed').length,
    offered:     jobs.filter(j => j.status === 'Offered').length,
    rejected:    jobs.filter(j => j.status === 'Rejected').length,
  };
  const Stat = ({ label, count, color }: { label: string; count: number; color: string }) => (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.5rem', fontWeight: 800, color, lineHeight: 1 }}>{count}</p>
      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginTop: '3px' }}>{label}</p>
    </div>
  );
  const Div = () => <div style={{ width: '1px', background: 'var(--color-border)', alignSelf: 'stretch' }} />;
  return (
    <div className="card" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '1.25rem', marginBottom: '1.5rem' }}>
      <Stat label="Total"       count={counts.total}       color="var(--color-text-primary)" />
      <Div /><Stat label="Applied"     count={counts.applied}     color="var(--color-amber)"  />
      <Div /><Stat label="Interviewed" count={counts.interviewed} color="var(--color-green)"  />
      <Div /><Stat label="Offered"     count={counts.offered}     color="var(--color-indigo)" />
      <Div /><Stat label="Rejected"    count={counts.rejected}    color="var(--color-red)"    />
    </div>
  );
};

const sortJobs = (jobs: Job[], field: SortField, dir: SortDir): Job[] =>
  [...jobs].sort((a, b) => {
    const valA: string | number = field === 'dateApplied' ? new Date(a.dateApplied).getTime() : a[field].toLowerCase();
    const valB: string | number = field === 'dateApplied' ? new Date(b.dateApplied).getTime() : b[field].toLowerCase();
    if (valA < valB) return dir === 'asc' ? -1 : 1;
    if (valA > valB) return dir === 'asc' ?  1 : -1;
    return 0;
  });

const filterJobs = (jobs: Job[], query: string, status: string): Job[] =>
  jobs.filter(j => {
    const matchesQuery = !query || j.company.toLowerCase().includes(query.toLowerCase()) || j.role.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = !status || j.status === status;
    return matchesQuery && matchesStatus;
  });

const getTodayDate = (): string => new Date().toISOString().split('T')[0];

const emptyJob: Job = { company: '', role: '', status: 'Applied', dateApplied: getTodayDate(), extraDetails: '', username: '' };

const Home: React.FC = () => {
  const [allJobs, setAllJobs]           = useState<Job[]>([]);
  const [displayJobs, setDisplayJobs]   = useState<Job[]>([]);
  const [newJob, setNewJob]             = useState<Job>(emptyJob);
  const [isAdding, setIsAdding]         = useState(false);
  const [isSearching, setIsSearching]   = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [sortField, setSortField]       = useState<SortField>('dateApplied');
  const [sortDir, setSortDir]           = useState<SortDir>('desc');
  const [formError, setFormError]       = useState('');
  const [fetchError, setFetchError]     = useState('');
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState<{ message: string; type: ToastType } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; jobId: number | null }>({ isOpen: false, jobId: null });
  const navigate = useNavigate();
  const username = getCurrentUser() ?? '';

  const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const data = await jobService.getJobsByUsername(username);
      setAllJobs(data);
    } catch {
      setFetchError(MESSAGES.NETWORK_ERROR);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    const filtered = filterJobs(allJobs, searchQuery, searchStatus);
    const sorted   = sortJobs(filtered, sortField, sortDir);
    setDisplayJobs(sorted);
  }, [allJobs, searchQuery, searchStatus, sortField, sortDir]);

  const addJob = async () => {
    setFormError('');
    const sanitized: Job = {
      ...newJob,
      company:      sanitizeInput(newJob.company),
      role:         sanitizeInput(newJob.role),
      extraDetails: newJob.extraDetails ? sanitizeInput(newJob.extraDetails) : '',
      username,
    };
    const validation = validateJob(sanitized);
    if (!validation.valid) { setFormError(validation.error ?? MESSAGES.REQUIRED_FIELDS); return; }
    setLoading(true);
    try {
      await jobService.createJob(sanitized);
      await fetchJobs();
      setIsAdding(false);
      setNewJob({ ...emptyJob, dateApplied: getTodayDate() });
      showToast(MESSAGES.JOB_ADDED);
    } catch {
      showToast(MESSAGES.NETWORK_ERROR, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteJob = async () => {
    if (!confirmDelete.jobId) return;
    setLoading(true);
    try {
      await jobService.deleteJob(confirmDelete.jobId);
      await fetchJobs();
      showToast(MESSAGES.JOB_DELETED);
    } catch {
      showToast(MESSAGES.NETWORK_ERROR, 'error');
    } finally {
      setLoading(false);
      setConfirmDelete({ isOpen: false, jobId: null });
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortBtn: React.FC<{ field: SortField; label: string }> = ({ field, label }) => {
    const active = sortField === field;
    return (
      <button onClick={() => toggleSort(field)} style={{
        padding: '5px 12px', borderRadius: 'var(--radius-sm)',
        border: `1.5px solid ${active ? 'var(--color-indigo)' : 'var(--color-border)'}`,
        background: active ? 'var(--color-indigo-soft)' : 'var(--color-surface)',
        color: active ? 'var(--color-indigo)' : 'var(--color-text-secondary)',
        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
        display: 'inline-flex', alignItems: 'center', gap: '4px', transition: 'all var(--transition)',
      }}>
        {label}{active && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
      </button>
    );
  };

  return (
    <div className="fade-in" style={{ minHeight: '100vh', background: 'var(--color-bg)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>My Applications</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginTop: '2px' }}>Signed in as <strong>{username}</strong></p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" onClick={() => { setIsSearching(s => !s); setIsAdding(false); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Filter
            </Button>
            <Button variant="primary" onClick={() => { setIsAdding(s => !s); setIsSearching(false); setFormError(''); }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Job
            </Button>
          </div>
        </div>

        {/* ── Stats ── */}
        {allJobs.length > 0 && <StatsBar jobs={allJobs} />}

        {/* ── Fetch error ── */}
        {fetchError && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: 'var(--color-red-soft)', border: '1px solid #fca5a5', color: 'var(--color-red)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {fetchError}
          </div>
        )}

        {/* ── Add panel ── */}
        {isAdding && (
          <Panel title="New Job Application" onClose={() => { setIsAdding(false); setFormError(''); }}>
            {formError && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--color-red-soft)', color: 'var(--color-red)', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #fca5a5' }}>
                {formError}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Input
                  label="Company *"
                  type="text"
                  placeholder="e.g. Google"
                  value={newJob.company}
                  onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                />
                <Input
                  label="Role *"
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={newJob.role}
                  onChange={e => setNewJob({ ...newJob, role: e.target.value })}
                />
                <Input
                  label="Status"
                  type="select"
                  placeholder="Select Status"
                  value={newJob.status}
                  onChange={e => setNewJob({ ...newJob, status: e.target.value as Job['status'] })}
                />
                <Input
                  label="Date Applied *"
                  type="date"
                  placeholder="Date Applied"
                  value={newJob.dateApplied}
                  onChange={e => setNewJob({ ...newJob, dateApplied: e.target.value })}
                />
              </div>
              <Input
                label="Extra Details (optional)"
                type="text"
                placeholder="Notes, recruiter name, referral…"
                value={newJob.extraDetails ?? ''}
                onChange={e => setNewJob({ ...newJob, extraDetails: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { setIsAdding(false); setFormError(''); }}>Cancel</Button>
              <Button variant="primary" onClick={addJob} disabled={loading}>{loading ? 'Saving…' : 'Save Job'}</Button>
            </div>
          </Panel>
        )}

        {/* ── Filter panel ── */}
        {isSearching && (
          <Panel title="Filter Applications" onClose={() => setIsSearching(false)}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.25rem' }}>
              <Input
                label="Company or Role"
                type="text"
                placeholder="Search…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <Input
                label="Status"
                type="select"
                placeholder="All statuses"
                value={searchStatus}
                onChange={e => setSearchStatus(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => { setSearchQuery(''); setSearchStatus(''); }}>Clear filters</Button>
              <Button variant="secondary" onClick={() => setIsSearching(false)}>Done</Button>
            </div>
          </Panel>
        )}

        {/* ── Sort bar ── */}
        {allJobs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginRight: '4px' }}>Sort:</span>
            <SortBtn field="dateApplied" label="Date"    />
            <SortBtn field="company"     label="Company" />
            <SortBtn field="role"        label="Role"    />
            <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {displayJobs.length} of {allJobs.length} application{allJobs.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {/* ── Job grid ── */}
        {loading && !isAdding ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>Loading applications…</div>
        ) : displayJobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</p>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 600 }}>
              {allJobs.length === 0 ? 'No applications yet' : 'No results match your filters'}
            </p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '6px' }}>
              {allJobs.length === 0 ? 'Click "Add Job" to get started' : 'Try clearing your filters'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {displayJobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={() => navigate(`/jobs/${job.id}`)}
                onDelete={() => setConfirmDelete({ isOpen: true, jobId: job.id! })}
              />
            ))}
          </div>
        )}

        {/* ── Sign out ── */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="ghost" onClick={() => { removeCurrentUser(); navigate('/'); }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </Button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <ConfirmModal
        isOpen={confirmDelete.isOpen} title="Delete Application?" message={MESSAGES.CONFIRM_DELETE}
        onConfirm={confirmDeleteJob} onCancel={() => setConfirmDelete({ isOpen: false, jobId: null })}
        confirmText="Delete" cancelText="Cancel"
      />
    </div>
  );
};

export default Home;