import React, { useState, useEffect } from "react";
import { Container, Header } from "semantic-ui-react";
import PromoCard from "../containers/PromoCard";
import SearchBox from "../components/SearchBox";

const allPlaceholders = [
  // STEM & Core
  "Math 222",
  "Calculus 2",
  "Calculus 3",
  "General Chemistry I",
  "Chem 103",
  "Chem 104",
  "Organic Chemistry",
  "Chem 343",
  "Chem 345",
  "Bio 101",
  "Biology 151",
  "Biology 152",
  "Introductory Ecology",
  "Physics 103",
  "Physics 202",
  "Biochem 501",
  "Microeconomics",
  "Macroeconomics",
  "Econ 101",
  "Psych 202",
  "Introduction to Psychology",
  "Abnormal Psychology",
  "Stat 301",
  "Stat 371",
  "Analysis of Variance",
  "Comp Sci 300",
  "CS 200",
  "Programming I",
  "CS 400",
  "Machine Learning",
  "Introduction to Artificial Intelligence",
  "Anatomy 337",
  "Physiology 335",

  // Humanities & Social Sciences
  "Comm Arts 100",
  "Introduction to Speech Composition",
  "English 100",
  "Journalism 201",
  "Strategic Communication",
  "Gender & Women's Studies 103",
  "Soc 134",
  "Problems of American Racial and Ethnic Minorities",
  "Political Science 104",
  "Intro to American Politics",
  "Philosophy 101",
  "Ethics",
  "Logic",
  "History 101",
  "The Historian's Craft",
  "History of Science",
  "Anthropology 104",

  // Languages & Culture
  "Spanish 203",
  "Spanish 226",
  "First Semester French",
  "First Semester Italian",
  "Chinese 101",
  "Japanese 101",
  "African American Studies",
  "Folklore",
  "Classic 100",
  "Art History 202",

  // Business & Applied
  "Marketing 300",
  "Marketing Management",
  "Finance 300",
  "Accounting 100",
  "Business Law",
  "Real Estate 306",
  "Management 300",
  "Operations Management",
  "Consumer Science",
  "Personal Finance",
  "Nutritional Sciences 132",

  // Arts & Performance
  "Music 113",
  "Clap for Credit",
  "Concert Choir",
  "Drawing I",
  "Theatre 120",
  "Experiencing Theatre",
  "Intro to Media Production",
  "Contemporary Hollywood Cinema",

  // Niche & Interesting
  "Biology of Viruses",
  "Video Games and Learning",
  "Rhetoric of Campaigns and Revolutions",
  "Television Industries",
  "World Regions in Global Context",
  "Dynamics",
  "Thermodynamics",
  "Manufacturing: Polymers",
  "Global Change: Atmospheric Issues",
  "Scand St 101",
  "Forestry",
  "Wildlife Ecology",
  "Entomology",
  "Food Science",
  "Genetics 466",
  "Kinesiology 119",
  "Introduction to Mindfulness",
];

const Home = () => {
  document.title = "UW Madison Grade Distributions - Madgrades";

  const [placeholders, setPlaceholders] = useState([]);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    // Shuffle the placeholders on mount
    setPlaceholders([...allPlaceholders].sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    if (placeholders.length === 0) return;

    let timer;
    const i = loopNum % placeholders.length;
    const fullText = placeholders[i];

    const handleTyping = () => {
      const nextText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1);

      setText(nextText);

      let nextSpeed = isDeleting ? 30 : 150;

      if (!isDeleting && nextText === fullText) {
        nextSpeed = 2000;
        setIsDeleting(true);
      } else if (isDeleting && nextText === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        nextSpeed = 500;
      }

      setTypingSpeed(nextSpeed);
    };

    timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, placeholders]);

  return (
    <div className="Home">
      <div className="home-hero">
        <Container>
          <div className="hero-content">
            <h1 className="hero-title">
              Master your <span className="highlight-red">Badger</span> journey.
            </h1>
            <p className="hero-subtitle">
              Visualize historical grade data for UW-Madison to compare course
              and section difficulty. Pick your classes with confidence.
            </p>
            <div className="hero-search-wrapper">
              <SearchBox
                size="huge"
                fluid={false}
                autoFocus={true}
                placeholder={text}
              />
            </div>

            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <i aria-hidden="true" className="database icon"></i>
                </div>
                <h3>Sourced from Official Records</h3>
                <p>
                  Directly sourced from UW-Madison Registrar reports dating back
                  to 2006.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i aria-hidden="true" className="chart bar icon"></i>
                </div>
                <h3>Visualized</h3>
                <p>
                  We transform millions of rows of raw PDF data into simple,
                  readable charts.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i aria-hidden="true" className="users icon"></i>
                </div>
                <h3>Student & Alumni Driven</h3>
                <p>
                  An independent, open-source project built by Badgers to help
                  Badgers.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <Header as="h2">
          <Header.Content>Other UW Madison Student Projects</Header.Content>
          <Header.Subheader className="promo-subheader">
            Check out these helpful tools built by UW Madison students. These
            projects are not affiliated with Madgrades — use at your own risk.
          </Header.Subheader>
        </Header>
        <div className="promo-grid">        <PromoCard
          title="MadSpace"
          description="Course review platform for UW-Madison with searchable reviews, multi‑dimension ratings, and GPA/grade-distribution context."
          link="https://madspace.app"
          dateAdded="2026-02-13"
        />

        <PromoCard
          title="BadgerBase"
          description="Aggregates Madgrades grade data, live enrollment, and RateMyProfessor ratings into a single connected dataset for advanced querying."
          link="https://badgerbase.app"
          dateAdded="2026-02-13"
        />

        <PromoCard
          title="UW Course Map"
          description="Visualize course prerequisites with an interactive graph. Explore 10,000+ courses, view detailed course info, and check professor ratings all in one place."
          link="https://uwcourses.com"
          dateAdded="2025-11-24"
        />

        <PromoCard
          title="EnrollAlert"
          description="Get notified instantly when seats open up in your courses. Real-time updates synced with UW Course Search & Enroll give you peace of mind and the best chance to snag that perfect class."
          link="https://enrollalert.com"
          dateAdded="2025-11-22"
        />

        <PromoCard
          title="enRollBadge"
          description="Sign up today to receive real-time notifications when classes open!"
          link="http://enrollbadge.com"
          dateAdded="2023-01-01"
        />

        <PromoCard
          title="MadHousing"
          description="Love your dorm or don't? Come share your opinion! Review UW-Madison dorms and help future students make informed housing decisions."
          link="http://madhousing.com"
          dateAdded="2023-01-01"
        />
        </div>
      </Container>
    </div>
  );
};
export default Home;
