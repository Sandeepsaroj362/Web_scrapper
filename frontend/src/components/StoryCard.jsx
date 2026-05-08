import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bookmark, MessageSquare, User as UserIcon, Clock, ChevronUp } from 'lucide-react';
import axios from 'axios';

const StoryCard = ({ story }) => {
  const { user, updateBookmarkedStories } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const isBookmarked = user?.bookmarkedStories?.includes(story._id);

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      const res = await axios.post(`http://localhost:5000/api/stories/${story._id}/bookmark`);
      updateBookmarkedStories(res.data.bookmarkedStories);
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  };

  return (
    <div className="story-card">
      <div className="story-content">
        <h3 className="story-title">
          <a href={story.url} target="_blank" rel="noopener noreferrer">
            {story.title}
          </a>
        </h3>
        <div className="story-meta">
          <span className="meta-item"><ChevronUp size={14} className="text-accent" /> {story.points} points</span>
          <span className="meta-item"><UserIcon size={14} /> {story.author}</span>
          <span className="meta-item"><Clock size={14} /> {story.postedAt?.includes('T') ? story.postedAt.split(' ')[0].replace('T', ' ') : story.postedAt}</span>
        </div>
      </div>
      <button 
        onClick={toggleBookmark} 
        className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
      >
        <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
};

export default StoryCard;
