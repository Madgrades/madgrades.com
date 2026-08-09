import React, { useMemo, useState } from "react";
import "../styles/containers/SponsorBanner.scss";

const SponsorBanner = ({ sponsor }) => {
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem(sponsor.storageKey) === "true",
  );

  const tagline = useMemo(
    () => sponsor.taglines[Math.floor(Math.random() * sponsor.taglines.length)],
    [],
  );

  const dismiss = () => {
    localStorage.setItem(sponsor.storageKey, "true");
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div className="SponsorBanner">
      <span className="sponsor-tagline">
        {tagline}{" "}
        <a
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="sponsor-apply"
        >
          <strong>{sponsor.callToAction}</strong>
        </a>
      </span>
      <button
        className="sponsor-dismiss"
        onClick={dismiss}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export default SponsorBanner;
