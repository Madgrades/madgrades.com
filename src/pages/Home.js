import React from "react";
import { Container, Header, Divider } from "semantic-ui-react";
import PromoCard from "../containers/PromoCard";

const Home = () => {
  document.title = "UW Madison Grade Distributions - Madgrades";

  return (
    <div className="Home">
      <Container>
        <Header as="h1">
          <Header.Content>Madgrades</Header.Content>
          <Header.Subheader>
            UW Madison grade distribution visualizer built for students.
          </Header.Subheader>
        </Header>

        <p>
          Find grade distributions for University of Wisconsin - Madison (UW
          Madison) courses. Easily compare cumulative course grade distributions
          to particular instructors or semesters to get insight into a course
          which you are interested in taking. Get started by searching for a
          course in the search bar above.
        </p>

        <p>
          Note that this website is not necessarily complete and may contain
          bugs, misleading information, or errors in the data reported. Please
          help out by{" "}
          <a
            href="https://form.jotform.com/80705132647151"
            target="_blank"
            rel="noopener noreferrer"
          >
            reporting issues
          </a>{" "}
          or{" "}
          <a
            href="https://github.com/Madgrades/madgrades.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            contributing fixes
          </a>
          .
        </p>

        <Divider section />

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
