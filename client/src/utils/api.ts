import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Class APIs
export const classAPI = {
  createClass: async (classData: any) => {
    const response = await api.post('/classes', classData);
    return response.data;
  },

  getTeacherClasses: async () => {
    const response = await api.get('/classes/teacher');
    return response.data;
  },

  getStudentClasses: async () => {
    const response = await api.get('/classes/student');
    return response.data;
  },

  joinClass: async (enrollmentCode: string) => {
    const response = await api.post('/classes/join', { enrollmentCode });
    return response.data;
  },

  getClassDetails: async (classId: string) => {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  },

  removeStudent: async (classId: string, studentId: string) => {
    const response = await api.delete(`/classes/${classId}/students/${studentId}`);
    return response.data;
  }
};

export default api;