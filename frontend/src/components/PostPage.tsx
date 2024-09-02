import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, TextField, Button, Card, CardContent } from '@mui/material';
import { backend } from '../../declarations/backend';

interface Post {
  id: bigint;
  title: string;
  content: string;
  author: string;
  createdAt: bigint;
  image: string | null;
}

interface Comment {
  id: bigint;
  postId: bigint;
  author: string;
  content: string;
  createdAt: bigint;
  website: string | null;
}

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({ author: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const postResult = await backend.getPost(BigInt(id!));
        if ('ok' in postResult) {
          setPost(postResult.ok);
          const commentsResult = await backend.getComments(BigInt(id!));
          setComments(commentsResult);
        } else {
          console.error('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post and comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostAndComments();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await backend.addComment(BigInt(id!), newComment.author, newComment.content, null);
      if ('ok' in result) {
        const updatedComments = await backend.getComments(BigInt(id!));
        setComments(updatedComments);
        setNewComment({ author: '', content: '' });
      } else {
        console.error('Error adding comment:', result.err);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <Typography>Post not found</Typography>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1" gutterBottom>
        {post.title}
      </Typography>
      <Typography color="textSecondary" gutterBottom>
        By {post.author} on {new Date(Number(post.createdAt) / 1000000).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" paragraph>
        {post.content}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Comments
      </Typography>
      {comments.map((comment) => (
        <Card key={comment.id.toString()} className="mb-4">
          <CardContent>
            <Typography variant="subtitle2">{comment.author}</Typography>
            <Typography variant="body2">{comment.content}</Typography>
            <Typography variant="caption">
              {new Date(Number(comment.createdAt) / 1000000).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <TextField
          label="Your Name"
          value={newComment.author}
          onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Your Comment"
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          fullWidth
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button type="submit" variant="contained" color="primary" disabled={submitting}>
          {submitting ? <CircularProgress size={24} /> : 'Submit Comment'}
        </Button>
      </form>
    </div>
  );
};

export default PostPage;
