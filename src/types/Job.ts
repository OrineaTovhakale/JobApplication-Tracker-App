export interface Job {
  id?: number;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewed' | 'Offered' | 'Rejected';
  dateApplied: string;
  extraDetails?: string;
  username: string;
}