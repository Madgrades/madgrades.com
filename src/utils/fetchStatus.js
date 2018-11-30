
const API_URL = 'https://api.uptimerobot.com/v2/getMonitors';
const apiKey = 'm781497538-14313d0dceb833046f430ad9';

const errorCodes = {
  0: "PAUSED",
  1: "NOT_CHECKED",
  2: "UP",
  8: "SEEMS_DOWN",
  9: "DOWN"
}

async function fetchStatus() {
  const now = new Date();
  const before = new Date(); 
  before.setDate(now.getDate() - 7);

  return await fetch(API_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `api_key=${apiKey}&format=json&custom_uptime_ranges=${before/1E3|0}_${now/1E3|0}`
  })
    .then(async res => {
      const json = await res.json();
      return json["monitors"][0];
    })
    .then(monitor => {
      return {
        "uptime": parseFloat(monitor["custom_uptime_ranges"], 100),
        "status": errorCodes[monitor["status"]]
      }
    });
}

export default fetchStatus;