import React from "react";
import PropTypes from "prop-types";
import { Icon, Modal, Button, TransitionablePortal } from "semantic-ui-react";

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

  // state for modal visibility
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const confirmNavigation = () => {
    setModalOpen(false);
    // prefer https if possible
    const safeLink = link.replace(/^http:\/\//, "https://");
    window.open(safeLink, "_blank", "noopener,noreferrer");
  };

  // portal close handler (also used if user clicks outside)
  const handlePortalClose = () => setModalOpen(false);

  return (
    <>
      <a
        href={link}
        onClick={handleClick}
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

      <TransitionablePortal
        open={modalOpen}
        onClose={handlePortalClose}
        transition={{ animation: "scale", duration: 200 }}
      >
        <Modal
          open
          size="small"
          onClose={handlePortalClose}
          // no transition prop here; portal handles it
        >
          <Modal.Header>
            Leaving madgrades.com
            <Icon
              name="close"
              onClick={handlePortalClose}
              style={{ cursor: "pointer", float: "right" }}
            />
          </Modal.Header>
          <Modal.Content>
            <p>You are about to visit an external website:</p>
            <pre style={{ background: "rgba(0,0,0,0.05)", padding: "0.5em" }}>
              <code>{link.replace(/^http:\/\//, "https://")}</code>
            </pre>
            <p>
              Madgrades is not affiliated with this site and cannot guarantee
              its security, privacy, or integrity. Please proceed at your own
              risk. Do not enter personal information unless you trust the
              destination.
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={handlePortalClose}>Cancel</Button>
            <Button positive onClick={confirmNavigation}>
              Continue
            </Button>
          </Modal.Actions>
        </Modal>
      </TransitionablePortal>
    </>
  );
};

PromoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  dateAdded: PropTypes.string,
};
export default PromoCard;
