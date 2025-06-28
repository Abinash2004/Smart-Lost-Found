const { createClient } = require("redis");
const client = createClient({ url: process.env.REDIS_URL });

client.on("error", err => console.error("Redis Error:", err));
client.connect();

module.exports = client;