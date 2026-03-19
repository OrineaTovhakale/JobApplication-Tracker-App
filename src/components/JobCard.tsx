import React from 'react';
import type { Job } from '../types/Job';

const statusConfig: Record<Job['status'], { cls: string; accent: string }> = {
  Applied:     { cls: 'badge badge-applied',      accent: 'var(--color-amber)'  },
  Interviewed: { cls: 'badge badge-interviewed',  accent: 'var(--color-green)'  },
  Rejected:    { cls: 'badge badge-rejected',     accent: 'var(--color-red)'    },
};

const CalendarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

interface JobCardProps {
  job: Job;
  onEdit: () => void;
  onDelete: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const { cls, accent } = statusConfig[job.status];
  const [hovered, setHovered] = React.useState(false);

  const formattedDate = (() => {
    try {
      return new Date(job.dateApplied).toLocaleDateString('en-ZA', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch {
      return job.dateApplied;
    }
  })();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--color-surface)',
        border: '1.5px solid var(--color-border)',
        borderLeft: `4px solid ${accent}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'box-shadow var(--transition), transform var(--transition)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
            {job.company}
          </p>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
            {job.role}
          </h3>
        </div>
        <span className={cls} style={{ flexShrink: 0 }}>{job.status}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
        <CalendarIcon />
        {formattedDate}
      </div>

      {job.extraDetails && (
        <p style={{
          fontSize: '0.83rem', color: 'var(--color-text-secondary)', lineHeight: 1.55,
          borderTop: '1px solid var(--color-border)', paddingTop: '10px',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {job.extraDetails}
        </p>
      )}

      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '2px' }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1, height: '36px', borderRadius: 'var(--radius-sm)',
            border: '1.5px solid var(--color-border)', background: 'var(--color-surface)',
            fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
            color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-indigo)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-indigo)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-primary)'; }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{
            flex: 1, height: '36px', borderRadius: 'var(--radius-sm)',
            border: '1.5px solid transparent', background: 'var(--color-red-soft)',
            fontSize: '0.83rem', fontWeight: 600, cursor: 'pointer',
            color: 'var(--color-red)', fontFamily: 'var(--font-sans)',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-red)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-red-soft)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-red)'; }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;