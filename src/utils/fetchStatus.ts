const API_URL = 'https://api.uptimerobot.com/v2/getMonitors';
const API_KEY = import.meta.env['VITE_UPTIME_ROBOT_API_KEY'];

const errorCodes: Record<number, string> = {
  0: "PAUSED",
  1: "NOT_CHECKED",
  2: "UP",
  8: "SEEMS_DOWN",
  9: "DOWN"
};

interface StatusResponse {
  uptime: number;
  status: string;
}

async function fetchStatus(): Promise<StatusResponse | undefined> {
  const now = new Date();
  const before = new Date();
  before.setDate(now.getDate() - 7);

  return await fetch(API_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `api_key=${API_KEY}&format=json&custom_uptime_ranges=${Math.floor(before.getTime() / 1E3)}_${Math.floor(now.getTime() / 1E3)}`
  })
    .then(async res => {
      const json = await res.json();
      if (!json || !json["monitors"]) {
        return undefined;
      }
      const monitor = json["monitors"][0];
      return {
        "uptime": parseFloat(monitor["custom_uptime_ranges"]),
        "status": errorCodes[monitor["status"]] || "NOT_CHECKED"
      };
    }).catch(err => {
      console.error('Failed to fetch uptime', err);
      return {
        "uptime": 0.0,
        "status": "NOT_CHECKED",
      };
    });
}

export default fetchStatus;
