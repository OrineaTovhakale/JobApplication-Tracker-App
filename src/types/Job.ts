export interface Job {
  id?: number;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewed' | 'Rejected';
  dateApplied: string;
  extraDetails?: string;
  username: string;
}