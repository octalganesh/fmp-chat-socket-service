module.exports = {
  apps: [
    {
      name: "chat-app",
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,

      env_development: {
        NODE_ENV: "development",
        PORT: 3000,
        MONGO_URI:
          "mongodb+srv://arpitkhandelwal_db_user:mSSAp6svVcTVwdVY@chatcluster.68s0tan.mongodb.net/development-chat-db?retryWrites=true&w=majority",
        JWT_SECRET: "fsm",
      },
      env_staging: {
        NODE_ENV: "staging",
        PORT: 3001,
        MONGO_URI:
          "mongodb+srv://arpitkhandelwal_db_user:mSSAp6svVcTVwdVY@chatcluster.68s0tan.mongodb.net/staging-chat-db?retryWrites=true&w=majority",
        JWT_SECRET: "fsm",
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGO_URI:
          "mongodb+srv://arpitkhandelwal_db_user:mSSAp6svVcTVwdVY@chatcluster.68s0tan.mongodb.net/production-chat-db?retryWrites=true&w=majority",
        JWT_SECRET: "fsm",
        instances: "max",
        exec_mode: "cluster",
        watch: false,
        max_memory_restart: "500M",
        out_file: "/var/log/chat-app/prod-out.log",
        error_file: "/var/log/chat-app/prod-error.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      },

      autorestart: true,
      max_restarts: 10,
      restart_delay: 4000,
      merge_logs: true,
      namespace: "chat",
    },
  ],
};
