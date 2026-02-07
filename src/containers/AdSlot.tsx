import { Component } from "react";

declare global {
  interface Window {
    adsbygoogle: Array<Record<string, never>>;
  }
}

interface AdSlotProps {
  slot: string;
  adWidth?: string;
  adHeight?: string;
}

class AdSlot extends Component<AdSlotProps> {
  componentDidMount = (): void => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
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
