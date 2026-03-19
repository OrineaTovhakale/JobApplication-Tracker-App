import axios, { AxiosError } from 'axios';
import type { Job } from '../types/Job';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const handleError = (err: unknown): never => {
  if (err instanceof AxiosError) {
    throw new Error(err.response?.data?.message ?? err.message);
  }
  throw err;
};

export const userService = {
  async login(username: string, _password: string) {
    try {
      const response = await api.get<{ username: string; password: string }[]>(
        `/users?username=${encodeURIComponent(username)}`
      );
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async register(username: string, password: string) {
    try {
      const response = await api.post('/users', { username, password });
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async checkUsernameExists(username: string): Promise<boolean> {
    try {
      const response = await api.get(`/users?username=${encodeURIComponent(username)}`);
      return response.data.length > 0;
    } catch (err) { return handleError(err); }
  },
};

export const jobService = {
  async getAllJobs(): Promise<Job[]> {
    try {
      const response = await api.get<Job[]>('/jobs');
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async getJobById(id: string): Promise<Job> {
    try {
      const response = await api.get<Job>(`/jobs/${id}`);
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async getJobsByUsername(username: string): Promise<Job[]> {
    try {
      const response = await api.get<Job[]>(
        `/jobs?username=${encodeURIComponent(username)}`
      );
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async createJob(job: Job): Promise<Job> {
    try {
      const response = await api.post<Job>('/jobs', job);
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async updateJob(id: string | number, job: Job): Promise<Job> {
    try {
      const response = await api.put<Job>(`/jobs/${id}`, job);
      return response.data;
    } catch (err) { return handleError(err); }
  },

  async deleteJob(id: string | number): Promise<void> {
    try {
      await api.delete(`/jobs/${id}`);
    } catch (err) { return handleError(err); }
  },
};