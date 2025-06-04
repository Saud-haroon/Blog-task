import { useParams, useLocation } from 'react-router-dom';
import { useState, useEffect, ChangeEvent } from 'react';
import { Input, Button, message, Typography } from 'antd';
import api from '../api/axios';
import { updateUserPosts } from '../services/updateUserPost';
import { fetchUserPosts } from '../services/postService';

interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const passedPost = location.state?.post as Post | undefined;

  const [post, setPost] = useState<Post | null>(passedPost || null);
  const [formData, setFormData] = useState<Post>(passedPost || { title: '', content: '', id: 0 });
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (post) return; 
    if (!id) return;

    const userId = Math.floor(parseInt(id) / 10);
    let response : any = fetchUserPosts(userId , 1 , 10)
    const found = response.data.posts.find((p : any) => p.id === parseInt(id));
     if (found) {
        setPost(found);
        setFormData(found);
      }
  }, [id, post]);

  const handleSave = async () => {
    if (!id) return;
    try {
      let updatedPostData : any = updateUserPosts(id, formData)
      setPost(updatedPostData);
      setEdit(false);
      message.success('Post updated');
    } catch (error) {
      console.error('Failed to update post:', error);
      message.error('Failed to update post');
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div style={{ padding: '16px' }}>
      {edit ? (
        <>
          <Input
            value={formData.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: e.target.value })
            }
            style={{ marginBottom: '8px' }}
          />
          <Input.TextArea
            rows={4}
            value={formData.content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, content: e.target.value })
            }
          />
          <Button className='flagColor' type="primary" onClick={handleSave} style={{ marginTop: '8px' } }>
            Save
          </Button>
        </>
      ) : (
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            padding: '16px',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <img
            src={post.image}
            alt="Blog"
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              objectFit: 'cover',
              marginRight: 16,
            }}
          />
          <div style={{ flex: 1 }}>
            <Typography.Title style={{ margin: 0 }} level={5}>
              {post.title}
            </Typography.Title>
            <Typography.Paragraph>{post.content}</Typography.Paragraph>
            <div style={{ marginTop: 8 }}>
              <Button className='flagColor' type="primary" onClick={() => setEdit(true)}>
                Edit
              </Button>
              <Button danger style={{ marginLeft: '8px' }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
