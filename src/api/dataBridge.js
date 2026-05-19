import { api } from './apiClient';

export function databridge() {
  return {
    getPosts,
    getUsers,
    getCommentsByPost,
    addComment,
    addPost
  }
}

export const getPosts = async () => {
  const res = await api.get('/posts/');
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get('/users/');
  return res.data;
};

export const getCommentsByPost = async (postId) => {
  const res = await api.get(`/comments/${postId}`);
  return res.data;
};
export const addComment = async (postId, text) => {
  const res = await api.post(`/comments/${postId}`, { "text":text });
  return res.data;
};

export const addPost = async (title, text, userId) => {
  const res = await api.post('/posts/', { "title": title, "text": text, "user_id": userId });
  return res.data;
};

export const addReact = async (postId, emoji) => {
  const res = await api.post(`/reacts/${postId}`, { emoji });
  return res.data;
}
export const removeReact = async (postId, emoji) => {
  const res = await api.delete(`/reacts/${postId}`, { data: { emoji } });
  return res.data;
}
