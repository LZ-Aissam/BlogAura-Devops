import { api } from './apiClient';

export const checkHealth = async () => {
  try {
    const { data } = await api.get('/');
    return data;
  } catch (err) {
    return { db_status: "offline" };
  }
};
