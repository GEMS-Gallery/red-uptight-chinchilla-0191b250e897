import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, CircularProgress } from '@mui/material';
import HomePage from './components/HomePage';
import PostPage from './components/PostPage';
import NewPostPage from './components/NewPostPage';

const App: React.FC = () => {
  return (
    <div className="App">
      <AppBar position="static" style={{ backgroundColor: '#3498db' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Zurich & Dubai Blog
            </Link>
          </Typography>
          <Link to="/new-post" style={{ color: 'white', textDecoration: 'none' }}>
            Add New Post
          </Link>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/new-post" element={<NewPostPage />} />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
