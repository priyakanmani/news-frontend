import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './News.css'; // Import the CSS for styling

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const apiKey = '3ab53a4e5310424dbe67f46551b27c21'; // Your News API key
  const baseUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

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
        setError('Failed to fetch news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition is not supported in this browser.');
      alert('Sorry, your browser does not support voice search. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Voice recognition started. Speak now.');
      alert('Voice recognition started. Please speak.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      console.log('Voice input recognized: ', transcript);
      alert(`Searching for: ${transcript}`);
      fetchArticlesByVoice(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error: ', event.error);
      alert(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
      alert('Voice recognition ended.');
    };

    recognition.start();
  };

  const fetchArticlesByVoice = async (query) => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);
      if (response.data.articles && response.data.articles.length > 0) {
        setArticles(response.data.articles);
      } else {
        setError('No articles available for this search query.');
      }
    } catch (err) {
      setError('Failed to fetch news articles for this search query.');
    }
  };

  const handleSearchButtonClick = async () => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${apiKey}`);
      if (response.data.articles && response.data.articles.length > 0) {
        setArticles(response.data.articles);
      } else {
        setError('No articles found for this search.');
      }
    } catch (err) {
      setError('Failed to fetch news articles for this search.');
    }
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
        console.log('Article shared successfully!');
        alert('Article shared successfully!');
      } catch (error) {
        console.error('Error sharing article:', error);
        setError('Failed to share the article.');
      }
    } else {
      // If the browser does not support sharing, show an alert
      alert('Sorry, your browser does not support sharing. Please use a compatible browser.');
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    article.urlToImage && article.url
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="news-page1">
      <header className="header1">
        <h1 className="home-title1">Latest News</h1>
        <div className="search-bar1">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input1"
          />
          <button onClick={handleSearchButtonClick} className="search-button1">Search</button>
          <button onClick={handleVoiceSearch} className="voice-search-button1">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjk2otzVUKiNvwaTLPW0ZvfjFWRHjHbd0oXt7_iORxha_2RFIfLZc87Z1eoKHpky1xfeA&usqp=CAU" alt="Voice Search" />
          </button>
        </div>
      </header>
      <div className="articles-container1">
        <div className="articles-grid1">
          {filteredArticles.map((article) => (
            <div className="article-card1" key={article.url}>
              <img
                src={article.urlToImage || 'path/to/placeholder-image.jpg'}
                alt={article.title}
                className="article-image1"
              />
              <div className="article-content1">
                <h2 className="article-title1">{article.title || 'No Title Available'}</h2>
                <p className="article-date1">
                  Published: {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })} at {new Date(article.publishedAt).toLocaleTimeString()}
                </p>
                <p className="article-description1">{article.description || 'No description available.'}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="read-more1"
                >
                  Read More
                </a><br />
                {/* Share Article link */}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    handleShare(article); // Trigger share
                  }}
                  className="share-button1"
                >
                  Share Article
                </a>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
