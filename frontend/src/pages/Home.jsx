import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchStories = async (currentPage) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/stories?page=${currentPage}&limit=${limit}`);
      setStories(res.data.stories);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch stories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories(page);
  }, [page]);

  const handleScrape = async () => {
    try {
      setScraping(true);
      await axios.post('http://localhost:5000/api/scrape');
      // Reset to page 1 and fetch fresh stories
      setPage(1);
      fetchStories(1);
    } catch (error) {
      console.error("Failed to scrape", error);
    } finally {
      setScraping(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div>
      <div className="header-actions">
        <h1>Top 10 New Stories</h1>
        <button onClick={handleScrape} disabled={scraping} className="btn">
          <RefreshCw size={16} className={scraping ? 'spin' : ''} /> 
          {scraping ? 'Scraping...' : 'Scrape'}
        </button>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : stories.length === 0 ? (
        <p className="text-center mt-4">No stories found. Try scraping!</p>
      ) : (
        <>
          <div className="stories-list">
            {stories.map(story => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
          
          <div className="pagination">
            <button 
              onClick={handlePrevPage} 
              disabled={page === 1}
              className="btn btn-secondary"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <span>Page {page} of {totalPages}</span>
            <button 
              onClick={handleNextPage} 
              disabled={page === totalPages || totalPages === 0}
              className="btn btn-secondary"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
