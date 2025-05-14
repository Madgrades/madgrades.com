import axios from 'axios';

class CourseChatService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    this.systemPrompt = `You are a helpful course advisor for UW-Madison students. Your role is to help students find courses that match their requirements and interests.

Key points to remember:
1. Always provide specific course codes and names
2. Include brief descriptions of recommended courses
3. Consider prerequisites when making recommendations
4. Suggest a reasonable number of courses (3-5 usually)
5. Explain why you're recommending each course
6. If relevant, mention typical workload and difficulty
7. Stay focused on UW-Madison courses only

Format your responses in a clear, structured way:

Here are some courses that might interest you:

1. COURSE_CODE: COURSE_NAME
   - Brief description
   - Why it's relevant
   - Any key information (difficulty, workload, etc.)

2. [Next course...]`;
  }

  async getCourseRecommendations(userInput, conversationHistory) {
    try {
      const conversation = conversationHistory.map(msg => 
        `${msg.sender === 'user' ? 'Student' : 'Advisor'}: ${msg.text}`
      ).join('\n');

      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: `${this.systemPrompt}

Previous conversation:
${conversation}

Student: ${userInput}

Provide course recommendations based on the student's request. Be specific and informative.`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.candidates && response.data.candidates[0].content.parts[0].text) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Unexpected response format from Gemini API');
      }
    } catch (error) {
      console.error('Error getting course recommendations:', error);
      throw error;
    }
  }
}

export default new CourseChatService(); 