import axios from 'axios';

class SummaryService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  }

  async generateCourseSummary(posts) {
    try {
      // Add reference numbers to posts for citation
      const numberedPosts = posts.map((post, index) => ({
        ...post,
        refNumber: index + 1
      }));

      const content = numberedPosts.map(post => `
[${post.refNumber}] Title: ${post.title}
Content: ${post.selftext}
Score: ${post.score}
Comments: ${post.numComments}
URL: ${post.url}
---
`).join('\n');

      const prompt = `
Analyze these Reddit discussions about a UW-Madison course and provide a detailed analysis in markdown format. Include citations to specific posts using [X] where X is the post reference number. Use the following structure:

# Analysis of [Course Name] Reddit Discussions:

**1. Overall Sentiment:** [positive/negative/mixed, with brief explanation] [cite relevant posts]

**2. Main Topics Discussed:**
* [Topic 1] [cite posts]
* [Topic 2] [cite posts]
* [etc.]

**3. Key Takeaways about the Course:**
* [Key point 1] [cite posts]
* [Key point 2] [cite posts]
* [etc.]

**4. Common Concerns and Praise:**
* **Common Concerns:**
  * [Concern 1] [cite posts]
  * [Concern 2] [cite posts]
* **Praise:**
  * [Praise 1] [cite posts]
  * [Praise 2] [cite posts]

**5. Brief Summary:**
[2-3 sentences summarizing the overall findings]

---

### Sources:
${numberedPosts.map(post => {
  // Format the title to be more readable
  const title = post.title
    .replace(/comp sci|comp|cs/gi, 'CS')  // Standardize CS naming
    .replace(/\s+/g, ' ')                 // Remove extra spaces
    .trim();
  
  return `**[${post.refNumber}]** [${title}](${post.url})`;
}).join('\n')}

Use markdown formatting for headers, bullet points, and emphasis. Make the analysis detailed but easy to read. Include relevant citations for each point to show where the information comes from.

Discussions to analyze:
${content}
`;

      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Gemini API Response:', response.data);

      if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected response format from Gemini API');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 403) {
        throw new Error('Invalid API key or API key not set. Please check your environment variables.');
      }
      
      throw new Error(`Failed to generate summary: ${error.message}`);
    }
  }
}

export default new SummaryService(); 