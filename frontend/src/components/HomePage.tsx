import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Post {
  id: bigint;
  title: string;
  content: string;
  author: string;
  createdAt: bigint;
  image: string | null;
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await backend.getPosts();
        setPosts(result);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div className="hero-image mb-8"></div>
      <Typography variant="h4" component="h1" gutterBottom>
        Latest Blog Posts
      </Typography>
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id.toString()}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  <Link to={`/post/${post.id}`}>{post.title}</Link>
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  By {post.author} on {new Date(Number(post.createdAt) / 1000000).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  {post.content.substring(0, 100)}...
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;
