import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TamilNews.css';

const TamilNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('tamil');

  const apiKey = '3ab53a4e5310424dbe67f46551b27c21'; // Replace with your API key
  const baseUrl = `https://newsapi.org/v2/everything?q=${query}&language=ta&apiKey=${apiKey}`;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(baseUrl);
        if (response.data.articles && response.data.articles.length > 0) {
          setArticles(response.data.articles);
        } else {
          setError('No articles available.');
        }
      } catch (err) {
        setError('Failed to fetch Tamil news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchQuery = e.target.elements.search.value;
    if (searchQuery) {
      setQuery(searchQuery);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-page1">
      <header className="header1">
        <h1 className="home-title1">முக்கிய செய்தி</h1>

        <form className="search-bar1" onSubmit={handleSearch}>
          <input
            type="text"
            name="search"
            placeholder="செய்திகளை இங்கே தேடுங்கள்....."
            className="search-input1"
          />
          
        </form>
      </header>

      <div className="articles-container3">
        <div className="articles-grid3">
          {articles.map((article) => (
            <div key={article.url} className="article-card3">
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="article-image3" />
              )}
              <div className="article-content3">
                <h2 className="article-title3">{article.title}</h2>
                <p className="article-date3">Published: {new Date(article.publishedAt).toDateString()}</p>
                <p className="article-description3">{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more3">மேலும் படிக்க</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TamilNews;
