import React from "react";
import PropTypes from "prop-types";
import { Card, Button, Icon, Label } from "semantic-ui-react";

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
    <Card fluid raised>
      <Card.Content>
        <Card.Header>
          {title}
          {isNew && (
            <Label
              color="red"
              size="mini"
              style={{ marginLeft: "8px", verticalAlign: "middle" }}
            >
              New!
            </Label>
          )}
        </Card.Header>
        <Card.Description>{description}</Card.Description>
      </Card.Content>
      <Button
        as="a"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        attached="bottom"
        secondary
      >
        <Icon name="external alternate" />
        Visit {title}
      </Button>
    </Card>
  );
};

PromoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  link: PropTypes.string.isRequired,
  dateAdded: PropTypes.string,
};

export default PromoCard;
