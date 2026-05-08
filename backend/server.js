require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const scrapeHackerNews = require('./utils/scraper');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);

app.post('/api/scrape', async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.json({ message: 'Scraping successful', count: stories.length });
  } catch (error) {
    res.status(500).json({ message: 'Scraping failed', error: error.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Run scraper automatically on server start
    scrapeHackerNews().catch(console.error);
  })
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
