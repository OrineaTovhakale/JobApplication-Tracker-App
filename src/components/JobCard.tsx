import React from 'react';
import type { Job } from '../types/Job';
import Button from './Button';
import styles from './JobCard.module.css';

const getStatusColor = (status: Job['status']) => {
  if (status === 'Rejected') return 'border-l-4 border-red-500';
  if (status === 'Applied') return 'border-l-4 border-yellow-500';
  return 'border-l-4 border-green-500';
};

const JobCard: React.FC<{ job: Job; onEdit: () => void; onDelete: () => void }> = ({ job, onEdit, onDelete }) => (
  <div className={`p-4 border rounded mb-8 ${getStatusColor(job.status)}`}>
    <h3 className="mb-2">{job.company} - {job.role}</h3>
    <p className="mb-2">Status: {job.status}</p>
    <p className="mb-2">Date: {job.dateApplied}</p>
    <Button onClick={onEdit} variant="edit" className="mr-4 bg-yellow-500">Edit</Button>
    <Button onClick={onDelete} variant="danger" className="bg-red-500">Delete</Button>
  </div>
);

export default JobCard;