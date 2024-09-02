import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, CircularProgress } from '@mui/material';
import { backend } from '../../declarations/backend';

const NewPostPage: React.FC = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({ title: '', content: '', author: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await backend.addPost(post.title, post.content, post.author, post.image ? [post.image] : []);
      navigate(`/post/${result}`);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Author"
          value={post.author}
          onChange={(e) => setPost({ ...post, author: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Content"
          value={post.content}
          onChange={(e) => setPost({ ...post, content: e.target.value })}
          fullWidth
          margin="normal"
          multiline
          rows={6}
          required
        />
        <TextField
          label="Image URL (optional)"
          value={post.image}
          onChange={(e) => setPost({ ...post, image: e.target.value })}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" disabled={submitting}>
          {submitting ? <CircularProgress size={24} /> : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};

export default NewPostPage;
