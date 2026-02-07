import React from 'react';
import { Card, Button, Icon, Label } from 'semantic-ui-react';

interface PromoCardProps {
  title: string;
  description?: string;
  link: string;
  dateAdded?: string;
}

const PromoCard: React.FC<PromoCardProps> = ({ title, description, link, dateAdded }) => {
  const isNew = dateAdded ? (() => {
    const addedDate = new Date(dateAdded);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return addedDate > sixMonthsAgo;
  })() : false;

  return (
    <Card fluid raised>
      <Card.Content>
        <Card.Header>
          {title}
          {isNew && (
            <Label color="red" size="mini" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
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
      >
        <Icon name="external alternate" />
        Visit {title}
      </Button>
    </Card>
  );
};

export default PromoCard;
