import React, { Component } from "react";
import PropTypes from "prop-types";

class AdSlot extends Component {
  static propTypes = {
    slot: PropTypes.string.isRequired,
    adWidth: PropTypes.string,
    adHeight: PropTypes.string,
  };

  componentDidMount = () => {
    // If AdSense client is not configured, skip pushing to `adsbygoogle`.
    // This prevents an uncaught TagError like "Ad client is missing from the slot".
    const adClient = import.meta.env.VITE_ADSENSE_CLIENT;
    if (!adClient) {
      // eslint-disable-next-line no-console
      console.warn("Ad client not configured — skipping adsbygoogle.push()");
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("adsbygoogle.push() failed:", err);
    }
  };

  render = () => (
    <ins
      className="adsbygoogle"
      style={{
        display: "inline-block",
        width: this.props.adWidth || "auto",
        height: this.props.adHeight || "auto",
      }}
      data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
      data-ad-slot={this.props.slot}
    ></ins>
  );
}

export default AdSlot;
