const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com/');
    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').slice(0, 10).each((i, el) => {
      const hnId = $(el).attr('id');
      const title = $(el).find('.titleline > a').first().text();
      const url = $(el).find('.titleline > a').first().attr('href');
      
      const subtext = $(el).next();
      const pointsText = subtext.find('.score').text();
      const points = pointsText ? parseInt(pointsText) : 0;
      const author = subtext.find('.hnuser').text();
      
      let postedAtStr = subtext.find('.age').attr('title');
      let postedAt;
      if (postedAtStr) {
        const isoStr = postedAtStr.split(' ')[0];
        const dateObj = new Date(isoStr);
        if (!isNaN(dateObj.getTime())) {
          const yyyy = dateObj.getFullYear();
          const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(dateObj.getDate()).padStart(2, '0');
          const hh = String(dateObj.getHours()).padStart(2, '0');
          const min = String(dateObj.getMinutes()).padStart(2, '0');
          postedAt = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
        } else {
          postedAt = subtext.find('.age').text();
        }
      } else {
        postedAt = subtext.find('.age').text();
      }

      stories.push({
        hnId,
        title,
        url,
        points,
        author,
        postedAt
      });
    });

    for (let story of stories) {
      await Story.findOneAndUpdate(
        { hnId: story.hnId },
        story,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    
    console.log('Top 10 Hacker News stories scraped successfully.');
    return stories;
  } catch (error) {
    console.error('Error scraping Hacker News:', error.message);
    throw error;
  }
};

module.exports = scrapeHackerNews;
