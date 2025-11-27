module.exports = {
  apps: [
    {
      name: "chat-app",
      script: "server.js",
      watch: true,

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
    
      },

  
    },
  ],
};
