module.exports = {
  apps: [
    {
      name: "BURAK-BACKEND",
      script: "./dist/server.js",
      // Several instances only with Redis: rate limits and caches must be shared (docs/AUDIT.md D-3)
      instances: process.env.REDIS_URL ? "max" : 1,
      exec_mode: process.env.REDIS_URL ? "cluster" : "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
