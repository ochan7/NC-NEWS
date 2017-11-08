require('dotenv').config();

module.exports = {
  DB: {
    test: 'mongodb://localhost/northcoders-news-api-test',
    dev: process.env.MONGO_URI
  },
  PORT: {
    test: 3090,
    dev: 3000
  }
};
