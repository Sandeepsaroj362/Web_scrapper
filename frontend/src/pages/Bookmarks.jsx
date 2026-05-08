import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StoryCard from '../components/StoryCard';
import { AuthContext } from '../context/AuthContext';

const Bookmarks = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      if (!user?.bookmarkedStories || user.bookmarkedStories.length === 0) {
        setStories([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const storyPromises = user.bookmarkedStories.map(id => 
          axios.get(`http://localhost:5000/api/stories/${id}`).then(res => res.data).catch(() => null)
        );
        
        const results = await Promise.all(storyPromises);
        setStories(results.filter(s => s !== null));
      } catch (error) {
        console.error("Failed to fetch bookmarked stories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedStories();
  }, [user?.bookmarkedStories]);

  return (
    <div>
      <div className="header-actions">
        <h1>Your Bookmarks</h1>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : stories.length === 0 ? (
        <p className="text-center mt-4">You haven't bookmarked any stories yet.</p>
      ) : (
        <div className="stories-list">
          {stories.map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
