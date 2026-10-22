module.exports = {
  apps: [
    {
      name: "BURAK-BACKEND",
      script: "./dist/server.js",
      instances: 1, // in-memory rate limits & AI cache are per-process; see docs/AUDIT.md (D-3)
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
