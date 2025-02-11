import React, { useEffect, useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import './AuthorSelector.css'

interface Author {
  id: number;
  name: string;
}

interface Article {
  id: number;
  title: string;
  body: string;
}

const AuthorSelector: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(false);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (selectedAuthor) {
      const fetchArticles = async () => {
        setLoadingArticles(true);
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${selectedAuthor.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch articles');
          }
          const data = await response.json();
          setArticles(data);
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
          setLoadingArticles(false);
        }
      };
      fetchArticles();
    }
  }, [selectedAuthor]);

  return (
    <div>
      <Autocomplete
        disablePortal
        options={authors}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => setSelectedAuthor(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select Author"
            variant="outlined"
            fullWidth
          />
        )}
      />
      <div>
        {loadingArticles ? (
          <CircularProgress />
        ) : (
          <div className='articles-container'>
            {articles.length > 0 ? (
              articles.map((article) => (
                <div key={article.id} className='article-container'>
                  <h3>{article.title}</h3>
                  <p>{article.body}</p>
                </div>
              ))
            ) : (
              <p>No articles found for this author</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorSelector;