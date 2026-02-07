import React, { useEffect } from "react";

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

const AdSlot: React.FC<AdSlotProps> = ({ slot, adWidth, adHeight }) => {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "inline-block",
        width: adWidth || "auto",
        height: adHeight || "auto",
      }}
      data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
      data-ad-slot={slot}
    ></ins>
  );
};

export default AdSlot;
