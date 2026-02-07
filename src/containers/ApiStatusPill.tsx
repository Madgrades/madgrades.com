import React, { useEffect, useState } from "react";
import { Label, Icon, SemanticCOLORS } from "semantic-ui-react";
import fetchStatus from "../utils/fetchStatus";

const statusLink = "https://stats.uptimerobot.com/pZaStpJFAt";

const ApiStatusPill: React.FC = () => {
  const [uptime, setUptime] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string>("N/A");

  useEffect(() => {
    fetchStatus().then((monitor) => {
      if (monitor !== undefined && monitor.uptime !== undefined) {
        setUptime(monitor.uptime);
        setStatus(monitor.status);
      }
    });
  }, []);

  const uptimePercent =
    uptime === undefined ? "N/A" : uptime >= 100 ? 100 : uptime.toFixed(2);

  let icon: "thumbs down" | "thumbs up" = "thumbs down";
  let text = `${uptimePercent}% Uptime`;
  let color: SemanticCOLORS | undefined;

  if (status === "N/A") {
    text = "Unknown Status";
    color = undefined;
  } else if (status === "DOWN") {
    text = "API Down";
    color = "red";
  } else if (status === "SEEMS_DOWN") {
    text = "API Unstable";
    color = "orange";
  } else if (uptime !== undefined && uptime < 75) {
    color = "red";
  } else if (uptime !== undefined && uptime < 95) {
    color = "orange";
  } else if (uptime !== undefined && uptime < 99) {
    color = "yellow";
    icon = "thumbs up";
  } else {
    color = "green";
    icon = "thumbs up";
  }

  return (
    <Label horizontal color={color} as="a" href={statusLink}>
      <Icon name={icon} /> {text}
    </Label>
  );
};

export default ApiStatusPill;
