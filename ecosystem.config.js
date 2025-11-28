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
          "mongodb+srv://hardikkhurana_db_user:kVjmZLi9bSzgYVDS@cluster0.ckgioeb.mongodb.net/development-chat-db?retryWrites=true&w=majority",
        JWT_SECRET: "fsm",
      },
      env_staging: {
        NODE_ENV: "staging",
        PORT: 3001,
        MONGO_URI:
          "mongodb+srv://hardikkhurana_db_user:kVjmZLi9bSzgYVDS@cluster0.ckgioeb.mongodb.net/staging-chat-db?retryWrites=true&w=majority",
        JWT_SECRET: "fsm",
      },

      env_production: {
        NODE_ENV: "production",
        PORT: 3000,
        MONGO_URI:
          "mongodb+srv://hardikkhurana_db_user:kVjmZLi9bSzgYVDS@cluster0.ckgioeb.mongodb.net/production-chat-db?retryWrites=true&w=majority",
        JWT_SECRET: "fsm",
    
      },

  
    },
  ],
};
