import React, { useState, useEffect, useRef } from 'react';
import { Segment, Header, Loader, Message, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import redditService from '../services/redditService';
import summaryService from '../services/summaryService';
import CourseName from './CourseName';
import ReactMarkdown from 'react-markdown';

const CourseRedditInsights = ({ uuid }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [courseCode, setCourseCode] = useState(null);
  const courseNameRef = useRef(null);

  // First, get the course code
  useEffect(() => {
    const getCourseCode = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (courseNameRef.current) {
          const code = courseNameRef.current.textContent.trim();
          console.log('Found course code:', code, 'for UUID:', uuid);
          setCourseCode(code);
        } else {
          console.error('Could not find course name element for UUID:', uuid);
          setError('Could not find course code');
        }
      } catch (error) {
        console.error('Error getting course code:', error);
        setError('Failed to get course code');
      }
    };

    getCourseCode();
  }, [uuid]);

  // Then fetch Reddit insights once we have the course code
  useEffect(() => {
    const fetchInsights = async () => {
      if (!courseCode) {
        console.log('No course code available yet');
        return;
      }

      console.log('Starting to fetch insights for course:', courseCode);
      setLoading(true);
      setError(null);
      
      try {
        const posts = await redditService.searchCourseDiscussions(courseCode);
        console.log('Received posts:', posts);
        
        if (posts.length === 0) {
          setSummary('No Reddit discussions found for this course.');
          return;
        }

        const summaryText = await summaryService.generateCourseSummary(posts);
        setSummary(summaryText);
      } catch (error) {
        console.error('Error in CourseRedditInsights:', error);
        setError(error.message || 'Failed to fetch course insights from Reddit');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [courseCode, retryCount]);

  const handleRetry = () => {
    console.log('Retrying with course code:', courseCode);
    setRetryCount(prev => prev + 1);
  };

  return (
    <Segment>
      <Header as='h2'>
        Reddit Insights
        <Header.Subheader>
          What students are saying about this course
        </Header.Subheader>
      </Header>

      {loading && (
        <Loader active inline='centered'>
          Loading insights...
        </Loader>
      )}

      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
          <Button onClick={handleRetry} style={{ marginTop: '1em' }}>
            Retry
          </Button>
        </Message>
      )}

      {!loading && !error && summary && (
        <div className="reddit-insights" style={{ 
          fontSize: '1.1em',
          lineHeight: '1.6',
          padding: '1em'
        }}>
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <Header as='h2' {...props} />,
              h2: ({node, ...props}) => <Header as='h3' {...props} />,
              h3: ({node, ...props}) => (
                <Header 
                  as='h4' 
                  style={{
                    marginTop: '2em',
                    marginBottom: '1em',
                    color: '#666'
                  }}
                  {...props} 
                />
              ),
              ul: ({node, ...props}) => <ul style={{marginLeft: '1.5em'}} {...props} />,
              li: ({node, ...props}) => <li style={{marginBottom: '0.5em'}} {...props} />,
              p: ({node, ...props}) => <p style={{marginBottom: '1em'}} {...props} />,
              strong: ({node, children, ...props}) => {
                // Check if this is a citation number
                const isCitation = /^\[\d+\]$/.test(children[0]);
                return (
                  <strong 
                    style={{
                      color: isCitation ? '#666' : '#2185d0',
                      fontWeight: isCitation ? '600' : 'bold'
                    }} 
                    {...props}
                  >
                    {children}
                  </strong>
                );
              },
              a: ({node, href, children, ...props}) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    color: '#2185d0',
                    textDecoration: 'none',
                    borderBottom: '1px dotted #2185d0',
                    marginRight: '1em',
                    display: 'inline-block'
                  }}
                  {...props} 
                >
                  {children}
                </a>
              ),
              hr: ({node, ...props}) => (
                <div 
                  style={{
                    margin: '2em 0',
                    borderTop: '1px solid rgba(34,36,38,.15)',
                    borderBottom: '1px solid rgba(255,255,255,.1)'
                  }}
                  {...props}
                />
              )
            }}
          >
            {summary}
          </ReactMarkdown>
        </div>
      )}

      <div style={{ display: 'none' }}>
        <span ref={courseNameRef}>
          <CourseName uuid={uuid} asSubjectAndNumber={true} />
        </span>
      </div>
    </Segment>
  );
};

CourseRedditInsights.propTypes = {
  uuid: PropTypes.string.isRequired
};

export default CourseRedditInsights; 