import axios from 'axios';
import type { Job } from '../types/Job';
import { API_BASE_URL } from '../constants';

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const userService = {
  async login(username: string, password: string) {
    const response = await api.get(`/users?username=${username}`);
    return response.data;
  },

  async register(username: string, password: string) {
    const response = await api.post('/users', { username, password });
    return response.data;
  },

  async checkUsernameExists(username: string) {
    const response = await api.get(`/users?username=${username}`);
    return response.data.length > 0;
  },
};

// Job API calls
export const jobService = {
  async getAllJobs() {
    const response = await api.get('/jobs');
    return response.data;
  },

  async getJobById(id: string) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(job: Job) {
    const response = await api.post('/jobs', job);
    return response.data;
  },

  async updateJob(id: string | number, job: Job) {
    const response = await api.put(`/jobs/${id}`, job);
    return response.data;
  },

  async deleteJob(id: string | number) {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  async getJobsByUsername(username: string) {
    const allJobs = await this.getAllJobs();
    return allJobs.filter((job: Job) => job.username === username);
  },
};