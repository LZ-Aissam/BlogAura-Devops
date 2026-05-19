import { api } from './apiClient';

export const login = async (mail, password) => {
  const { data } = await api.post('/auth/login', { mail: mail, password: password });
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};


export const register = async (pseudo, mail, password) => {
  const { data } = await api.post('/users', {mail: mail, pseudo: pseudo, password: password, can_edit: 0});
  await login(mail, password) // on se connecte directement apres inscription²
  return data;
}
