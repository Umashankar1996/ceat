// PM2 Ecosystem Config — CEAT TouchPoint
// Must be .cjs because package.json has "type": "module"
//
// Usage:
//   pm2 start ecosystem.config.cjs            # start
//   pm2 restart ceat-touchpoint-api           # restart
//   pm2 stop    ceat-touchpoint-api           # stop
//   pm2 delete  ceat-touchpoint-api           # remove from PM2
//   pm2 logs    ceat-touchpoint-api           # tail logs
//   pm2 save                                  # persist across reboots
//   pm2 startup                               # generate OS startup script

module.exports = {
  apps: [
    {
      name: "ceat-touchpoint-api",
      script: "server/index.js",

      // ESM requires fork mode — do NOT use cluster
      exec_mode: "fork",
      instances: 1,

      // Node flags — none needed; PM2 passes "type":"module" automatically
      node_args: "",

      // Restart policy
      watch: false,               // set true only in dev — restarts on any file change
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 3000,

      // Environment — production
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,

        // ── Database ──────────────────────────────────────────
        DB_SERVER:                   "EC2AMAZ-6TEKQ7M\\SQL_2022",
        DB_DATABASE:                 "TP_Cogent_Assets",
        DB_USER:                     "sa",
        DB_PASSWORD:                 "YourSQLPasswordHere",
        DB_ENCRYPT:                  "false",
        DB_TRUST_SERVER_CERTIFICATE: "true",

        // ── Auth ──────────────────────────────────────────────
        JWT_SECRET: "change-this-to-a-long-random-secret",

        // ── CORS — set to your frontend domain ────────────────
        ALLOWED_ORIGIN: "http://localhost:5173,http://localhost:5174,https://vmschennai.ceat.com",

        // ── App branding ──────────────────────────────────────
        APP_NAME:    "TouchPoint",
        APP_COMPANY: "CEAT",

        // ── File uploads ──────────────────────────────────────
        UPLOAD_DIR: "Data/VehicleImages",
      },

      // Environment — development (for pm2 start without --env)
      env: {
        NODE_ENV: "development",
        PORT: 5000,
        DB_SERVER:                   "EC2AMAZ-6TEKQ7M\\SQL_2022",
        DB_DATABASE:                 "TP_Cogent_Assets",
        DB_USER:                     "sa",
        DB_PASSWORD:                 "YourSQLPasswordHere",
        DB_ENCRYPT:                  "false",
        DB_TRUST_SERVER_CERTIFICATE: "true",
        JWT_SECRET: "dev-secret-change-in-production",
        ALLOWED_ORIGIN: "http://localhost:5173,http://localhost:5174,https://vmschennai.ceat.com",
        APP_NAME:    "TouchPoint",
        APP_COMPANY: "CEAT",
        UPLOAD_DIR: "Data/VehicleImages",
      },

      // Logs
      out_file: "logs/api-out.log",
      error_file: "logs/api-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
