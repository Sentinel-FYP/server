const http = require("https");

const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_BASE_URL = process.env.ONESIGNAL_BASE_URL;

const optionsBuilder = (method, body) => {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${ONESIGNAL_API_KEY}`,
  };

  const options = {
    method,
    headers,
  };

  if (body) {
    headers["Content-Length"] = Buffer.byteLength(JSON.stringify(body));
    options.headers = headers;
  }

  return options;
};

const sendNotification = (message, title, userId) => {
  const body = {
    app_id: ONESIGNAL_APP_ID,
    title: title,
    contents: {
      en: message,
    },
    headings: {
      en: title,
    },
    ios_badgeType: "Increase",
    ios_badgeCount: 1,
  };

  if (!userId) {
    body.included_segments = ["Total Subscriptions"];
  } else {
    body.include_aliases = {
      external_id: [userId],
    };
    body.target_channel = "push";
  }

  const options = optionsBuilder("POST", body);
  const req = http.request(`${ONESIGNAL_BASE_URL}/notifications`, options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("Notification Response:", responseData);
    });
  });

  // Handle errors
  req.on("error", (error) => {
    console.error("Notification Error:", error);
  });

  // Send the data in the request body
  if (body) {
    req.write(JSON.stringify(body));
  }

  req.end();
};

module.exports = sendNotification;
