import { useEffect } from 'react';

interface AdSlotProps {
  slot: string;
  adWidth?: string;
  adHeight?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

function AdSlot({ slot, adWidth, adHeight }: AdSlotProps) {
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: 'inline-block',
        width: adWidth || 'auto',
        height: adHeight || 'auto',
      }}
      data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT}
      data-ad-slot={slot}
    ></ins>
  );
}

export default AdSlot;
