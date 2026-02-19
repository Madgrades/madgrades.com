import React from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";

/**
 * Promotional card component for showcasing UW Madison student-created sites
 */
const PromoCard = ({ title, description, link, dateAdded }) => {
  // Check if the card was added within the last 6 months
  const isNew = dateAdded
    ? (() => {
        const addedDate = new Date(dateAdded);
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return addedDate > sixMonthsAgo;
      })()
    : false;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="promo-card"
    >
      <div className="promo-content">
        <div className="promo-header">
          <h3>
            {title}
            {isNew && <span className="new-badge">New!</span>}
          </h3>
          <Icon name="external alternate" className="external-icon" />
        </div>
        <p className="promo-description">{description}</p>
      </div>
    </a>
  );
};

PromoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  dateAdded: PropTypes.string,
};
export default PromoCard;
