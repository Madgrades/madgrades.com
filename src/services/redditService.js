import axios from 'axios';

class RedditService {
  constructor() {
    this.subreddit = 'UWMadison';
  }

  async searchCourseDiscussions(courseCode) {
    try {
      console.log('RedditService: Starting search for course:', courseCode);
      
      if (!courseCode) {
        console.error('RedditService: Invalid course code:', courseCode);
        throw new Error('Invalid course code provided');
      }

      // Format the search query to handle course codes better
      const searchQuery = courseCode.replace(/\s+/g, ' ').trim();
      console.log('RedditService: Using search query:', searchQuery);

      // Reddit search API endpoint
      const url = `https://www.reddit.com/r/${this.subreddit}/search.json`;
      console.log('RedditService: Making request to:', url);

      const response = await axios.get(url, {
        params: {
          q: searchQuery,
          restrict_sr: true,
          sort: 'relevance',
          limit: 25,
          raw_json: 1
        }
      });

      console.log('RedditService: Received response status:', response.status);
      console.log('RedditService: Response data structure:', {
        hasData: !!response.data,
        hasChildren: !!response.data?.data?.children,
        childrenCount: response.data?.data?.children?.length
      });

      if (!response.data?.data?.children) {
        console.error('RedditService: Unexpected response format:', response.data);
        throw new Error('Invalid Reddit API response format');
      }

      const processedData = this.processRedditData(response.data.data.children);
      console.log('RedditService: Processed posts count:', processedData.length);
      return processedData;
    } catch (error) {
      console.error('RedditService: Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        courseCode,
        stack: error.stack
      });
      throw new Error(`Failed to fetch Reddit data: ${error.message}`);
    }
  }

  processRedditData(posts) {
    try {
      return posts.map(post => ({
        id: post.data.id,
        title: post.data.title,
        selftext: post.data.selftext || '',
        url: `https://reddit.com${post.data.permalink}`,
        score: post.data.score,
        numComments: post.data.num_comments,
        created: new Date(post.data.created_utc * 1000)
      }));
    } catch (error) {
      console.error('RedditService: Error processing posts:', error);
      throw new Error('Failed to process Reddit posts');
    }
  }
}

export default new RedditService(); 