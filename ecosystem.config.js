module.exports = {
  apps: [
    {
      name: "BURAK-BACKEND",
      script: "./dist/server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
