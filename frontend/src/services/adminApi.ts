import { api } from './api';

export interface AdminOverview {
  months: string[];
  newClassesPerMonth: number[];
  incomePerMonth: number[];
  pendingEnrollments: number;
}

export interface AdminUser {
  id: number;
  username: string;
  role: 'admin';
  name: string;
}

export const adminApi = {
  async login(username: string, password: string): Promise<AdminUser> {
    const res = await api.post('/admin/login', { username, password });
    return res.data.data;
  },

  async getOverview(): Promise<AdminOverview> {
    const res = await api.get('/admin/overview');
    return res.data.data;
  }
};


