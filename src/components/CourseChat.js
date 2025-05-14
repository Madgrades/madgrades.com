import React, { useState, useRef, useEffect } from 'react';
import { Segment, Input, Button, Header, Comment, Icon } from 'semantic-ui-react';
import axios from 'axios';

const CourseChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `You are a helpful course advisor for UW-Madison students. You help students find courses that match their requirements and interests.
              
Previous conversation:
${messages.map(m => `${m.sender === 'user' ? 'Student' : 'Advisor'}: ${m.text}`).join('\n')}

Student: ${input}

Provide a helpful response suggesting specific courses. Include course codes and brief descriptions. Focus on being informative and specific.`
            }]
          }]
        }
      );

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.candidates[0].content.parts[0].text,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Segment>
      <Header as='h2'>
        <Icon name='graduation cap' />
        <Header.Content>
          Course Advisor
          <Header.Subheader>Ask me about course recommendations!</Header.Subheader>
        </Header.Content>
      </Header>

      <Segment 
        style={{ 
          height: '400px', 
          overflowY: 'auto',
          marginBottom: '1em',
          background: '#f8f9fa'
        }}
      >
        <Comment.Group>
          {messages.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#666', 
              marginTop: '2em',
              fontStyle: 'italic'
            }}>
              Try asking something like:
              <div style={{ marginTop: '1em' }}>
                "What are some good social science courses?"
              </div>
              <div style={{ marginTop: '0.5em' }}>
                "Suggest some easy humanities courses"
              </div>
              <div style={{ marginTop: '0.5em' }}>
                "What CS courses should I take after CS 300?"
              </div>
            </div>
          )}
          
          {messages.map(message => (
            <Comment key={message.id} style={{
              maxWidth: '80%',
              marginLeft: message.sender === 'user' ? 'auto' : '0',
              marginRight: message.sender === 'bot' ? 'auto' : '0',
              marginBottom: '1em'
            }}>
              <Comment.Content style={{
                background: message.sender === 'user' ? '#007bff' : '#e9ecef',
                color: message.sender === 'user' ? 'white' : 'black',
                padding: '1em',
                borderRadius: '1em',
                whiteSpace: 'pre-wrap'
              }}>
                <Comment.Text>{message.text}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}
          <div ref={messagesEndRef} />
        </Comment.Group>
      </Segment>

      <div style={{ display: 'flex', gap: '1em' }}>
        <Input
          fluid
          placeholder="Ask about course recommendations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isLoading}
        />
        <Button
          primary
          icon
          labelPosition='right'
          onClick={handleSubmit}
          disabled={isLoading}
        >
          Send
          <Icon name='send' />
        </Button>
      </div>
    </Segment>
  );
};

export default CourseChat; 