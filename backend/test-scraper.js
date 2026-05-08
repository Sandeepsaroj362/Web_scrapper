const axios = require('axios');
const cheerio = require('cheerio');

const testScrape = async () => {
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
      const postedAt = subtext.find('.age').attr('title') || subtext.find('.age').text();

      stories.push({ hnId, title, url, points, author, postedAt });
    });

    console.log(`Successfully scraped ${stories.length} stories:\n`);
    console.log(JSON.stringify(stories, null, 2));
  } catch (error) {
    console.error('Error scraping Hacker News:', error.message);
  }
};

testScrape();
