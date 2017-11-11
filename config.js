require('dotenv').config();

module.exports = {
  DB: {
    test: 'mongodb://localhost/northcoders-news-api-test',
    dev: process.env.MONGO_URI || 'mongodb://localhost/northcoders-news-api-dev'
  },
  PORT: {
    test: 3090,
    dev: process.env.PORT
  }
};
