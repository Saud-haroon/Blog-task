import api from '../api/axios';

interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export const updateUserPosts = async (id : string, formData : Post) => {
 const response = await api.patch<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`, formData);
  return response.data;
};


