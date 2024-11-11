import React, { useState, useEffect } from 'react';
import './IndianNewsAggregator.css';

const IndianNewsAggregator = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch Indian news from MediaStack API
  const fetchIndianNews = async () => {
    const accessKey = 'fa6ffa113a93371e4cff166555c5dd0d'; // Replace with your MediaStack API access key
    const url = `https://api.mediastack.com/v1/news?access_key=${accessKey}&countries=in`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      // Check if the response contains articles
      if (data.data && data.data.length > 0) {
        setArticles(data.data);
        setFilteredArticles(data.data); // Initialize filtered articles
        setErrorMessage('');
      } else {
        setArticles([]);
        setFilteredArticles([]);
        setErrorMessage("No articles available for India.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setErrorMessage("An error occurred while fetching news. Please try again later.");
    }
  };

  // Fetch Indian news when the component mounts
  useEffect(() => {
    fetchIndianNews();
  }, []);

  // Format the published date and time
  const formatPublishedDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleString('en-IN', options);
  };

  // Function to handle sharing the article via email
  const handleEmailShare = (title, url) => {
    const subject = encodeURIComponent(`Check out this article: ${title}`);
    const body = encodeURIComponent(`I found this article interesting:\n\n${title}\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter articles based on the search term
    const filtered = articles.filter(article =>
      article.title.toLowerCase().includes(value.toLowerCase()) ||
      article.description.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredArticles(filtered);
  };

  return (
    <div className="body-div">
      <h1>Indian News Aggregator</h1>

      {/* Search Input */}
      <div className="search-container">
    <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input2"
    />
</div>
      {/* Display error message if there is one */}
      {errorMessage && <p className="error-message2">{errorMessage}</p>}

      {/* Display articles if available */}
      <div>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <div key={index} className="article2">
              <h3>{article.title}</h3>
              {article.image && (
                <img src={article.image} alt="Article" />
              )}
              <p>{article.description}</p>
              <p className="published-date2">
                <strong>Published At:</strong> {formatPublishedDate(article.published_at)}
              </p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more2">Read more</a>
              {/* Share via Email Button */}
              <button onClick={() => handleEmailShare(article.title, article.url)} className="share-button2">Share via Email</button>
            </div>
          ))
        ) : (
          !errorMessage && <p>No articles found.</p>
        )}
      </div>
    </div>
  );
};

export default IndianNewsAggregator;
