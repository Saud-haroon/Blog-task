import {  useEffect, useState } from 'react';
import { Button, Typography, Tabs, Pagination,  Alert, Skeleton } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { fetchUserPosts } from '../services/postService';


const { TabPane } = Tabs;

interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  date: string;
}

export default function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 4;

  const navigate = useNavigate();
  const [userId] = useState(() => Math.floor(Math.random() * 10) + 1);

  const fetchPosts = async (page: number) => {
  setLoading(true);
  setError(null);

  try {
    const data = await fetchUserPosts(userId, page, postsPerPage);
    setPosts(data.posts);
    setTotalPosts(data.totalPosts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    setError('Failed to fetch posts. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const renderPosts = () => {
    if (loading) {
      return Array.from({ length: postsPerPage }).map((_, i) => (
        <Skeleton key={i} active avatar paragraph={{ rows: 2 }} />
      ));
    }

    if (error) {
      return <Alert message="Error" description={error} type="error" showIcon />;
    }

    if (Array.isArray(posts) && posts.length === 0) {
      return <Typography.Text>No blog posts found.</Typography.Text>;
    }

    return posts.map((post) => (
      <div
        key={post.id}
        style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '16px',
          alignItems: 'flex-start',
          gap: '16px',
          cursor: 'pointer',
        }}
      >
        <img
          src={post.image || '/public/image.png'}
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
          <Typography.Title
            level={5}
            style={{
              marginBottom: 8,
              margin: 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{post.title}</span>
            <Typography.Text type="secondary" style={{ fontSize: '13px', fontWeight: 600 }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </Typography.Text>
          </Typography.Title>
          <Typography.Paragraph style={{ marginBottom: 8 }}>{post.content}</Typography.Paragraph>
          <Button
            type="link"
            style={{
              color: "rgb(128, 0, 64)",
              padding: 0,
              fontWeight: 500,
              
            }}
            onClick={() => navigate(`/posts/${post.id}`, { state: { post } })}
          >
            Read More
          </Button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <img
            src="/public/image.png"
            alt="Blog Icon"
            style={{ width: 50, height: 50, marginRight: 12, borderRadius: 8 }}
          /> */}
          <div>
            <Typography.Title level={5} style={{ margin: 0 }}>
              All Blog Posts
            </Typography.Title>
            <Typography.Text style={{ color: 'gray', fontSize: '14px' }}>
              Qatar Development Bank
            </Typography.Text>
          </div>
        </div>

        <Button type="default">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 4 }}>
            <UpOutlined />
            <DownOutlined />
          </div>
          Filter / Sort
        </Button>
      </div>

      <Tabs
        className="custom-tabs"
        style={{
          padding: '16px',
          backgroundColor: '#fff',
          borderRadius: '8px',
        }}
        defaultActiveKey="1"
      >
        <TabPane tab="ALL POSTS" key="1">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {renderPosts()}
          </div>

          {!loading && !error && posts.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <Pagination
                current={currentPage}
                pageSize={postsPerPage}
                total={totalPosts}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </TabPane>

        <TabPane tab="LATEST POSTS" key="2">
          <p>Latest posts will appear here.</p>
        </TabPane>

        <TabPane tab="ARCHIVED" key="3">
          <p>Archived posts will appear here.</p>
        </TabPane>
      </Tabs>
    </>
  );
}
